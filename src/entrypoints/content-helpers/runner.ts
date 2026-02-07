import { TESTCASES } from "@/const/testcases";
import { executeFunctionsInIframe } from "./execute-sandbox";
import { generateFeedbacks } from "./generate-feedback";

export const runner = async (sources: any) => {
  const results: any = [];
  for (const problem of TESTCASES) {
    const source = sources.find((s: any) => s.name === problem.functionName);
    if (!source) {
      results.push({
        title: `${problem.title}`,
        results: `Solution not found for this problem!`,
      });
      continue;
    }
    const testCases = problem.testCases;
    const res = await executeFunctionsInIframe(
      source.code,
      testCases,
      problem.functionName,
    );
    results.push({
      title: problem.title,
      functionName: problem.functionName,
      results: res,
    });
  }

  // console.log(results);

  return generateFeedbacks(results);

};