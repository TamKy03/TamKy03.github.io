// Three SuiteScript problems that need working through rather than guessing.
// Answers are stored as truncated SHA-256 digests of the normalised text, so
// reading the source gives you the shape of the answer and nothing more.

export type Stage = {
  ask: string;
  placeholder: string;
  hint: string;
  // Digests of every form of the answer that counts as correct
  accept: string[];
};

export type Puzzle = {
  id: string;
  title: string;
  rail: string;
  brief: string;
  code?: string;
  stages: Stage[];
  payoff: string;
};

export const puzzles: Puzzle[] = [
  {
    id: "governance",
    title: "The script that ran out",
    rail: "Case 01 / Governance",
    brief:
      "A user event script loops over the lines of a sales order. For every line it loads a linked custom record, writes two fields back to it, and reads one field from a second record with a lookup. The order it failed on had 220 lines.",
    code: `// beforeSubmit, user event, 1,000 units
for (var i = 0; i < lineCount; i++) {
  var link = record.load({ type: 'customrecord_line_link', id: linkId });  //  ? units
  link.setValue({ fieldId: 'custrecord_status', value: 2 });
  record.submitFields({ type: 'customrecord_line_link', id: linkId, values: { ... } });  //  ? units
  search.lookupFields({ type: 'customer', id: customerId, columns: ['entityid'] });  //  ? units
}`,
    stages: [
      {
        ask: "Work out what one pass through the loop costs. Custom record operations and lookupFields all have published unit costs.",
        placeholder: "units per line",
        hint: "record.load on a custom record is 2 units, record.submitFields on a custom record is 2, and search.lookupFields is 1 whatever the record.",
        accept: ["ef2d127de37b942baad06145e54b0c61", "6e4df4c40e7348fc30cd1bb89352f886"],
      },
      {
        ask: "A user event script gets 1,000 units for the whole execution. How many lines can this loop finish before the units run out?",
        placeholder: "lines",
        hint: "Divide the limit by the cost of one pass. The script stops on the line after that.",
        accept: ["27badc983df1780b60c2b3fa9d3a19a0", "965e2cbccec7ae33f382a3182298c149"],
      },
      {
        ask: "The status is the only field the loop reads from the loaded record, and submitFields writes it back without the record in memory. Which call can go?",
        placeholder: "API call",
        hint: "One of these four calls reads a whole record, sublists included, when two fields were wanted.",
        accept: [
          "33de5789f2181de8a2b8697ab0b6035d",
          "0cf67fc72b3c86c7a454f6d86b43ed24",
          "e673d15800a42620e7e569ac9f27f16d",
        ],
      },
    ],
    payoff:
      "Dropping the load takes the loop to 3 units a line, so 220 lines costs 660 of the 1,000. That is the whole fix: the same work, read a cheaper way.",
  },
  {
    id: "silent",
    title: "Nothing happened",
    rail: "Case 02 / Deployment",
    brief:
      "A user event script is deployed to the vendor bill record. The code is right, the log is empty, and nobody can make it fire. Three things are wrong, and none of them is in the script file.",
    stages: [
      {
        ask: "Start with the deployment record. One field decides whether the script runs for everybody, only for you, or not at all. What value does it need?",
        placeholder: "status value",
        hint: "The other two values on that field are Testing and Not Scheduled.",
        accept: ["d29eae1372c396247daf62745d10c351"],
      },
      {
        ask: "Someone edits the approval status straight from a list, without opening the record. Of the three user event entry points, which one does not run on an inline edit?",
        placeholder: "entry point",
        hint: "Inline editing never renders the form, so the entry point tied to rendering has nothing to do.",
        accept: ["d32107aa2d506d3d0d6d5f334ae62f72", "6c08b286da35d6438c4eb6a4661cb300"],
      },
      {
        ask: "The script must skip its logic when a CSV import is what triggered it. Name the module and property that tell you what started the script.",
        placeholder: "module.property",
        hint: "The same property tells UserInterface apart from Scheduled, RESTlet and CsvImport.",
        accept: [
          "626bec6a64d04fbe88a39d161ea8462b",
          "6a2b172f371c30207589c1e8a3e2809b",
          "263468b752384b764c92984c40a1332c",
        ],
      },
    ],
    payoff:
      "Released deployment, afterSubmit for the inline edit, and a context check so the import does not re-trigger the approval. The script file never changed.",
  },
  {
    id: "mapreduce",
    title: "Keys and values",
    rail: "Case 03 / Map/Reduce",
    brief:
      "A Map/Reduce script exports 30,000 invoice lines belonging to 1,200 customers. getInputData returns the search. The map stage writes one entry per line, keyed by customer, and the reduce stage writes one file per customer.",
    code: `function map(context) {
  var row = JSON.parse(context.value);
  context.write({ key: row.customerId, value: row.lineAmount });
}

function reduce(context) {
  // context.key   -> one customer
  // context.values -> every amount written under that key
}`,
    stages: [
      {
        ask: "How many times does the reduce function run for this job?",
        placeholder: "invocations",
        hint: "Reduce runs once per distinct key, not once per written entry.",
        accept: [
          "15197cf7214b58e67cae565e573ffd9a",
          "15197cf7214b58e67cae565e573ffd9a",
          "d4ffba1a60465c865635353dad4f0bed",
        ],
      },
      {
        ask: "Each stage is metered on its own. Which stage gets 5,000 units per invocation?",
        placeholder: "stage",
        hint: "map gets 1,000. getInputData and summarize get 10,000. One stage sits between them.",
        accept: ["4c7e98bfa0c750beb52cf2ddf452297d"],
      },
      {
        ask: "A customer with no email fails in reduce, and the job still has to finish. Which stage do you read the failures in, so the morning report knows what did not go out?",
        placeholder: "stage",
        hint: "It runs once, after everything else, and it can see the errors from every stage.",
        accept: ["bae9264d6d972b80f4fe23b4a22b599a", "df6456da0dd84394d91d341386d9eb33"],
      },
    ],
    payoff:
      "1,200 reduce invocations, 5,000 units each, and summarize holding the list of what failed. That list is the exception record, and it is the reason the job can be left alone overnight.",
  },
];
