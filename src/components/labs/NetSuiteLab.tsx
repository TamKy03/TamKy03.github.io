"use client";

import { useMemo, useState } from "react";
import { cx } from "@/lib/utils";
import s from "@/components/portfolio/portfolio.module.css";
import a from "./labs.module.css";

/* ------------------------------------------------------------------ *
 * Governance budget
 * Unit costs and script limits are Oracle's documented SuiteScript 2.x
 * figures, not estimates.
 * ------------------------------------------------------------------ */

type Category = "transaction" | "custom" | "other";

const categories: { key: Category; label: string }[] = [
  { key: "transaction", label: "Transaction" },
  { key: "custom", label: "Custom record" },
  { key: "other", label: "Other record" },
];

// [transaction, custom record, other] — a single number means the cost never varies
type Cost = number | Record<Category, number>;

const operations: { id: string; call: string; cost: Cost; note: string }[] = [
  {
    id: "load",
    call: "record.load()",
    cost: { transaction: 10, custom: 2, other: 5 },
    note: "Reads the whole record into memory, sublists included.",
  },
  {
    id: "save",
    call: "record.save()",
    cost: { transaction: 20, custom: 4, other: 10 },
    note: "The most expensive call most scripts make.",
  },
  {
    id: "submitFields",
    call: "record.submitFields()",
    cost: { transaction: 10, custom: 2, other: 5 },
    note: "Writes named body fields without loading the record.",
  },
  {
    id: "delete",
    call: "record.delete()",
    cost: { transaction: 20, custom: 4, other: 10 },
    note: "Costs what a save costs.",
  },
  {
    id: "lookup",
    call: "search.lookupFields()",
    cost: 1,
    note: "One unit for a handful of fields. The cheapest read there is.",
  },
  {
    id: "search",
    call: "search.run().each()",
    cost: 10,
    note: "Ten units per result page, however many rows come back.",
  },
  {
    id: "suiteql",
    call: "query.runSuiteQL()",
    cost: 10,
    note: "Joins and aggregates in one call where a search would need several.",
  },
  {
    id: "https",
    call: "https.request()",
    cost: 10,
    note: "Every outbound call, and it also burns wall-clock time.",
  },
];

const scriptTypes = [
  { key: "userevent", label: "User event", limit: 1000 },
  { key: "suitelet", label: "Suitelet", limit: 1000 },
  { key: "client", label: "Client", limit: 1000 },
  { key: "restlet", label: "RESTlet", limit: 5000 },
  { key: "scheduled", label: "Scheduled", limit: 10000 },
  { key: "map", label: "Map/Reduce · map", limit: 1000 },
  { key: "reduce", label: "Map/Reduce · reduce", limit: 5000 },
];

const costOf = (cost: Cost, category: Category) => (typeof cost === "number" ? cost : cost[category]);

