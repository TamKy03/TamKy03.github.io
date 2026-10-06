// Content for the portfolio's technical sections: what each piece demonstrates,
// and the code behind it. Snippets are illustrative patterns, not client code.

export type CodeSample = { caption: string; language: string; body: string };

export type Craft = {
  id: string;
  kicker: string;
  title: string;
  lead: string;
  points: string[];
  // The line this piece replaced, and the line that replaced it
  shift?: { was: string; now: string };
  // Set only where the subject of the piece is a captured failure
  flag?: string;
  sample?: CodeSample;
};

export const craft: Craft[] = [
  {
    id: "motion",
    kicker: "Motion",
    title: "Animation the browser drives",
    lead: "Every animation on this page is written in CSS and run by the browser itself. Nothing measures an element and no scroll handler runs, so the work stays off the main thread even while JavaScript is busy elsewhere.",
    shift: {
      was: "scroll listener measures the element, then sets a style every frame",
      now: "animation-timeline: view() - the browser owns the timeline",
    },
    points: [
      "Scroll timelines tie progress straight to the scroll position",
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
    lead: "Filtering the record above does not rebuild the list. The browser takes a snapshot of both states and animates between them through the View Transitions API. Rows that survive the filter keep their place while the others fade out.",
    shift: {
      was: "rebuild the list, then animate each row from measured coordinates",
      now: "document.startViewTransition() - the browser tweens both states",
    },
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
    lead: "My bachelor's is in data science, and the habits came with me into ERP work. I want to know what decision a number will change before I trust it, and what the data behind it actually measures. Inside NetSuite the saved searches and SuiteQL output are the dataset, and the problems I find interesting are matching, classification, and transactions that do not look like the rest.",
    shift: {
      was: "report the accuracy and call the model good",
      now: "weigh precision against recall at the cost of a wrong decision",
    },
    points: [
      "What decision does this prediction change, and what does a wrong answer cost?",
      "Joins and grain are where most ERP reporting goes wrong, long before any modelling",
      "Python and SQL for the work, with the evaluation measured in what each kind of error costs",
      "A model nobody can run on schedule stays a report, so getting it to run is part of the job",
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
    lead: "Day to day I build customisation, automation and integrations on Oracle NetSuite, across Order-to-Cash and Procure-to-Pay. The patterns below are the ones I keep coming back to, mostly because they are what survives contact with production volume.",
    flag: "Exception captured",
    shift: {
      was: "the posting stops and the user reads a stack trace",
      now: "the exception is written to its own record and the batch continues",
    },
    points: [
      "Exceptions are routed to a queryable custom record, so a failure never blocks the posting",
      "High-volume work runs as Map/Reduce with date-based chunking, inside governance limits",
      "Transactions are extended through linked custom records instead of a wall of body fields",
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
    lead: "This page is the sample for the web half of the work. It is a Next.js app in TypeScript, exported to static files and deployed by a GitHub Actions workflow on every push. Nothing third-party loads on it, so there is no cookie banner to dismiss.",
    shift: {
      was: "ship a framework bundle to animate a static page",
      now: "static export, no runtime dependency, motion declared in CSS",
    },
    points: [
      "Next.js App Router, exported to plain files, so nothing runs on a server",
      "TypeScript throughout, with the type check gating every deploy",
      "CSS Modules with design tokens; no utility framework, no component library",
      "Content lives in one typed file, so the résumé is edited in one place",
      "Checked for contrast, focus states, tap-target size and keyboard use",
    ],
  },
];
