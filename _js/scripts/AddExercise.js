let obsidian = null;

module.exports = async function listFiles(params) {

    console.log("Script: Create exercise.");

    obsidian = params.obsidian;
    const templater = app.plugins.plugins["templater-obsidian"].templater;
    const dv = app.plugins.plugins['dataview'].api;
    const cache = this.app.metadataCache;
    let allFiles = this.app.vault.getMarkdownFiles();

    const activeFile = app.workspace.getActiveFile();
    let metadata = cache.getFileCache(activeFile);
    const exerciseIds = metadata.frontmatter['exercises'];
    const workout_id = metadata.frontmatter['id'];
    const workoutOrder = metadata.frontmatter['exercises'];
    const exercises = [];

    // Count performed exercises
    const performedEx = filterFiles((fm, tags) => {
        return (tags.includes('#exercise') || tags.includes('#start')) && fm['workout_id'] == workout_id;
    }, allFiles);
    let performedExerciseCount = performedEx.length;

    // If no exercises have been performed, add "start"
    if (performedExerciseCount == 0) {
        const startEx = filterFiles((fm, tags) => { return tags.includes('#start') && fm['workout_id'] == null }, allFiles);
        if (startEx.length > 0) {
            exercises.push(startEx[0]);
        }
    } else { // add workout exercises that have not been performed
        // Get all exercises for this workout
        const workoutEx = filterFiles((fm, tags) => {
            return tags.includes('#exercise') && fm['workout_id'] == null && exerciseIds.includes(fm['id']);
        }, allFiles);
        // filter out performed exercises -> only remaining left
        const remainingEx = filterFiles((fm, tags) => {
            return filterFiles((fm2, tags2) => { return fm2['id'] == fm['id'] }, performedEx).length == 0;
        }, workoutEx);
        exercises.push.apply(exercises, remainingEx);
    }

    // Create a mapping of exercises by their ID for quick lookup
    const exerciseMap = {};
    for (const exercise of exercises) {
        const metadata = cache.getFileCache(exercise);
        if (metadata && metadata.frontmatter && metadata.frontmatter['id']) {
            exerciseMap[metadata.frontmatter['id']] = exercise;
        }
    }

    console.log('exerciseMap:', exerciseMap);

    // Ensure everything is in the same order as exercises
    const sortedExercises = (workoutOrder || []).map(orderId => {
        console.log('Mapping order ID:', orderId);
        return exerciseMap[orderId];
    }).filter(Boolean);

    console.log('sortedExercises:', sortedExercises);

    if (performedExerciseCount > 0) {
        // Add custom at bottom
        const custom = filterFiles(function (frontmatter, tags) { return tags.includes('#custom') && frontmatter['workout_id'] == null; }, allFiles);
        if (custom.length > 0) {
            sortedExercises.push(custom[0]);
        }
        // Add choice to show all exercises, regardless of workout
        sortedExercises.push({ basename: 'Show all exercises' });
    } else {
        // For the initial start without any performed exercises
        if (exercises.length > 0) {
            sortedExercises.unshift(exercises[0]);
        }
    }

    // Display files to select
    let notesDisplay = await params.quickAddApi.suggester(
        (file) => file.basename,
        sortedExercises
    );

    if (notesDisplay == null) {
        params.variables = { notePath: "" };
        return;
    }

    if (notesDisplay.basename == 'Show all exercises') {
        let allExercises = filterFiles((frontmatter, tags) => {
            return tags.includes("#exercise") && frontmatter['workout_id'] == null;
        }, allFiles);
        // Display all exercises
        notesDisplay = await params.quickAddApi.suggester(
            (file) => file.basename,
            allExercises);
    }
    if (notesDisplay == null) {
        params.variables = { notePath: "" };
        return;
    }

    metadata = app.metadataCache.getFileCache(activeFile);
    const date = metadata.frontmatter['date'];
    let newId = metadata.frontmatter['id'];
    console.log('id: ' + newId);
    if (newId == null) {
        newId = generateGuid();
        console.log("Generated ID: " + newId);
        await update('id', newId, activeFile.path);
    }

    // Expand template
    let templateFile = app.vault.getAbstractFileByPath(notesDisplay.path);
    // Get folder of active file
    let tmp = app.vault.getAbstractFileByPath(activeFile.path).parent;
    // Get TFolder of target path for new file
    let targetFolder = app.vault.getAbstractFileByPath(tmp.path + "/Log");
    // Create new file from template
    let fileName = (targetFolder.children.length + 1).toString();
    let newNote = await templater.create_new_note_from_template(templateFile, targetFolder, fileName, false);

    // Add id manually to FontMatter of new file
    let content = await app.vault.read(newNote);
    const regex = /---\n+/m;
    const subst = `---\nworkout_id: ${newId}\n`;
    content = content.replace(regex, subst);

    await app.vault.modify(newNote, content);

    // Pass selected note's path to notes variable
    params.variables = { notePath: newNote.path };
}

function filterFiles(filterFunction, files) {
    const result = [];
    for (let f of files) {
        const metadata = app.metadataCache.getFileCache(f);
        const tags = obsidian.getAllTags(metadata);
        if (filterFunction(metadata.frontmatter, tags)) {
            result.push(f);
        }
    }
    return result;
}

function generateGuid() {
    let result = '';
    for (let j = 0; j < 6; j++) {
        if (j == 8 || j == 12 || j == 16 || j == 20) {
            result += '-';
        }
        let i = Math.floor(Math.random() * 16).toString(16).toUpperCase();
        result += i;
    }
    return result;
}