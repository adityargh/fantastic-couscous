---
lang: en
slug: quality-system
title: "From line inspection to a quality system a site can actually run on"
description: "Three years and three roles moving quality from something a few people checked to a written standard the whole site works to, consistently across shifts."
headline: "3 roles, 3 years, 1 standard everyone works to"
period: Sep 2022 – Oct 2025
role: "QA Staff → QA Team Leader → Quality Management Officer · ASTRO"
tags: [Quality System, Process Improvement, Operations Management]
order: 2
featured: true
measured:
  - Non-conformance findings by category
  - Time to close a corrective action
  - Repeat findings between audit cycles
  - Consistency of inspection outcomes across shifts
---

## Context

I joined the operation as QA staff and left the quality function three years later as its officer. That progression matters to the story, because the problem changed shape at each step and so did the fix. At the line, quality is a pair of eyes. At team level, it is a set of agreements. At site level, it is a document that outlives whoever wrote it.

The operation was growing quickly through that period, and growth is the specific condition under which informal quality quietly stops working.

## Problem

When I started, inspection quality depended on who was inspecting. Two competent people, same shift, same product, could reach different verdicts — not through carelessness, but because the standard lived in each person's head rather than on paper. That is tolerable at small scale, where everyone was trained by the same person and drift is slow. It fails at scale, in a very particular way: it fails silently. There is no alarm for "our standards diverged". You only find out later, through a customer complaint or an audit finding, by which point the divergence has been running for months.

The second problem compounded it. Corrective actions were being raised and then not closed — recorded as done when the immediate symptom was gone, not when the cause was removed. So the same finding kept reappearing wearing a slightly different hat, and each reappearance was treated as a new incident rather than as evidence that the previous fix had not worked.

## Approach

Two options were open. The first was more inspection: add checks, add checkers, catch more. The second was standardisation: reduce the variance in how the check itself is performed. I argued for the second, and the reasoning was cost. More inspection scales linearly with volume — every unit of growth needs a proportional unit of checking, forever. Standardisation is paid once and then holds, and it makes the inspection you already do worth more because the results become comparable.

I also chose written-and-controlled over written-and-distributed. A standard that exists in five team folders is five standards within a quarter. One controlled reference, with a defined way to change it, is the only version of "written down" that survives contact with a busy operation.

The constraint I worked under: nobody gets extra hours to read documentation. So the standard had to be short enough to be used at the point of work, not a manual that gets acknowledged and then ignored.

## Action

As team leader I focused on the agreements: one written inspection standard, defined defect categories, and a training path so that a new QA member was calibrated against the document rather than against whoever trained them. Calibration is the part people skip — a written standard still drifts if nobody ever checks that two inspectors reading it reach the same verdict.

As quality management officer the scope widened to governance: keeping a single controlled document set, preparing for internal audit as an ordinary state rather than an event, and changing how corrective actions were closed. A finding could no longer be closed on the symptom. It needed a stated cause and a change that made the cause less likely, and it stayed open until that was in place.

The hardest part was not technical. Tightening closure rules means the open-findings list gets longer before it gets shorter, and that looks like deterioration to anyone reading the list as a scoreboard. It needed explaining more than once.

## Result

Quality stopped being a function that a few people carried and became a system the site ran on: a single reference, trained against, audited as routine, with corrective actions that were closed on cause rather than symptom. Repeat findings become visible when a system treats them as repeats — the value is not just fixing them, it is being able to see them at all.

*Internal figures stay with the operator. What I can set out is the design of the system and the indicators it was steered by.*

## Learning

I was too slow to separate "audit readiness" from "audit performance". For the first year I prepared for audits, which produced a burst of tidying before each one. Preparing for audits is a cost with no operational return; being permanently in a state where an audit is uneventful is cheaper and produces a better operation. I would make that shift much earlier.

The other lesson is about pace. I pushed the corrective-action closure rules through faster than the team's capacity to absorb them, and the first weeks produced resistance I could have avoided by staging it. A standard adopted slowly beats a standard imposed quickly and worked around.
