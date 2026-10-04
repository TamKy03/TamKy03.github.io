// Content for the portfolio's technical sections: what each piece demonstrates,
// and the code behind it. Snippets are illustrative patterns, not client code.

export type CodeSample = { caption: string; language: string; body: string };

export type Craft = {
  id: string;
  kicker: string;
  title: string;
  lead: string;
  points: string[];
  sample?: CodeSample;
};

export const craft: Craft[] = [
  {
    id: "motion",
    kicker: "Motion",
    title: "Animation the browser drives",
    lead: "Every animation on this page is declared in CSS and run by the browser's compositor. There is no scroll listener, no element measuring, no requestAnimationFrame loop — so the work happens off the main thread and keeps running while JavaScript is busy.",
    points: [
      "Scroll timelines (scroll() and view()) tie progress to the scroll position itself",
      "Rows reveal as they enter the viewport without an IntersectionObserver",
      "@property makes custom properties animatable with real types",
      "Unsupported browsers get the finished state, never a blank page",
      "prefers-reduced-motion switches the whole system off",
    ],
    sample: {
      caption: "The reading rule and row reveals, in full",
      language: "css",
      body: `/* progress rule, tied to document scroll */
.progress {
  animation: grow linear both;
  animation-timeline: scroll(root block);
}
@keyframes grow { to { scale: 1 1; } }

/* each row animates over its own entry into view */
.row {
  animation: rise linear both;
  animation-timeline: view();
  animation-range: entry 10% cover 32%;
}
@keyframes rise {
  from { opacity: 0; translate: 0 1.2rem; }
  to   { opacity: 1; translate: 0 0; }
}`,
    },
  },
  {
    id: "transitions",
    kicker: "Interaction",
    title: "State changes with View Transitions",
    lead: "Filtering the record above does not cut from one list to the next. The browser snapshots both states and tweens between them through the View Transitions API, so rows that stay keep their place while the rest fade.",
    points: [
      "One call wraps the state update; the browser owns the animation",
      "Shared elements are matched by view-transition-name",
      "Falls back to an instant update where the API is missing",
    ],
    sample: {
      caption: "Wrapping a React state update in a transition",
      language: "ts",
      body: `const applyFilter = (next: Filter) => {
  if (!document.startViewTransition || reducedMotion) {
    setFilter(next);
    return;
  }
  document.startViewTransition(() =>
    flushSync(() => setFilter(next)),
  );
};`,
    },
  },
  {
    id: "ai",
    kicker: "Data & AI",
    title: "A data science degree, pointed at business systems",
    lead: "My bachelor's is in data science, and the habits carry straight into ERP work: define the question before the model, know what the data actually measures, and be honest about error. Inside NetSuite that means saved searches and SuiteQL become datasets, and the interesting problems are matching, classification and anomaly detection on transactions.",
    points: [
      "Framing: what decision does this prediction change, and what does a wrong answer cost?",
      "Data: joins and grain are where most ERP reporting goes wrong, long before modelling",
      "Modelling: Python and SQL for the work; evaluation that matches the business metric, not just accuracy",
      "Delivery: a model that nobody can run on schedule is a report, not a system",
    ],
    sample: {
      caption: "Evaluating against the cost of being wrong, not accuracy",
      language: "python",
      body: `# A 2% exception rate means accuracy rewards predicting "fine" every time.
report = classification_report(y_true, y_pred, digits=3)

# What the finance team actually cares about: of the invoices we flag,
# how many were worth a human opening, and how many did we miss?
precision = precision_score(y_true, y_pred)   # time wasted on false flags
recall    = recall_score(y_true, y_pred)      # exceptions that slipped through
cost      = 12 * false_positives + 400 * false_negatives`,
    },
  },
  {
    id: "suitescript",
    kicker: "NetSuite",
    title: "SuiteScript that survives production",
    lead: "Day to day I build customisation, automation and integrations on Oracle NetSuite across Order-to-Cash and Procure-to-Pay. The patterns below are the ones I reach for: keep the transaction safe, keep governance in budget, keep the data model honest.",
    points: [
      "Exceptions are routed to a queryable custom record, so a failure never blocks the posting",
      "High-volume work runs as Map/Reduce with date-based chunking, inside governance limits",
      "Transactions are extended through linked custom records, not a wall of body fields",
      "Shared Suitelet and provider patterns keep one implementation across clients",
    ],
    sample: {
      caption: "An approval hook that can fail without taking the transaction down",
      language: "javascript",
      body: `/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/record', 'N/log'], (record, log) => {
  const afterSubmit = (context) => {
    try {
      routeForApproval(context.newRecord);
    } catch (e) {
      // The posting is already valid — log the exception where
      // someone can query it, and let the transaction stand.
      record.create({ type: 'customrecord_approval_exception' })
        .setValue({ fieldId: 'custrecord_source', value: context.newRecord.id })
        .setValue({ fieldId: 'custrecord_detail', value: String(e.message).slice(0, 300) })
        .save();
      log.error({ title: 'Approval routing failed', details: e });
    }
  };
  return { afterSubmit };
});`,
    },
  },
  {
    id: "web",
    kicker: "Web",
    title: "How this site is built",
    lead: "This page is the work sample for the web half: a statically exported Next.js app in TypeScript, deployed from a GitHub Actions workflow on every push. No analytics, no cookie banner, no third-party scripts.",
    points: [
      "Next.js App Router, exported to plain files — nothing runs on a server",
      "TypeScript throughout, with the type check gating every deploy",
      "CSS Modules with design tokens; no utility framework, no component library",
      "Content lives in one typed file, so the résumé is edited in one place",
      "Checked for contrast, focus states, tap-target size and keyboard use",
    ],
  },
];
