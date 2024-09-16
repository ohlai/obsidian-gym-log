
class workout
{
	renderHeader(n)
	{
		let self = n.dv.current()

		var timeStamp = moment(new Date(self['date']));
		var diff_days = timeStamp.diff(new Date(), "days");
		let date = moment(new Date(self['date']));
		console.log(diff_days);

		if(diff_days == 0)
			n.dv.header(1, date.format('YYYY-MM-DD') + " (today)");
		else if(diff_days == -1)
			n.dv.header(1, date.format('YYYY-MM-DD') + " (yesteday)");
		else if(diff_days == -2)
			n.dv.header(1, date.format('YYYY-MM-DD') + " (day before yesterday)");
		else
			n.dv.header(1, date.format('YYYY-MM-DD'));
	}

	renderRemaining(n)
	{
		let metadata = app.metadataCache.getFileCache(n.dv.current().file);
		// Type / index of workout
		let workoutExerciseIds = metadata.frontmatter['exercises'];
		let workout_order = metadata.frontmatter['workout_order'];
		// Get id of this workout
		let workoutId = metadata.frontmatter['id'];
		let allExercises = n.dv.pages('#exercise');
		let performedExercisesForThisWorkout = [];
		let allPerformedExercises = [];
		let templateExercisesForThisWorkout = [];

		// Workout with old format -> no remaining exercises!
		if(workoutExerciseIds == null)
			allExercises = []

		for(var e of allExercises)
		{
			console.log("loop");
			let metadata = app.metadataCache.getFileCache(e.file);
		    // Get the id from this exercise
		    let e_workoutId = metadata.frontmatter['workout_id'];
		    let e_id = metadata.frontmatter['id'];
			// if matching the workout id -> this exercise is already performed
			if(e_workoutId == workoutId)
				performedExercisesForThisWorkout.push(e);
			else if(e_workoutId != null)
				allPerformedExercises.push(e);
			else if(workoutExerciseIds.includes(e_id))
			{
				e.index = workout_order.indexOf(e_id);
				templateExercisesForThisWorkout.push(e);
			}
		}

		// Filter out performed exercises
		let remainingExercises = templateExercisesForThisWorkout.filter(e=> !performedExercisesForThisWorkout.find(tw=> tw['id'] == e['id']));

		// Sort according to set workout order
		remainingExercises.sort(function(a, b)
		{
			if( a.index === Infinity )
				return 1;
			else if( isNaN(a.index))
				return -1;
			else
				return a.index - b.index;
		});

		// Create new array with template exercises that contains last performed duration
		var templateExercies = [];
		for(var e of remainingExercises)
		{
			//let metadata = app.metadataCache.getFileCache(e.file);
		    // Get workout id for this exercise
		    //let e_id = metadata.frontmatter['workout_id'];

			// filter out performed exercises
			let thisExercise = this.fixExerciseName(e['exercise']);
			let tmp = allPerformedExercises.filter(pe=> thisExercise.includes(this.fixExerciseName(pe['exercise'])) || pe['id'] == e['id']);
			tmp = tmp.sort(function(a,b)
			{
			  // Turn your strings into dates, and then subtract them
			  // to get a value that is either negative, positive, or zero.
			  return new Date(a['date']) - new Date(b['date']);
			});

			// Select last excercise
			let lastPerformed = tmp[tmp.length-1];
			if(lastPerformed == null)
				lastPerformed = {};

			templateExercies.push(['[[' + e.file.path + '|' + e['exercise'] + ']]', e["muscle_group"], lastPerformed["weight"], lastPerformed["reps"]]);
		}

		n.dv.table(["Exercise", "Group", "Weight", "Reps"], templateExercies);
		    //.sort( e=> e['muscle_group'], 'desc'));
	}

	renderPerformed(n)
	{
		let metadata = app.metadataCache.getFileCache(n.dv.current().file);
		let workoutId = metadata.frontmatter['id'];
		let pages = n.dv.pages("#exercise")
		let exercises = pages.sort(p => p['date'], 'asc');

		var performedExercises = [];
		let prevTimeStamp;
		let firstTimeStamp;
		let lastTimeStamp;
		let i = 0;
		for(const e of exercises)
		{
			metadata = app.metadataCache.getFileCache(e.file);
			let exerciseId = metadata.frontmatter['workout_id'];
			if(exerciseId != workoutId)
				continue;

			// Set prevTimeStamp and firstTimeStamp if this is the first exercise
			if(i==0)
			{
				prevTimeStamp = moment(new Date(e['date']));
				firstTimeStamp = prevTimeStamp;
			}

			var timeStamp = moment(new Date(e['date']));
			// Save last time stamp, we don't know how many exercises we have...
			lastTimeStamp = timeStamp;

			var diff_sec = timeStamp.diff(prevTimeStamp, "seconds");
			var diff_min = Math.floor(diff_sec / 60).toString();
			var diff_sec_remain = (diff_sec % 60).toString();
			var timeDiff = diff_min + 'm ' + diff_sec_remain + "s";
			if(i==0)
				timeDiff = timeStamp.format("HH:mm");

			// for workout start weight and reps are empty
			let weight = e["weight"];
			let reps = e["reps"];
			let weightReps;
			if (weight === undefined && reps === undefined){
				weightReps = weight;
			}
			else if (weight === null) {
				weightReps = `? x ${reps}`;
			}
			else if (reps === null) {
				weightReps = `${weight} x ?`;
			}
			else {
				weightReps = `${weight} x ${reps}`;
			}

			performedExercises.push([
				`[[${e.file.path}|${e['exercise']}]]`, 
				weightReps, 
				timeDiff, 
				e['note']
			]);
			prevTimeStamp = timeStamp;
			i++;
		}

		n.dv.table(["Exercise", "Weight x Reps", "Time", "Notes"], performedExercises);

		if(lastTimeStamp != null && firstTimeStamp != null)
		{
			let total_sec = lastTimeStamp.diff(firstTimeStamp, "seconds");
			let diff_hours = (total_sec / 3600).toString();
			diff_hours = Math.floor(diff_hours);
			var diff_min_remain = ((total_sec % 3600)/60).toString();
			diff_min_remain = Math.round(diff_min_remain);
			let totalTimeStr = diff_hours + "h " + diff_min_remain + "m";

			n.dv.header(3, "Workout time: " + totalTimeStr);
		}
	}



	fixExerciseName(e)
	{
		return e.replace(' - ', ' ').toLowerCase();
	}
}