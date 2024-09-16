---
date: <% tp.date.now("YYYY-MM-DD HH:mm:ss") %>
workout_title: UL Mid 24 - Upper 1
exercises: [04002, 01003, 08002, 08001, 02002, 09001]
workout_order: [04002, 01003, 08002, 08001, 02002, 09001]
tags:
 - workout
---

```dataviewjs

const {workout} = customJS;
const note = {dv: dv, container: this.container, window: window};

workout.renderHeader(note);

```

## Remaining Exercises
```dataviewjs

const {workout} = customJS;
const note = {dv: dv, container: this.container, window: window};

workout.renderRemaining(note);

```

## Performed Exercises
```button
name Log
type command
action QuickAdd: Log
color green
```
^button-2vzj
```dataviewjs

const {workout} = customJS;
const note = {dv: dv, container: this.container, window: window};

workout.renderPerformed(note);

```