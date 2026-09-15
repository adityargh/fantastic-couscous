---
lang: en
slug: outbound-operations-tower
title: "One outbound control tower, instead of four teams watching four lists"
description: "Consolidating picking, packing, staging and dispatch into a single shift view, so an outbound problem is visible while there is still time to fix it."
headline: "1 shift board in place of 4 separate trackers"
period: Feb 2026 – present
role: "Warehouse Operations Analyst Supervisor · ASTRO, Jakarta"
system: Control tower
tags: [Operations Analytics, Outbound, Control Tower]
order: 1
featured: true
reconstructed: true
measured:
  - Open orders by stage against the dispatch cut-off
  - On-time dispatch rate per wave
  - Cycle time per stage, from release to handover
  - Age of every exception still unresolved
shots:
  - file: 01-shift-overview.png
    title: Shift overview
    alt: "Dashboard header showing the current wave, minutes remaining to cut-off, open order count, on-time dispatch rate and a stage funnel from released to dispatched."
    caption: "The first screen a shift lead opens. Four numbers, one countdown — deliberately small, because a screen that needs scrolling gets read once and then ignored."
  - file: 02-stage-board.png
    title: Stage board
    alt: "Board splitting open orders across four columns — released, picking, packing, staged — with counts, ageing bands and the slowest lane highlighted."
    caption: "Where the backlog actually sits. Ageing bands matter more than totals: a hundred fresh orders and a hundred stale ones are not the same problem."
  - file: 03-wave-sla.png
    title: Wave countdown
    alt: "Table of dispatch waves with cut-off time, orders remaining, required throughput per minute and a projected finish that turns red when it crosses the cut-off."
    caption: "Turns the question from how many are left into whether the current rate gets there. A projected finish is actionable; a raw count is not."
  - file: 04-exception-lane.png
    title: Exception lane
    alt: "List of blocked orders with reason codes such as short pick, damaged unit or address hold, each with owner, age in minutes and escalation status."
    caption: "Exceptions get their own lane so they cannot hide inside the backlog. Anything past its age limit escalates by itself, without someone remembering to escalate it."
---

## Context

Outbound is where a warehouse's whole day is finally graded. Everything upstream — receiving, put-away, counting, quality — either shows up as orders leaving on time or it does not. When I moved into the analytics role for the Jakarta hub, that grading happened in four places at once: picking had its own tracker, packing had another, staging was a whiteboard, and dispatch was a conversation.

Each of those was accurate. That was the problem. Four accurate views of four fragments do not add up to one view of the shift.

## Problem

The failure mode was not error, it was latency. A shift lead could tell you precisely how many orders were in picking, but not whether the shift was going to make its cut-off, because that answer required holding four numbers in their head and doing arithmetic while walking the floor. So in practice nobody did it. The shift discovered it was late at the moment it became late — at the cut-off, when the only options left are overtime, a partial dispatch, or a missed promise.

There was a second cost, quieter and larger. Because no one could see the whole flow, every intervention was local. Packing would get help because packing looked busy, when packing looked busy precisely because picking had released a batch unevenly forty minutes earlier. The operation kept treating symptoms at the stage where they surfaced rather than the stage where they started.

## Approach

I started from a constraint rather than a wish list: whatever I built had to be readable in the time a shift lead has while standing, which is roughly ten seconds. That constraint decides almost everything else. It rules out a page of charts. It rules out anything requiring a filter to be set before it means something. It forces a hierarchy — one screen that answers "are we going to make it", and detail underneath for when the answer is no.

The second decision was to report projection, not just position. A count of remaining orders is a fact about the past. A projected finish time, derived from the rate over the last stretch of the shift, is a claim about the future — and only a claim about the future can be acted on. It is also falsifiable, which matters: at the end of every wave the projection can be checked against what actually happened, so the model gets corrected instead of trusted.

I deliberately did not build per-person productivity into the main view. The moment a control tower doubles as a performance ranking, the numbers start being managed rather than reported, and the tower stops being able to see the operation. Throughput belongs at the lane level here; individual performance is a different conversation with a different tool.

## Action

The build came in three layers. First, a single definition of what an order's stage means — which sounds trivial and was not, because "packed" meant one thing to the packing team and another to dispatch, and the gap between those two definitions was where orders quietly disappeared for twenty minutes. Reconciling that definition was most of the first month's work and would have been worthless done later.

Second, the stage board with ageing bands rather than raw totals, so the backlog reveals its shape. Third, the exception lane: anything blocked leaves the normal flow, takes a reason code from a short fixed list, gets an owner and an age, and escalates on a timer rather than on someone's memory.

The hardest part was resisting additions. Every stakeholder had one more number that would be useful, and each one individually was. Collectively they would have rebuilt the four-tracker problem inside a single page. I kept a list of everything I turned down, which turned out to be the more valuable document — it is the record of what the tower is deliberately not for.

## Result

The shift now has one place where the answer to "are we going to make it" lives, and it is available early enough that the answer can still be changed. Interventions moved upstream: because release, picking and packing are visible side by side, an uneven release is now visible as an uneven release rather than as a packing problem forty minutes later.

The exception lane changed the character of blocked orders. They used to be discovered; now they are tracked. That is a smaller-sounding change than it is — the difference between a queue someone has to think to look at and a queue that raises its hand.

*The underlying figures belong to the operator, so I describe the mechanism and the indicators rather than publishing internal numbers. In a conversation I am happy to walk through how each indicator was defined and how the projection was calibrated.*

## Learning

My first projection model used the shift's average rate, and it was confidently wrong every single morning. Early-shift rate is not representative — the first wave carries setup, handover, and people arriving. Switching to a trailing window over the recent stretch of the shift fixed it. The general lesson I took: an average across a period that contains a structural break is not a summary of that period, it is a blend of two different operations.

I would also add the definition-reconciliation step to the front of any dashboard work I do from now on. I treated it as preparation. It was the actual deliverable — the board mostly just made the agreed definitions visible.
