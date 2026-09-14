---
lang: en
slug: ops-analytics
title: "Turning scattered shift notes into one operating picture"
description: "Building the analytics layer of warehouse operations: deciding which few numbers deserve to exist, and making each one lead to a decision someone can act on."
headline: "1 reporting view in place of scattered shift notes"
period: Feb 2026 – present
role: "Warehouse Operations Analyst Supervisor · ASTRO, Jakarta"
tags: [Data Analytics, Warehouse Operations, Product Management]
order: 3
featured: true
measured:
  - Throughput across inbound, storage and outbound
  - Accuracy of the records the reporting sits on
  - Coverage — how much real activity is actually captured
  - Decision latency, from report available to action taken
---

## Context

This is current work, so I will describe it as an in-progress system rather than a finished one. After four years in quality and inventory, I moved to the analytics side of warehouse operations. The remit is straightforward to state and difficult to do well: make the operation legible. Inbound, storage and outbound generate an enormous amount of activity every day, and most of it disappears into individual memory at the end of a shift.

## Problem

The warehouse was not short of data. It was short of *shared* data. Each function held its own view — receiving knew its own numbers, storage knew its own, dispatch knew its own — and the picture only came together in meetings, verbally, after the fact. Meetings are a very slow, very expensive database.

Two consequences followed. Problems that crossed function boundaries were the last to be spotted, because they were invisible in every individual view and only obvious in the combined one. And decisions drifted toward whoever argued best, since there was no shared number to settle a disagreement.

There was also a trap on the other side, which I have seen enough times to plan around: responding to "we have no visibility" by building a dashboard with forty tiles on it. That produces the appearance of measurement and none of the benefit, because nobody can act on forty things and so they act on none.

## Approach

I treated this as a product problem rather than a reporting problem, and started from the decision rather than the data. For each candidate number, one question: who looks at this, and what do they do differently depending on what it says? Anything that could not answer that was decoration, however interesting.

That framing has a useful side effect on cost. Every indicator you publish is a permanent maintenance liability — it has to keep being correct, and when its source changes someone has to fix it. Fewer, better-chosen indicators is not just a design preference, it is a lower operating cost.

I also insisted on measuring coverage alongside every accuracy figure. My inventory work taught me that lesson expensively: a number that looks excellent because it is only sampling the easy part of the operation is worse than no number, because it produces confidence rather than doubt.

## Action

The work runs in three strands. Consolidating inbound, storage and outbound activity into one view that every function reads from, so the cross-boundary problems become visible. Defining indicators against the reality of the floor — my four years there is the actual advantage here, because I know which numbers a shift lead can influence and which merely describe their day back to them. And treating the reporting itself as a product: it has users, the users are busy, and if it is not readable in the thirty seconds available between two tasks it will not be read at all.

The current constraint is record quality. Reporting sits on top of underlying records, and a reporting layer built on weak records simply distributes that weakness faster and with more authority. So part of this work is unglamorous: improving what gets captured at source, before improving what gets shown.

## Result

In progress, and I would rather be accurate about that than overclaim. The direction is set: one shared operating picture instead of function-by-function views, a deliberately small indicator set where each number has a named owner and a named decision, and coverage reported next to accuracy so the numbers cannot flatter us.

*This is live work inside an operating business, so the figures stay internal. The design reasoning and the indicator definitions are things I can walk through in detail.*

## Learning

The lesson already earned: I underestimated how much of analytics work is negotiation rather than construction. Deciding that a number will *not* be published is harder than building it, because someone always wants it, and "we are not tracking that" sounds like a gap rather than a choice. Having the decision-first rule written down made those conversations shorter and less personal.

The other one, carried over from inventory and confirmed here: build the trust before the sophistication. A simple view that people believe beats an elaborate one they check against their own spreadsheet — because the moment anyone maintains a private shadow copy, you no longer have a shared picture at all.
