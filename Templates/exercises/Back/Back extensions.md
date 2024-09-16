---
id: 01002
date: <% tp.date.now("YYYY-MM-DDTHH:mm:ss") %>
time: <% tp.date.now("HH:mm") %>
weight: <% await tp.system.prompt("Weight", "", true) %>
reps: <% await tp.system.prompt("Reps", "", true) %>
exercise: Back extensions
muscle_group: Back
note: <% await tp.system.prompt("Note", "", true) %>
rep_range: 6 - 12
sets: 6
video_url: 
instructions:
tags:
 - exercise
---

```dataviewjs

const {exercise} = customJS;
const note = {dv: dv, container: this.container, window: window};

exercise.renderDescription(note);
exercise.renderRepsWeightChart(note);

```