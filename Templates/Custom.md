---
id: custom
date: <% tp.date.now("YYYY-MM-DDTHH:mm:ss") %>
time: <% tp.date.now("HH:mm") %>
weight: <% await tp.system.prompt("Weight", "", true) %>
reps: <% await tp.system.prompt("Reps", "", true) %>
exercise: <% await tp.system.prompt("Exercise", "", true) %>
muscle_group: <% await tp.system.suggester(["Chest", "Back", "Shoulders", "Biceps", "Triceps", "Quads", "Hamstrings", "Glutes", "Calves", "other"], ["Chest", "Back", "Shoulders", "Biceps", "Triceps", "Quads", "Hamstrings", "Glutes", "Calves", "other"]) %>
note: <% await tp.system.prompt("Note", "", true) %>
rep_range: 6 - 12
sets: 6
tags:
 - exercise
 - custom
---

```dataviewjs

const {exercise} = customJS;
const note = {dv: dv, container: this.container, window: this.window};

exercise.renderDescription(note);

```



```dataviewjs

const {exercise} = customJS;
const note = {dv: dv, container: this.container, window: window};

exercise.renderRepsWeightChart(note);

```