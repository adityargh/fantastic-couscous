---
lang: en
slug: occupancy-monitoring-alert
title: "Alerting on storage occupancy before a zone runs out of space"
description: "Zone-level fill rate with thresholds that warn the shift lead while there is still somewhere to put the pallet, instead of after the aisle is blocked."
headline: "3 thresholds, 1 warning before saturation"
period: Mar 2026 – Jul 2026
role: "Warehouse Operations Analyst Supervisor · ASTRO, Jakarta"
system: Monitoring & alerting
tags: [Warehouse Operations, Monitoring, Capacity]
order: 2
featured: true
reconstructed: true
measured:
  - Fill rate per storage zone, refreshed through the shift
  - Hours each zone spent above its warning threshold
  - Put-away attempts rejected for want of a location
  - Time from alert raised to zone brought back under threshold
shots:
  - file: 01-zone-map.png
    title: Zone map
    alt: "Floor map of storage zones coloured by fill rate, with a legend for healthy, warning and critical, and a side panel listing the three fullest zones."
    caption: "Occupancy read as a floor plan rather than a table, because a put-away decision is spatial. You are choosing where to walk, not which row to sort by."
  - file: 02-fill-trend.png
    title: Fill-rate trend
    alt: "Line chart of fill rate across the last fourteen days for four zones, with the warning threshold drawn as a horizontal reference line."
    caption: "The trend answers a question the live number cannot: is this zone tight today, or has it been quietly tightening for two weeks?"
  - file: 03-threshold-rules.png
    title: Threshold rules
    alt: "Configuration table with one row per zone showing warning and critical percentages, the recipient of each alert and a quiet-hours setting."
    caption: "Thresholds are per zone, not global. A fast-moving zone at eighty per cent is normal; a slow-moving one at eighty per cent is already a problem."
  - file: 04-alert-log.png
    title: Alert log
    alt: "Chronological log of raised alerts showing zone, level, time raised, who acknowledged it, and the time taken to clear it."
    caption: "Every alert is closed by a person, and the log keeps the record. An alert nobody closes is how a monitoring system teaches people to ignore it."
---

## Context

A quick-commerce warehouse spends its whole day in tension between two flows: goods coming in, which need somewhere to go, and goods going out, which free that space up again. Storage occupancy is where those two flows meet. When it is healthy, nobody mentions it. When it is not, everything else gets slower in ways that never quite get attributed to the real cause.

I built this while covering warehouse operations analytics for the Jakarta hub, after a period running dry inventory at a second site — which is where I had first watched the problem from the receiving end.

## Problem

Occupancy was known, but only at the wrong times and the wrong resolution. There was a site-level number, reviewed periodically, and there was the direct knowledge of whoever happened to be putting stock away at that moment. Nothing sat between them.

That gap has a specific consequence. A site can sit at a comfortable average occupancy while one zone is completely saturated, because averages hide exactly the thing you need to see. The first signal that a zone was full was an operator holding a pallet with nowhere to put it — at which point the options are all bad: walk it to a distant zone and accept a slower pick later, put it in an aisle and accept a safety and accuracy problem, or hold it at the dock and push the congestion back into receiving.

None of those failures looked like an occupancy failure afterwards. They looked like slow put-away, or a misplaced unit, or a receiving delay. The cause kept getting recorded as one of its symptoms.

## Approach

The design question was not "how do we measure occupancy" — that number already existed. It was "how early does the number have to arrive to be worth anything", and the answer is: before the pallet is in someone's hands. That reframes the whole thing from reporting to alerting.

I made two decisions that shaped the rest. First, thresholds per zone rather than one global number, because zones are not comparable. A fast-moving zone empties itself several times a day and can safely run tight; a slow-moving zone at the same percentage has no natural relief coming and is genuinely in trouble. One threshold across both would either cry wolf on the first or stay silent on the second, and a monitoring system that does either gets switched off within a month.

Second, every alert has a named recipient and has to be closed by a person. This is the part teams usually skip, and it is what separates a monitoring system from a noise generator. An alert that expires on its own trains everyone to wait for it to expire.

I chose not to attempt automatic slotting recommendations. It was tempting and it was out of scope — the system's job is to say "this zone will be full soon, and here is how soon", and the person on shift is far better placed than I am to decide what to do about it. Advice that is right sixty per cent of the time is worse than no advice, because it costs attention to check.

## Action

The build started with the map rather than the metric. Occupancy is spatial information, and rendering it as a floor plan instead of a sorted table meant the put-away decision could be read directly off the screen. That one choice removed most of the interpretation work.

Then the trend view, because a live percentage is missing a dimension. A zone at eighty-five per cent that was at sixty last week is a different situation from a zone that has been at eighty-five for a month, and the response is different too — the first is a flow problem, the second a capacity problem.

The thresholds themselves I set conservatively at first and tuned down from there, deliberately in that order. Starting noisy and quietening down means every reduction is justified by a real false positive. Starting quiet and turning up sensitivity means you spend the first weeks not knowing what you are missing.

## Result

Occupancy moved from something discovered at the moment of put-away to something known in advance, at the resolution where a decision is actually made — the zone. The alert log turned what used to be a series of unconnected incidents into a record with a shape: which zones raise alerts, how often, and how long they take to clear.

That record is the part I value most. The live alert solves today's pallet. The log is what eventually lets someone argue for a layout or slotting change with evidence rather than with a strong feeling.

*The underlying figures belong to the operator, so I describe the mechanism and the indicators rather than publishing internal numbers. In a conversation I can walk through how the thresholds were set and how they were tuned.*

## Learning

My first version alerted on the critical threshold only. It was correct and it was useless — by the time a zone is critical, the decision has already been forced. Adding a warning level below it was the change that made the system worth having, and it taught me something I now treat as a rule: an alert is only useful if it fires while more than one option is still open. Anything later is a notification, not an alert.

I would also have instrumented the rejected put-away attempts from day one. I added that indicator late, and it turned out to be the clearest evidence of the problem — better than fill rate itself, because it counts the moments where the shortage actually cost something.
