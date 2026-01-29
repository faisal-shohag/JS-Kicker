/**
 * TESTCASES Definition File
 * 
 * This file contains automated test cases for 5 different JavaScript functions.
 * Each problem has its own set of main (m) and challenge/corner (c) test cases.
 * 
 * Overall Structure:
 * 
 * export const TESTCASES = [
 *   {
 *     id: number,                // unique problem id (1–5)
 *     title: string,             // descriptive name of the problem
 *     functionName: string,      // exact name of the function to be tested
 *     testCases: Array<TestCase>
 *   },
 *   ...
 * ]
 * 
 * Where each TestCase looks like:
 * 
 * {
 *   input: any[],              // arguments passed to the function (as array)
 *   expected: any,             // expected return value (number, boolean, string, object)
 *   type: "m" | "c"            // "m" = main / happy path, "c" = challenge / edge / invalid case
 * }
 * 
 * Important Testing Rule:
 * ────────────────────────────────────────────────
 *   → The function is called using spread syntax:
 *     fn(...testCase.input)
 * 
 *   → That means even though input is wrapped in an outer array [ … ],
 *     the outer array itself is **ignored** during actual function call.
 * 
 *   Examples:
 * 
 *   input: [1500, 20]          → fn(1500, 20)
 *   input: ["ph-10985"]        → fn("ph-10985")
 *   input: [{ right: 67, ... }] → fn({ right: 67, ... })
 *   input: [["ha", "na", "ha"]] → fn(["ha", "na", "ha"])
 *   input: [12345]             → fn(12345)
 * 
 * ────────────────────────────────────────────────
 * 
 * Problems Overview:
 * 
 * 1. newPrice(currentPrice: number, discount: number) → number | "Invalid"
 *    Eid sale discount calculator with input validation
 * 
 * 2. validOtp(otp: string) → boolean | "Invalid"
 *    Zapshift OTP format checker (must start with "ph-" and length 8)
 * 
 * 3. finalScore({ right, wrong, skip }: {right:number, wrong:number, skip:number})
 *    → number | "Invalid"
 *    BCS MCQ scoring with negative marking (-0.5 per wrong) & total 100 questions rule
 * 
 * 4. gonoVote(votes: string[]) → boolean | "Invalid"
 *    Simple majority check: "ha" ≥ "na" → true
 * 
 * 5. analyzeText(text: string) → { longwords: string, token: number } | "Invalid"
 *    Find longest word + count characters excluding spaces
 * 
 * @type {Array<{
 *   id: number,
 *   title: string,
 *   functionName: string,
 *   testCases: Array<{
 *     input: any[],
 *     expected: any,
 *     type: "m" | "c"
 *   }>
 * }>}
 */


export const TESTCASES = [
  {
    id: 1,
    title: "Problem-01: New Price for Eid Sale",
    functionName: "newPrice",
    testCases: [
      { input: [1500, 20], expected: 1200, type: "m" },
      { input: [2000, 15], expected: 1700, type: "m" },
      { input: [1200, 7], expected: 1116, type: "m" },
      { input: [2000, 17.17], expected: 1656.6, type: "m" },
      { input: ["1000", 10], expected: "Invalid", type: "c" },
      { input: [500, "5"], expected: "Invalid", type: "c" },
      { input: [500, -1], expected: "Invalid", type: "c" },
      { input: [500, 120], expected: "Invalid", type: "c" },
    ],
  },

  {
    id: 2,
    title: "Problem-02: OTP Validation for Zapshift",
    functionName: "validOtp",
    testCases: [
      { input: ["ph-10985"], expected: true, type: "m" },
      { input: ["ph-1234"], expected: false, type: "m" },
      { input: ["abc-12345"], expected: false, type: "m" },
      { input: ["ph-123456"], expected: false, type: "m" },
      { input: [["ph-10985"]], expected: "Invalid", type: "c" },
      { input: [12345678], expected: "Invalid", type: "m" },
    ],
  },

  {
    id: 3,
    title: "Problem-03: BCS Final Score Calculator",
    functionName: "finalScore",
    testCases: [
      { input: [{ right: 67, wrong: 23, skip: 10 }], expected: 56, type: "m" },
      { input: [{ right: 50, wrong: 10, skip: 40 }], expected: 45, type: "m" },
      { input: [{ right: 30, wrong: 30, skip: 40 }], expected: 15, type: "m" },
      {
        input: [{ right: 80, wrong: 25, skip: 0 }],
        expected: "Invalid",
        type: "c",
      },
      { input: ["!@#"], expected: "Invalid", type: "c" },
      { input: [["Raj"]], expected: "Invalid", type: "c" },
    ],
  },

  {
    id: 4,
    title: "Problem-04: Upcoming Gono Vote",
    functionName: "gonoVote",
    testCases: [
      { input: [["ha", "na", "ha", "na"]], expected: true, type: "m" },
      { input: [["ha", "na", "na"]], expected: false, type: "m" },
      { input: [["ha", "ha", "ha", "na"]], expected: true, type: "m" },
      { input: ["ha, na"], expected: "Invalid", type: "c" },
      { input: [12345], expected: "Invalid", type: "c" },
    ],
  },

  {
    id: 5,
    title: "Problem-05: Text Analyzer for an AI Company",
    functionName: "analyzeText",
    testCases: [
      {
        input: ["I am a little honest person"],
        expected: { longwords: "little", token: 22 },
        type: "m",
      },
      {
        input: ["Hello world"],
        expected: { longwords: "Hello", token: 10 },
        type: "m",
      },
      {
        input: ["Keep coding keep shining"],
        expected: { longwords: "shining", token: 21 },
        type: "m",
      },
      { input: [12345], expected: "Invalid", type: "c" },
      {
        input: ["Programming is fun"],
        expected: { longwords: "Programming", token: 16 },
        type: "m",
      },
      {
        input: ["A quick brown fox"],
        expected: { longwords: "quick", token: 14 },
        type: "m",
      },
      { input: [""], expected: "Invalid", type: "c" },
    ],
  },
];
