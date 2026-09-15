---
lang: en
slug: ex-analysis-system
title: "Turning expiry write-off from a month-end surprise into a weekly decision"
description: "A batch-level view of shelf life that sorts stock into days-to-expiry bands, values the exposure, and turns it into one action list per week."
headline: "4 expiry bands driving 1 weekly action list"
period: Jan 2025 – Oct 2025
role: "Quality Management Officer · ASTRO, Jakarta"
system: Expiry analysis
tags: [Quality Management, Inventory Control, Analytics]
order: 3
featured: true
reconstructed: true
measured:
  - Value of stock sitting in each days-to-expiry band
  - Share of near-expiry stock actioned before its band closed
  - Write-off value, split by cause rather than by category
  - FEFO compliance at picking, sampled per zone
shots:
  - file: 01-exposure-overview.png
    title: Exposure overview
    alt: "Summary of stock value across four days-to-expiry bands, from over ninety days down to under fifteen, with the two nearest bands called out as at-risk."
    caption: "Exposure stated as value in bands, not as a count of items. A hundred cheap units and ten expensive ones are not the same decision."
  - file: 02-batch-ageing.png
    title: Batch ageing
    alt: "Table of batches with SKU, category, expiry date, days remaining, quantity on hand, value at risk and the assigned action."
    caption: "The working list. Batch-level, because shelf life belongs to a batch — an SKU-level average would hide the one batch that is about to expire."
  - file: 03-cause-mix.png
    title: Cause mix
    alt: "Horizontal bar chart ranking write-off causes, including over-ordering, slow movement, FEFO breach and damage in storage."
    caption: "Write-off is an outcome, not a cause. Ranking the causes is what turns the report from an accounting record into something that can be prevented."
  - file: 04-action-list.png
    title: Weekly action list
    alt: "Prioritised list of batches with a recommended action, an owner, a due date and a status column showing done, in progress or overdue."
    caption: "Analysis ends in an assignment. Anything that ends in a chart ends in a meeting, and a meeting does not move stock."
---

## Context

Every category with a shelf life carries a quiet, continuous cost. Stock ages whether or not anyone is watching, and it ages on a fixed schedule that cannot be negotiated. In a quick-commerce operation with a broad assortment, that schedule is running across thousands of batches at once, each with its own clock.

I picked this up while holding site-wide quality governance. Expiry sat awkwardly between functions — inventory owned the stock, commercial owned the buying, quality owned the standard — which is exactly the kind of gap where a recurring cost survives for years.

## Problem

Expiry was handled, but reactively. Near-expiry stock was found during counts or by the person who happened to reach for it, and expired stock was found at write-off. By then the only decision available is how to dispose of it. Every cheaper option — moving it, promoting it, redirecting it, simply picking it first — has a deadline of its own, and all of those deadlines had already passed.

The deeper problem was the shape of the reporting. Write-off was reported as a number by category, monthly. That tells you what it cost and nothing about why, so the same conversation repeated every month with the same conclusion, which was to be more careful. Being more careful is not a mechanism. Nothing in the report pointed at a cause anyone could act on, so nothing changed, and the cost was re-accepted each month as if it were weather.

## Approach

I started by changing what the unit of analysis was. Reporting by category and by month answers an accounting question. The operational question is "which batch, and by when" — so the analysis had to be batch-level and its clock had to be days remaining, not calendar month.

Then the bands. Grouping stock into days-to-expiry ranges rather than reading exact dates is what makes the data usable, because each band maps to a different set of available actions. Far out, the options are cheap and many. Close in, the options narrow to one or two. Bands make that narrowing visible, which is the whole point — the report should show options closing, not just time passing.

I insisted on valuing the exposure rather than counting it. A count treats every unit as equal, and they are not; attention is finite, and it should go where the money is. And I insisted that every write-off carry a cause code, because a write-off without a cause is a receipt, not information.

What I explicitly did not do was build a forecast of future expiry. It was the obvious next feature and it would have been the wrong one at that stage — the operation did not yet have reliable action on the stock that was already visibly at risk. Forecasting a problem you are not yet acting on adds precision to inaction.

## Action

The first version was a weekly cycle, not a live dashboard, and that was a deliberate trade. Shelf life moves in days; a live view would have added cost and urgency without adding a single decision. A weekly rhythm matched the pace at which the underlying thing actually changes.

Each week produced one list: batches in the at-risk bands, ranked by value, each with a recommended action, an owner and a due date. The recommendation was the part that made it adopted — a list of problems gets read, a list of assignments gets worked.

The cause codes took two passes. The first set was too fine-grained, and people picked whichever was nearest rather than which was right. I cut it to a short list drawn from what the first weeks had actually surfaced, and the data quality improved immediately. The same lesson I had learned on counting discrepancies applied here without modification.

## Result

Expiry moved from a monthly accounting event to a weekly operating decision. The at-risk bands gave the operation a window in which cheap options still existed, and the cause mix gave it something to argue about that was upstream of the loss — buying quantity, movement rate, FEFO discipline at the pick face — rather than the loss itself.

The most useful side effect was not on the stock at all. Once write-off had causes attached, the conversation between quality, inventory and commercial finally had a shared object. Before that, each function had its own explanation, and none of them could be checked.

*The underlying figures belong to the operator, so I describe the mechanism and the indicators rather than publishing internal numbers. In a conversation I can walk through how the bands were chosen and how the cause codes were defined.*

## Learning

I set the band boundaries from the shelf life of the product rather than from the lead time of the actions available. That was backwards. A band is only meaningful if, at the moment stock enters it, there is still time to do the thing that band is for — so the boundaries should be derived from how long each action takes to arrange, not from neat round numbers. Redrawing them on that basis made the near bands narrower and the far bands wider, and made the list actionable.

I would also have tracked the share of at-risk stock that was actually actioned from the first week. I measured exposure long before I measured follow-through, and follow-through was the constraint the entire time.
