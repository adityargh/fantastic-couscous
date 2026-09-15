---
lang: en
slug: relabel-productivity
title: "Making relabelling visible, so the reason for it could be removed"
description: "Measuring rework that nobody had ever counted — output per hour, backlog age and cause — so relabelling could be argued about at its source, not absorbed."
headline: "1 standard rate for work with 0 prior measurement"
period: Sep 2024 – Feb 2025
role: "QA Team Leader, then Quality Management Officer · ASTRO, Jakarta"
system: Productivity tracking
tags: [Process Improvement, Quality Assurance, Productivity]
order: 5
featured: false
reconstructed: true
measured:
  - Units relabelled per person-hour, against a standard rate
  - Age of the relabel backlog, oldest batch first
  - Cause mix behind each relabel batch
  - Share of relabel volume traced back to a specific source step
shots:
  - file: 01-daily-output.png
    title: Daily output
    alt: "Board showing units relabelled today against the standard rate, hours worked, current backlog and a seven-day comparison bar."
    caption: "The first number the operation had ever had for this work. Before this, relabelling was described as busy or quiet, which is not a measurement."
  - file: 02-operator-throughput.png
    title: Throughput by station
    alt: "Table of relabel stations with units completed, hours logged, rate per hour and a variance column against the standard rate."
    caption: "Reported per station, not per person. The goal was to find where the method differs, not to rank people — a ranked list stops being honest quickly."
  - file: 03-backlog-ageing.png
    title: Backlog ageing
    alt: "Stacked bars of pending relabel batches grouped by age, from under one day to over one week, with the oldest batch identified."
    caption: "Volume alone hides the risk. An old relabel batch is stock that is unsellable and still occupying a location, which is two costs, not one."
  - file: 04-cause-pareto.png
    title: Cause pareto
    alt: "Pareto chart ranking relabel causes such as supplier label error, damaged label, price change and wrong barcode, with a cumulative percentage line."
    caption: "The point of the whole exercise. Relabelling is rework, and rework is only worth measuring if the measurement points upstream at what created it."
---

## Context

Relabelling is invisible work. It is not receiving, not picking, not packing — it sits beside all three, absorbing whatever needs a new barcode, a corrected price, or a replacement label before it can be sold. Everyone knows it happens. Almost nobody knows how much of it happens, because it rarely has its own line in any report.

I picked this up across the transition from leading the QA team into site-wide quality governance, which is a useful vantage point for this particular problem: QA sees the defects that create relabelling, and governance is the function that can do something about their source.

## Problem

There was no measurement at all. Not a poor measurement — none. Relabelling was staffed by feel, described in adjectives, and reported only when it became a bottleneck. That produces three failures at once, and they compound.

First, the work could not be planned. Without a rate, you cannot convert a backlog into hours, so you cannot say how many people are needed or when it will be clear. Staffing was therefore reactive, which means it was always slightly late.

Second, the cost was hidden. Relabelling is rework — it is time spent correcting something that should have arrived correct. Unmeasured rework does not appear in any comparison of options, so it never competes for attention against anything else. It simply gets absorbed.

Third, and worst: because nothing recorded *why* a batch needed relabelling, the causes upstream were never confronted. A supplier who consistently sends mislabelled stock and a one-off price change looked identical from downstream — both just arrive as more work. The operation kept paying for a recurring problem at the most expensive point in the chain, which is after the goods are already inside.

## Approach

I started with the rate, because everything else depends on it. A standard rate converts a pile into a duration, and a duration is what makes planning possible. I derived it by observation over a reasonable spread of batch types rather than by taking a best case — a standard set from someone's good day is a standard that makes every normal day look like underperformance, and staff work that out within a week.

The second decision was to report at station level rather than individual level. This was deliberate and I would defend it in any similar system. The purpose of the measurement was to find where method differs, not to rank people. The moment a productivity number becomes a personal scoreboard, two things happen: easy batches get competed for, and the number stops describing the work. I kept the resolution exactly where it was useful and not one level finer.

The third and most important decision was the cause code. The rate makes relabelling manageable; only the cause code makes it reducible. Managing rework more efficiently is worth something. Removing its source is worth considerably more, and it is the only version of this project that ends.

## Action

Capture was built into the work rather than added on top. A batch gets logged when it starts and when it finishes, with a count and a cause — three fields, chosen so that recording takes less time than deciding not to. Any capture step that costs more than a few seconds gets deferred, and deferred capture is invented capture.

Backlog ageing came next, because total backlog is a misleading number on its own. Relabel stock is doubly stuck: it cannot be sold, and it is still occupying a location that something sellable could use. A week-old batch and a fresh batch of the same size are not the same problem, and only ageing shows that.

The pareto view came last and justified everything before it. Once a few months of cause data existed, the distribution was the usual shape — a small number of recurring causes producing most of the volume, mixed in with a long tail of genuine one-offs. That distribution is the entire argument for going upstream, and it cannot be made without the data.

## Result

Relabelling stopped being a mood and became a quantity. It could be staffed from a backlog and a rate instead of from an impression, and the backlog could be prioritised by age rather than by whichever batch was nearest.

The more valuable change was in what could now be discussed. With causes ranked, recurring sources could be raised as a specific, evidenced problem rather than as a complaint. The work shifted from doing rework faster to making less of it necessary — which is the only direction in this kind of work that eventually reduces the cost to zero.

*The underlying figures belong to the operator, so I describe the mechanism and the indicators rather than publishing internal numbers. In a conversation I can walk through how the standard rate was derived and how the cause codes were kept short.*

## Learning

My first cause list had too many options, and people picked the nearest rather than the right one. I have now made this mistake on counting discrepancies, on expiry write-off, and here — which tells me it is not a mistake about any of those domains. It is a general one: a category set that a tired person cannot use correctly at the end of a shift is not a category set. Short and slightly coarse beats complete and unusable, every time.

I would also have started the ageing view at the same time as the rate rather than months later. I spent the first stretch optimising throughput on a backlog whose composition I could not see, which meant I was making the queue move faster without knowing whether the right things were moving.