function GovernanceBudget() {
  const [scriptType, setScriptType] = useState(scriptTypes[0]);
  const [category, setCategory] = useState<Category>("transaction");
  const [counts, setCounts] = useState<Record<string, number>>({ load: 1, save: 1, search: 1 });

  const total = useMemo(
    () =>
      operations.reduce((sum, op) => sum + costOf(op.cost, category) * (counts[op.id] ?? 0), 0),
    [category, counts],
  );

  const used = Math.min(100, Math.round((total / scriptType.limit) * 100));
  const over = total > scriptType.limit;
  const headroom = scriptType.limit - total;
  const bump = (id: string, by: number) =>
    setCounts((c) => ({ ...c, [id]: Math.max(0, Math.min(99, (c[id] ?? 0) + by)) }));

  return (
    <section className={a.app}>
      <p className={s.rail}>App 01 / Governance</p>
      <div>
        <h2>What will this script cost?</h2>
        <p>
          Each API call spends usage units. A script that runs out stops where it is, halfway through the work.
          Pick a script type and the calls one execution makes. The unit costs are Oracle&rsquo;s published figures
          for SuiteScript 2.x.
        </p>

        <div className={a.controls}>
          <div className={a.row}>
            <span className={a.label}>Script type</span>
            <div className={a.choices}>
              {scriptTypes.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  aria-pressed={t.key === scriptType.key}
                  className={cx(a.choice, t.key === scriptType.key && a.choiceOn)}
                  onClick={() => setScriptType(t)}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <span className={a.count}>{scriptType.limit.toLocaleString()}</span>
          </div>

          <div className={a.row}>
            <span className={a.label}>Record kind</span>
            <div className={a.choices}>
              {categories.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  aria-pressed={c.key === category}
                  className={cx(a.choice, c.key === category && a.choiceOn)}
                  onClick={() => setCategory(c.key)}
                >
                  {c.label}
                </button>
              ))}
            </div>
            <span className={a.count} />
          </div>
        </div>

        <div className={a.table}>
          <div className={cx(a.tableRow, a.tableHead)}>
            <span>Call</span>
            <span>Units each</span>
            <span>Times</span>
          </div>
          {operations.map((op) => (
            <div key={op.id} className={a.tableRow}>
              <span>
                <code className={a.code}>{op.call}</code>
              </span>
              <span>{costOf(op.cost, category)}</span>
              <span>
                <span className={a.stepper}>
                  <button
                    type="button"
                    className={a.step}
                    onClick={() => bump(op.id, -1)}
                    aria-label={`One fewer ${op.call}`}
                  >
                    −
                  </button>
                  <span className={a.count}>{counts[op.id] ?? 0}</span>
                  <button
                    type="button"
                    className={a.step}
                    onClick={() => bump(op.id, 1)}
                    aria-label={`One more ${op.call}`}
                  >
                    +
                  </button>
                </span>
              </span>
            </div>
          ))}
        </div>

        <p className={a.readout} style={{ marginTop: "18px" }}>
          <span>
            Spent <b>{total.toLocaleString()}</b>
          </span>
          <span>
            Limit <b>{scriptType.limit.toLocaleString()}</b>
          </span>
          <span className={over ? a.over : a.under}>
            {over ? `Over by ${(-headroom).toLocaleString()}` : `${headroom.toLocaleString()} left`}
          </span>
        </p>

        <div className={cx(a.meter, over && a.meterOver)}>
          <span className={a.meterFill} style={{ "--pct": used } as React.CSSProperties} />
        </div>

        {over && (
          <div className={a.verdict}>
            <h3>Over the limit</h3>
            <p>
              A {scriptType.label.toLowerCase()} script gets {scriptType.limit.toLocaleString()} units.
              {counts.load ? (
                <>
                  {" "}
                  If you only read a few fields, <code>search.lookupFields()</code> costs 1 unit where{" "}
                  <code>record.load()</code> costs {costOf(operations[0].cost, category)}.
                </>
              ) : null}{" "}
              For real volume, move the work into a Map/Reduce script. Governance is counted per invocation there, so
              the budget starts again at every key.
            </p>
          </div>
        )}

        <details className={a.note}>
          <summary>Why the cost changes with the record</summary>
          <p>
            Transactions carry lines, and NetSuite charges for them. Loading a sales order costs 10 units. Loading a
            custom record costs 2. When a script starts failing at volume, the loop over transactions is usually
            where the units went.
          </p>
        </details>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * Script type chooser
 * ------------------------------------------------------------------ */

type Trigger = "save" | "clock" | "url" | "system" | "typing";
type Volume = "one" | "hundreds" | "thousands";

const triggers: { key: Trigger; label: string }[] = [
  { key: "save", label: "A user saves a record" },
  { key: "typing", label: "A user is typing in a form" },
  { key: "clock", label: "A clock" },
  { key: "url", label: "Someone opens a link" },
  { key: "system", label: "Another system calls in" },
];

const volumes: { key: Volume; label: string }[] = [
  { key: "one", label: "One record" },
  { key: "hundreds", label: "A few hundred" },
  { key: "thousands", label: "Thousands or more" },
];

function decide(trigger: Trigger, volume: Volume, blocking: boolean) {
  if (trigger === "typing") {
    return {
      type: "Client script",
      entry: "fieldChanged / validateField",
      limit: "1,000 units",
      why: "Runs in the browser, so it reacts while the user is still in the field. It is the only script type that can reject a value before the form is submitted.",
    };
  }
  if (trigger === "save") {
    if (volume === "thousands") {
      return {
        type: "User event that hands off",
        entry: "afterSubmit + task.create(MAP_REDUCE)",
        limit: "1,000 units, then 10,000 per stage",
        why: "A user event gets 1,000 units and the user waits while it runs. Do the small part inline, queue the rest with task.create, and let the save come back straight away.",
      };
    }
    return blocking
      ? {
          type: "User event",
          entry: "beforeSubmit",
          limit: "1,000 units",
          why: "beforeSubmit runs inside the save. Throwing an error there stops the record being written, which is what you want for a rule the data must not break.",
        }
      : {
          type: "User event",
          entry: "afterSubmit",
          limit: "1,000 units",
          why: "afterSubmit runs once the record exists. It can create the related records and write back without triggering itself again.",
        };
  }
  if (trigger === "clock") {
    return volume === "thousands"
      ? {
          type: "Map/Reduce script",
          entry: "getInputData → map → reduce → summarize",
          limit: "10,000 / 1,000 / 5,000 / 10,000 units",
          why: "Governance is counted per invocation, not per run, so a million rows becomes a scheduling question instead of a limit question. summarize is where you report what failed.",
        }
      : {
          type: "Scheduled script",
          entry: "execute",
          limit: "10,000 units",
          why: "One execution with 10,000 units, and no keys to think about. Move to Map/Reduce when the volume needs more than one processor.",
        };
  }
  if (trigger === "url") {
    return {
      type: "Suitelet",
      entry: "onRequest",
      limit: "1,000 units",
      why: volume === "thousands"
        ? "Serve the page from the Suitelet, then queue the work. 1,000 units will not cover a bulk job, and the user is sitting on a loading spinner while it burns through them."
        : "A Suitelet renders its own page and handles the POST back. That is enough UI for most internal tools.",
    };
  }
  return {
    type: "RESTlet",
    entry: "get / post / put / delete",
    limit: "5,000 units",
    why: "5,000 units per call and token-based authentication. With SuiteQL behind it, one call can answer what several saved searches would take.",
  };
}

function ScriptChooser() {
  const [trigger, setTrigger] = useState<Trigger>("save");
  const [volume, setVolume] = useState<Volume>("one");
  const [blocking, setBlocking] = useState(true);
  const result = decide(trigger, volume, blocking);

  return (
    <section className={a.app}>
      <p className={s.rail}>App 02 / Choosing</p>
      <div>
        <h2>Which script type is this?</h2>
        <p>
          Three questions settle it. Getting this wrong usually shows up later, in production, when the volume
          arrives.
        </p>

        <div className={a.controls}>
          <div className={a.row}>
            <span className={a.label}>What starts it</span>
            <div className={a.choices}>
              {triggers.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  aria-pressed={t.key === trigger}
                  className={cx(a.choice, t.key === trigger && a.choiceOn)}
                  onClick={() => setTrigger(t.key)}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <span />
          </div>

          <div className={a.row}>
            <span className={a.label}>How much</span>
            <div className={a.choices}>
              {volumes.map((v) => (
                <button
                  key={v.key}
                  type="button"
                  aria-pressed={v.key === volume}
                  className={cx(a.choice, v.key === volume && a.choiceOn)}
                  onClick={() => setVolume(v.key)}
                >
                  {v.label}
                </button>
              ))}
            </div>
            <span />
          </div>

          <div className={a.row}>
            <span className={a.label}>Must it block the save</span>
            <div className={a.choices}>
              <button
                type="button"
                aria-pressed={blocking}
                className={cx(a.choice, blocking && a.choiceOn)}
                onClick={() => setBlocking(true)}
              >
                Yes, reject bad data
              </button>
              <button
                type="button"
                aria-pressed={!blocking}
                className={cx(a.choice, !blocking && a.choiceOn)}
                onClick={() => setBlocking(false)}
              >
                No, react afterwards
              </button>
            </div>
            <span />
          </div>
        </div>

        <div className={a.verdict} key={`${result.type}-${result.entry}`}>
          <h3>{result.type}</h3>
          <p>
            <code>{result.entry}</code> · {result.limit}
            <br />
            {result.why}
          </p>
        </div>
      </div>
    </section>
  );
}

export function NetSuiteLab() {
  return (
    <>
      <GovernanceBudget />
      <ScriptChooser />
    </>
  );
}
