# BACKLOG.md — Axia

> **The rule**: When you feel "the MVP should also do X," write X here instead of in `SPRINT_PLAN.md`. This file is where good ideas wait their turn. Nothing here is rejected — it's just not Weeks 1–4.
>
> **Review cadence**: End of Week 4, after the demo script runs end-to-end. Not before.

---

## Post-MVP features (slated for Weeks 5–10, priority order TBD after Week 4 demo)

### 1. Comp commentary / reconciliation narrative
- **Why it matters**: Second-highest time sink for appraisers after market conditions.
- **Dependencies**: Reliable comps pipeline (Week 3 ATTOM integration must actually produce usable comps).
- **Estimated effort**: 1 week.
- **Validation question to answer first**: In Week 4 dogfooding, did I actually wish the AI would write comp commentary, or was the subject description enough to prove the concept?

### 2. Market conditions narrative
- **Why it matters**: Highest raw time savings per appraisal.
- **Dependencies**: A market data source. ATTOM's `/salestrend` endpoint may cover this; verify in Week 5.
- **Estimated effort**: 1–1.5 weeks (half of that is the data source).
- **Validation question to answer first**: Is ATTOM sales trend data defensible in a real appraisal, or do I need a better source?

### 3. Adjustments grid with AI suggestions
- **Why it matters**: Biggest workflow transformation in the product vision.
- **Dependencies**: Comps must be reliable; subject description flow must be proven; need to decide Claude-reasoning vs. rule-based heuristics vs. eventual ML.
- **Estimated effort**: 2 weeks minimum.
- **Risk**: Adjustments are where appraisers are most defensive. Getting this wrong damages trust in the whole product. Don't rush.
- **Validation question to answer first**: After Weeks 5–6, do I trust this product enough to let it touch adjustments, or am I still editing everything heavily?

### 4. Client management
- **Why it matters**: Eventually yes, as a CRM/pipeline complement.
- **Dependencies**: Having more than zero clients using Axia.
- **Estimated effort**: 3–4 days.
- **CTO's honest take**: This is the one where I pushed back hardest and I'll push back again. You don't need this until you have 5+ real clients routing work through Axia. Adding it earlier is "appraisal software should have X" thinking. Revisit after launch.

---

## Things that will get added to this backlog as you work

Ideas will come. Write them here. Don't edit `SPRINT_PLAN.md` to add them. Structure each entry:

```
### [Feature name]
- Why it matters:
- Dependencies:
- Estimated effort:
- Validation question to answer first:
```

---

## The Week 4 demo test

Before you touch anything in this backlog, the Week 4 demo script from `SPRINT_PLAN.md` must run end-to-end on your own real work-in-progress appraisal. If that flow doesn't work, nothing in this backlog matters yet.
