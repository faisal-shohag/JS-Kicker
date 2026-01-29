import { PROBLEMS } from "@/const/problems";
import { executeFunctionsInIframe } from "./execute-sandbox";
import { generateFeedbacks } from "./generate-feedback";

export const runner = async (sources: any) => {
  const results: any = [];
  for (const problem of PROBLEMS) {
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
      results: res,
    });
  }

  return generateFeedbacks(results);
};
