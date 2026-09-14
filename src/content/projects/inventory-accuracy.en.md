---
lang: en
slug: inventory-accuracy
title: "Making a dry-goods site count stock daily instead of monthly"
description: "Turning stock counting at a Cibitung dry-goods site from a month-end event into a daily routine that surfaces variance while the cause is still traceable."
headline: "6 months rebuilding how a site counts stock"
period: Sep 2025 – Feb 2026
role: "Dry Inventory Supervisor · ASTRO, Cibitung"
tags: [Inventory Control, Warehouse Operations, Process Improvement]
order: 1
featured: true
measured:
  - Stock accuracy against the system record
  - Cycle count coverage achieved per day
  - Elapsed time from variance found to cause identified
  - Adjustment volume, split by cause
---

## Context

Dry goods are the least dramatic category in a quick-commerce warehouse and the easiest to get quietly wrong. Nothing spoils, nothing beeps, and a unit that walked to the wrong shelf will sit there looking perfectly fine for weeks. I took over inventory control for a Cibitung site during a build-out period — the phase where volume, headcount and layout are all still moving, which is exactly when inventory discipline tends to be deferred until "things settle down".

## Problem

The counting model was the ordinary one: a large stock take at month-end, plus spot checks when something obviously did not add up. That model has a structural flaw that has nothing to do with effort. By the time a month-end count finds a discrepancy, the evidence that would explain it is gone. The receiving document, the person who put it away, the shift it happened on, the pallet it came from — all of that is four weeks cold. So the discrepancy gets adjusted rather than explained, and the same cause produces the same discrepancy next month.

The real cost was never the adjustment. It was that the operation kept paying for the same error repeatedly because it never learned the cause.

## Approach

I did not start by counting more. I started by asking what I wanted the count to *produce*. If the answer is "a correct closing number", monthly counting is adequate. If the answer is "an explanation", then the count has to happen while the trail is still warm — which means daily, small, and targeted, not monthly and total.

I chose cycle counting over a heavier system for a plain cost reason: it needs no new software, no capital, and no extra headcount. It converts one large, disruptive event into a small standing routine. The trade-off I accepted is that it demands consistency — a cycle count skipped is a cycle count that lies to you, because coverage gaps look identical to accuracy.

I deliberately did not add a second verification layer at putaway. An extra check is a cost paid on every single unit, forever. Finding the cause once and removing it is paid for once.

## Action

The routine was built in three parts. First, a daily count assignment sized to fit inside a normal shift rather than on top of it — if the routine only works on a quiet day, it does not work. Second, a discrepancy path that required a cause code, not just a quantity fix: no adjustment could be posted as a bare number. Third, an escalation rule that sent anything above a defined threshold up the same day instead of into a queue.

The friction was where it always is. A count that produces homework is a count people avoid, so the cause codes had to be short, few, and drawn from what actually goes wrong on that floor — not from a generic template. I worked them out from the first weeks of findings rather than deciding them in advance.

## Result

The site moved from a monthly reconciliation posture to a daily control posture. Variance began surfacing within the shift that produced it, which meant causes could be traced to a receiving batch, a location, or a step rather than absorbed as a number. Adjustments stopped being the end of the conversation and became the start of one.

*The underlying figures belong to the operator, so I describe the mechanism and the indicators rather than publishing internal numbers. In a conversation I can walk through how the indicators were defined and how they were read.*

## Learning

I over-designed the first version of the cause-code list. It had too many options, which meant people picked the nearest one rather than the right one, and the data was worse than having no codes at all. Cutting it down improved the data immediately — a lesson I now apply early: a category set that a tired person cannot use correctly at the end of a shift is not a category set, it is a wish.

I would also start the coverage tracking sooner. For the first stretch I was watching accuracy without watching how much of the site the counts had actually reached, and those two numbers have to be read together or the first one flatters you.
