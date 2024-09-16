---
id: 03001
date: <% tp.date.now("YYYY-MM-DDTHH:mm:ss") %>
time: <% tp.date.now("HH:mm") %>
weight: <% await tp.system.prompt("Weight", "", true) %>
reps: <% await tp.system.prompt("Reps", "", true) %>
exercise: Standing calf raise
muscle_group: Calves
note: <% await tp.system.prompt("Note", "", true) %>
rep_range: 6 - 12
sets: 6
video_url: 
instructions:
tags:
 - exercise
---

## Notes
- Often superset with [[Tib raise]]

```dataviewjs

const {exercise} = customJS;
const note = {dv: dv, container: this.container, window: window};

exercise.renderDescription(note);
exercise.renderRepsWeightChart(note);

```