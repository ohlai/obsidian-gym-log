---
date: <% tp.date.now("YYYY-MM-DD HH:mm:ss") %>
workout_title: UL Mid 24 - Lower 2
exercises: [07004, 01002, 07001, 07003, 03001, 03003]
workout_order: [07004, 01002, 07001, 07003, 03001, 03003]
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