---
lang: en
slug: antrian-inbound-frozen
title: "A queue board for frozen inbound, measured against the cold-chain window"
description: "Giving frozen deliveries a visible queue with a running exposure timer, so waiting at the dock becomes a measured risk instead of an invisible one."
headline: "1 queue board across 3 receiving lanes"
period: Mar 2025 – Sep 2025
role: "Quality Management Officer · ASTRO, Jakarta"
system: Queue management
tags: [Quality Assurance, Inbound, Cold Chain]
order: 4
featured: false
reconstructed: true
measured:
  - Wait time from arrival check-in to start of unloading
  - Share of frozen loads unloaded inside the cold-chain window
  - Queue length by hour of day, per receiving lane
  - Temperature-related rejections, traced to a queue position
shots:
  - file: 01-queue-board.png
    title: Live queue board
    alt: "Dock display listing frozen deliveries in arrival order with vehicle, supplier, assigned lane, waiting time and a coloured cold-chain status per row."
    caption: "The board everyone can see, including the driver. A visible queue removes the argument about whose turn it is and leaves only the actual constraint."
  - file: 02-check-in.png
    title: Arrival check-in
    alt: "Check-in form capturing vehicle, supplier, load type, arrival temperature, seal number and the timestamp that starts the exposure clock."
    caption: "Everything downstream depends on one honest timestamp. Check-in is deliberately short — a slow form gets filled in later, and later means made up."
  - file: 03-exposure-timer.png
    title: Exposure timer
    alt: "Detail view of a single load showing elapsed time since arrival against the allowed cold-chain window, with a progress bar approaching its limit."
    caption: "Waiting is not free for frozen goods. Showing the window being consumed turns an invisible cost into something a supervisor can prioritise against."
  - file: 04-queue-analysis.png
    title: Daily queue analysis
    alt: "Bar chart of average and longest wait times by hour of day, with a second series showing arrivals per hour and lane capacity marked as a line."
    caption: "The live board fixes today. This view is the argument for changing tomorrow's appointment pattern, because it shows arrivals against capacity."
---

## Context

Frozen and chilled goods are the only inbound category where time at the dock is itself a defect mechanism. A dry pallet waiting two hours is simply a delayed pallet. A frozen one waiting two hours has changed — and the change is cumulative, partly invisible, and not reversible by unloading faster afterwards.

I built this while holding site-wide quality governance, which is the function that carries the consequence of that difference. Receiving owned the dock, transport owned the arrivals, and quality owned what the product was like when it finally got inside.

## Problem

The queue existed. It just was not written down anywhere. Order of service was negotiated at the dock between drivers, receiving staff and whoever escalated most convincingly, and the waiting time of any given load was known only to the person sitting in the vehicle.

That has two consequences and the second is the expensive one. The obvious consequence is unfairness and friction. The real one is that an unmeasured wait cannot be traded off. When a supervisor chooses which vehicle to unload next, they are making a risk decision — and they were making it without the one input that matters, which is how much of each load's cold-chain window had already been spent. A load that arrived first is not necessarily the most urgent. A load that arrived third with a marginal arrival temperature might be.

There was also no way to argue about causes afterwards. When a rejection happened, it was recorded against the supplier or the product, because those are the fields that exist. Whether it had queued for twenty minutes or two hours was not captured anywhere, so that variable could never be examined — and a variable nobody records is a variable that quietly gets blamed on something else.

## Approach

I treated the queue as a quality control point rather than a logistics convenience. That framing decided the design: if waiting is a defect mechanism, then waiting has to be measured per load, against a defined limit, with the measurement visible while it is still accruing.

The core object is the exposure timer — elapsed time since check-in, shown against the allowed window. Not elapsed time alone, which means nothing without a reference, and not a simple position in a list, which tells you order but not urgency. The timer converts a queue into a prioritised queue, and prioritisation is the only reason to build it.

I made the board public at the dock, facing outward. That was contested, because a visible queue also makes the site's own delays visible to suppliers and drivers. I argued it the other way round: the delay was already visible to everyone standing in it. What the board removes is the argument about whose turn it is, which is the part that was consuming supervisor attention. It also does something subtler — a supplier who can see a consistent queue pattern has a reason to change their arrival time, and no reason at all while the pattern is invisible.

I did not attempt automatic lane assignment. Lane choice depends on things the system does not know, including what is already staged inside and who is available. The system's job was to make the trade-off legible, not to make it for someone.

## Action

Check-in came first and was kept deliberately small: vehicle, supplier, load type, arrival temperature, seal, timestamp. Everything the system does afterwards rests on that timestamp being honest, and an honest timestamp requires a form that can be completed in the rain, at the gate, in under a minute. Every field I was tempted to add was a field that would push check-in to "later", and later means reconstructed from memory.

Then the board, ordered by arrival but sorted visually by exposure status, so the eye lands on the most urgent row rather than the oldest. Then the per-load detail with the running window. Last, and most useful over time, the daily analysis: arrivals per hour against lane capacity.

That last view was the one that changed things structurally. Most of the queue was not created at the dock at all. It was created by an arrival pattern that clustered several deliveries into the same window while leaving other hours nearly empty — a scheduling problem being absorbed as a receiving problem.

## Result

Waiting became a number attached to a specific load, with a limit and an owner, instead of a shared background condition. Prioritisation at the dock could be argued from exposure rather than from arrival order or from whoever was most insistent. Rejections became traceable to a queue position, which meant the queue could finally be examined as a cause rather than assumed innocent.

The analysis view gave quality something it had never had in this area: a case about arrival scheduling supported by the site's own data rather than by anecdote.

*The underlying figures belong to the operator, so I describe the mechanism and the indicators rather than publishing internal numbers. In a conversation I can walk through how the exposure window was defined and how the queue was prioritised.*

## Learning

I initially started the exposure clock at check-in, which is the moment the system first sees the load. That is not the moment the risk starts — the risk starts when the vehicle arrives at the gate, and the gap between gate and check-in was precisely the unmeasured part I had set out to eliminate. Moving the start of the clock to gate arrival made the number larger and less flattering, and correct.

The broader lesson: a measurement that begins when your system becomes aware of something will always understate it, and the error is always in the comfortable direction. Choose the start of a clock from the physics of the problem, not from the convenience of the tooling.
