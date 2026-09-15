---
lang: en
slug: avas
title: "AVAS — validating absence while the shift can still be covered"
description: "Moving attendance exceptions from a month-end reconciliation to a same-day validation flow, so coverage decisions are made on data that is already settled."
headline: "1 same-day flow replacing 1 month-end reconciliation"
period: May 2026 – present
role: "Warehouse Operations Analyst Supervisor · ASTRO, Jakarta"
system: Attendance validation
tags: [Operations Management, Workforce, Process Improvement]
order: 6
featured: false
reconstructed: true
measured:
  - Share of absence records validated within the same shift
  - Age of the unvalidated backlog
  - Absence rate by shift and by function
  - Coverage gap against planned headcount, per shift
shots:
  - file: 01-submission-queue.png
    title: Submission queue
    alt: "Queue of absence submissions showing employee reference, shift, category such as sick leave or annual leave, submission time and validation status."
    caption: "One queue instead of a set of chat messages. The value is not the list itself — it is that every case now has a state that someone can see."
  - file: 02-validation-detail.png
    title: Validation detail
    alt: "Detail panel for a single submission with category, dates, supporting document attached, validator notes and approve or return actions."
    caption: "Validation needs the evidence next to the decision. Splitting them across two systems is how a queue quietly turns into a backlog."
  - file: 03-coverage-impact.png
    title: Coverage impact
    alt: "Shift grid comparing planned against available headcount by function, with shortfalls highlighted and the contributing absences listed beside each."
    caption: "The reason this is an operations system and not an HR form. An absence matters because of the shift it leaves short, not because of the record it creates."
  - file: 04-monthly-recap.png
    title: Monthly recap
    alt: "Summary table of absence by category and shift for the month, with a validated-versus-pending split and a comparison against the previous period."
    caption: "The recap is now a read-out of decisions already made, rather than the moment those decisions get made. That inversion is the whole project."
---

## Context

Attendance sounds like an administrative subject until you run shifts. Then it becomes the constraint that decides whether the plan for the day survives contact with the day. A warehouse shift is a fixed amount of work against a variable amount of people, and absence is most of that variance.

AVAS — the Astro Validation Absence System — came out of the analytics role for the Jakarta hub, for a straightforward reason: I kept needing reliable headcount data to explain operational numbers, and it kept not being reliable until several weeks after the fact.

## Problem

Absence was recorded, but validated late. Submissions arrived through whatever channel was at hand — a message, a call, a note passed at handover — and were reconciled at month end. That created two distinct problems, one operational and one analytical.

The operational problem is that coverage decisions get made on unsettled data. A shift lead deciding how to redistribute work needs to know who is actually absent and whether that absence is confirmed, and they need it at the start of the shift, not three weeks later. Without it, the same absence gets handled twice: once as a guess on the day, and once as a correction at month end.

The analytical problem is worse, because it contaminates everything else. Every productivity, throughput or cost-per-unit figure has headcount underneath it. If headcount is provisional for three weeks, then so is every operational number computed from it — and numbers that get revised after people have already acted on them stop being trusted, which is a much harder thing to repair than an error.

There was a third cost that is easy to overlook: disputes. Reconstructing a month-old absence from memory and message history is slow, uncomfortable, and produces outcomes nobody is confident in. Almost all of that cost disappears if the record is settled within a day of the event.

## Approach

The design principle was to move validation to the point where the evidence is still available and the decision still matters — the same shift. Everything else in the system follows from that.

I gave every submission an explicit state rather than treating it as a message that is either answered or not. A state can be counted, aged, and escalated; a message thread cannot. That single change converts an informal process into one that can be measured, without adding any bureaucracy that was not already implicitly there.

I put the coverage view in from the beginning, and I consider it the reason the system works. An attendance tool that only produces records is an HR form, and an HR form does not get filled in promptly by people whose actual job is running a shift. An attendance tool that tells a shift lead which functions are short today earns its own compliance, because the person entering the data is the person who benefits from it being current.

What I refused to build was any kind of automated judgement — scoring, flagging patterns, or ranking individuals. That is a genuinely consequential decision about a person, it belongs with a human and a policy, and a system that hints at conclusions will have its hints treated as conclusions.

## Action

The submission queue came first, deliberately as a thin layer over what people already did rather than a replacement for it. A process that demands a new habit on day one gets bypassed on day two. Submissions could arrive the familiar way and get registered into the queue, which meant adoption did not depend on everyone changing at once.

Validation was built as a single screen holding the evidence and the decision together. When supporting documents live in one place and the decision in another, the gap between them becomes the backlog — every time, in every system I have seen do it.

Coverage came next, expressed against planned headcount by function rather than as a site total, because a site can be fully staffed and still be short in the one function that matters for the shift ahead.

The monthly recap came last, and its role inverted along the way. It began as the place where absence was worked out. It ended as a read-out of decisions already taken — which is the clearest single signal that the project achieved what it set out to.

## Result

Absence records now settle while they are still fresh, so coverage decisions and operational analysis draw on the same confirmed data instead of two different provisional versions of it. The unvalidated backlog became a visible number with an age, which means it can be managed rather than discovered at close.

The effect I did not anticipate was on the operational numbers themselves. Once headcount stopped being revised weeks later, every indicator built on it stopped moving underneath the people reading it. Stability turned out to matter as much as accuracy — a number that changes after you have acted on it teaches people not to act on it.

*The underlying figures belong to the operator, so I describe the mechanism and the indicators rather than publishing internal numbers. This system handles employee data; nothing identifying appears here, and the interface shown is a reconstruction with sample records.*

## Learning

My first version required validation before an absence would appear in the coverage view. The intent was data hygiene and the effect was the opposite of what I needed: a shift lead looking at coverage at the start of the shift saw a picture that was missing exactly the absences reported that morning — the ones that mattered most.

Splitting the two concepts fixed it. Coverage now shows reported absence immediately, marked as provisional, while the validated record is what feeds analysis and the monthly recap. The general lesson is one I keep relearning: an operational view and a system of record have different tolerances for uncertainty, and forcing the operational view to wait for the record's standard of proof makes it useless at exactly the moment it is needed.
