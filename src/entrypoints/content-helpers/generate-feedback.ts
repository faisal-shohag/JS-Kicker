import { getFinalMarks } from "./calculateMarks";

interface TestResult {
  type: string;
  passed: boolean;
  expected: any;
  actual: any;
  input: any;
  status?: string;
  error?: string;
  errorType?: string;
  stdout?: string[];
}

interface Problem {
  title: string;
  results: TestResult[] | string;
  functionName?: string;
}

const colors = {
  perfect: "#0B8D0B",
  good: "#b36b00",
  fail: "#DD1212",
  gray: "#555555",
  passed: "#09A7094D",
  failed: "#FF000062",
  header: "#2532CC",
};

export const generateFeedbacks = (results: Problem[], submittedOnMarks: number) => {
  let report = "";

  //   report += 'Assignment Feedback Report\n';
  //   report += '===========================\n\n';

  let totalObtainedMarks = 0;

  results.forEach((problem) => {
    const { title, functionName, results: testResults } = problem;

    report += "\n";

    if (typeof testResults === "string") {
      report += `<p style='border: 1px dashed #E0DDDD; padding: 15px 15px; border-radius: 6px; box-shadow: 2px 3px 6px rgba(0, 0, 0, 0.1);'><strong style="color:${colors.header};"><strong style="color:${colors.header};">${title} (NOT FOUND)</strong>\n`;
      report += `<strong style="color:${colors.fail};">${testResults}</strong>`;
      report += "</p>";
      return;
    }

    const { mainScore, challengeScore, totalScore } =
      calculateScores(testResults);
    totalObtainedMarks += totalScore;

    const statusText =
      totalScore === 12 ? "Perfect" : totalScore >= 10 ? "Good" : "Needs Work";
    const statusColor =
      totalScore === 12
        ? colors.perfect
        : totalScore >= 10
          ? colors.good
          : colors.fail;

    report += `<p style='border: 1px dashed #E0DDDD; padding: 15px 15px; border-radius: 6px; box-shadow: 2px 3px 6px rgba(0, 0, 0, 0.1);'><strong style="color:${colors.header};">${title}</strong>\n`;
    // report += `<span style="color:${statusColor}; font-weight:bold;">${statusText} (${totalScore}/12)</span>\n\n`;

    const mainTests = testResults.filter((t) => t.type === "m");
    const challengeTests = testResults.filter((t) => t.type === "c");

    if (mainTests.length > 0) {
      report += `<strong>Main Test Cases | <strong style='color:${colors.perfect};'>Score: <strong>${mainScore}/10</strong></strong></strong>\n`;
      report += "---------------------\n";
   
      mainTests.forEach((test, i) => {
        const markColor = test.passed ? colors.passed : colors.failed;
        const markBorder = test.passed ? colors.perfect : colors.fail;
        const markText = test.passed ? "PASSED" : "FAILED";
        const error = test.error
          ? { type: test.errorType, msg: test.error }
          : null;
        //remove "[" from both side of test.input
        const input = JSON.stringify(test.input).slice(1, -1);
        report += `<strong>Test ${i + 1} :</strong> `;
        report += `<span style="background-color:${markColor}; font-weight:bold; color:${markBorder}; padding:2px 6px; border-radius:20px; border: solid 1px ${markBorder}; font-size: 10px;">${markText}</span>`;
        report += `\n`;
        report += `<span style="font-family:Consolas,monospace;">`;
        report += `<strong style="margin-top: 4px;">Input: </strong> ${functionName}(${input})\n`;
        report += `<strong>Expected:</strong> ${JSON.stringify(test.expected)}\n`;
        report += `<strong>Output:</strong> ${JSON.stringify(test.actual)}\n`;
        report += `</span>`;
        if (error) {
          report += `<span style="color:#f11c1c; background-color: #f11c1c29; padding: 10px 10px; border-radius: 4px; border: dashed 1px #f11c1c; display: inline-block; margin-top: 10px; margin-bottom: 10px;">Error: ${error.msg}</span>\n`;
        } else {
          report += `\n`;
        }
      });
    }

    if (challengeTests.length > 0) {
      report += `<strong>Challenge Test Cases | <strong style='color:${colors.perfect};'>Score: <strong>${challengeScore}/2</strong></strong> </strong>\n`;
      report += "--------------------------\n";

      challengeTests.forEach((test, i) => {
        const markColor = test.passed ? colors.passed : colors.failed;
        const markBorder = test.passed ? colors.perfect : colors.fail;
        const markText = test.passed ? "PASSED" : "FAILED";
        const error = test.error
          ? { type: test.errorType, msg: test.error }
          : null;
        const input = JSON.stringify(test.input).slice(1, -1);
        report += `<strong>Challenge ${i + 1}:</strong> `;
        report += `<span style="background-color:${markColor}; font-weight:bold; color:${markBorder}; padding:2px 6px; border-radius:20px; border: solid 1px ${markBorder}; font-size: 10px;">${markText}</span>`;
        if (test.status === "TIMEOUT") {
          report += ` <span style="color:${colors.fail};">⚠️ Time limit exceeded - check for infinite loop</span>`;
        }
        report += `\n`;
        report += `<span style="font-family:Consolas,monospace;">`;
         report += `<strong style="margin-top: 4px;">Input: </strong> ${functionName}(${input})\n`;
        report += `<strong>Expected:</strong> ${JSON.stringify(test.expected)}\n`;
        report += `<strong>Output:</strong> ${JSON.stringify(test.actual)}\n`;
        report += `</span>`;
        if (error) {
          report += `<span style="color:#f11c1c; background-color: #f11c1c29; padding: 10px 10px; border-radius: 4px; border: dashed 1px #f11c1c; display: inline-block; margin-top: 10px; margin-bottom: 10px;">Error: ${error.msg}</span>\n`;
        } else {
          report += `\n`;
        }
      });
    }

    let msg = "";
    if (totalScore === 12) msg = "🏆 PERFECT SCORE!";
    else if (totalScore >= 10) msg = "🎉 Great job — only minor issues.";
    else if (totalScore >= 5)
      msg = "📌 Keep practicing — you’re on the right path.";
    else msg = "🔄 Review the logic carefully and try again.";

    report += `<p style='border: 1px dashed #E0DDDD; padding: 20px 20px; border-radius: 6px; box-shadow: 2px 3px 6px rgba(0, 0, 0, 0.1); margin-top: 10px; font-weight: bold;'>${msg}</p>`;
    report += "</p>";
  });

    const finalMarks = getFinalMarks(totalObtainedMarks, submittedOnMarks, 60);

  report += `<p style='text-align: center; border: 1px dashed #E0DDDD; padding: 20px 20px; border-radius: 6px; box-shadow: 2px 3px 6px rgba(0, 0, 0, 0.1); margin-top: 30px;'>`
    if(submittedOnMarks !== 60) {
    report += `<strong style='color: red;'>You have submitted on <span style='font-size: 18px;'>${submittedOnMarks}</span></strong>\n`;
  }
  report += `<strong style='font-size: 36px; color: green; font-weight: bold;'>${finalMarks}/${submittedOnMarks}</strong>\n`;
  report += `<strong>Total Marks</strong>`;
  report +=`</p>`

  report +=
    "<p style='border: 1px dashed #E0DDDD; padding: 20px 20px; border-radius: 6px; box-shadow: 2px 3px 6px rgba(0, 0, 0, 0.1); margin-top: 30px;'>";

  report += generateSummaryStats(results);
  report += "</p>";
  return {
    feedback: report,
    obtainedMarks: totalObtainedMarks,
  };
};

export function calculateScores(testResults: TestResult[] | string) {
  if (typeof testResults === "string") {
    return { mainScore: 0, challengeScore: 0, totalScore: 0 };
  }

  const mains = testResults.filter((t) => t.type === "m");
  const challenges = testResults.filter((t) => t.type === "c");

  const mainPassed = mains.filter((t) => t.passed).length;
  const mainScore = mains.length
    ? Math.round((mainPassed / mains.length) * 10)
    : 0;

  const chPassed = challenges.filter((t) => t.passed).length;
  const challengeScore = challenges.length
    ? Math.round((chPassed / challenges.length) * 2)
    : 0;

  return { mainScore, challengeScore, totalScore: mainScore + challengeScore };
}

export function generateSummaryStats(results: Problem[]) {
  let totalProblems = 0;
  let earned = 0;
  let possible = 0;
  const lines: string[] = [];

  results.forEach((p) => {
    totalProblems++;
    possible += 12;

    if (typeof p.results === "string") {
      lines.push(`${p.title} — not found`);
      return;
    }

    const { totalScore } = calculateScores(p.results);
    earned += totalScore;

    if (totalScore === 12) {
      lines.push(`${p.title} — ${totalScore}/12 ✓`);
    } else {
      lines.push(`${p.title} — ${totalScore}/12`);
    }
  });

  const percent = ((earned / possible) * 100).toFixed(1);

  let motivation = "";
  if (percent === "100.0") {
    motivation = "🏆 Outstanding — Perfect Score!\n";
    motivation +=
      "Exceptional performance! You have demonstrated mastery of all concepts and excellent problem-solving skills.";
  } else if (parseFloat(percent) >= 80) {
    motivation = "🌟 Excellent work!\n";
    motivation +=
      "Strong performance! You have a solid grasp of the core concepts. Review the feedback for minor refinements.";
  } else if (parseFloat(percent) >= 60) {
    motivation = "👍 Good effort — keep improving.\n";
    motivation +=
      "You're on the right track! Focus on the areas highlighted in the feedback and practice consistently to strengthen your understanding.";
  } else {
    motivation = "📚 Keep practicing — you'll get better!\n";
    motivation +=
      "This is a learning opportunity. Review the detailed feedback, understand the concepts, and don't hesitate to practice similar problems.";
  }

  let summary = "";
  summary += `<span style='font-wight: bold; color: green;'>${motivation}</span/>\n\n`;

  //   summary += 'Summary\n';
  //   summary += '=======\n\n';

  //   summary += `Total: ${earned}/${possible}  (${percent}%)\n`;

  //   summary += 'Problems:\n';
  //   lines.forEach(line => {
  //     summary += `• ${line}\n`;
  //   });
  //   summary += '\n';

  summary += "<strong>Important – Examiner's Note</strong>\n";
  summary += "----------------------------\n";
  summary += "→ Do not post marks-related issues on Facebook.\n";
  summary += "→ Read all requirements carefully before raising concerns.\n";
  summary += "→ For genuine marking errors → submit recheck request.\n";
  summary += "→ Invalid recheck request → -2 marks deduction.\n\n";
  summary +=
    "→ How to request recheck: https://1drv.ms/b/s!AsHwkj6t2abplhxnqigzCy2IwmLu?e=4JeV37\n\n";

  summary +=
    "<strong style='text-align:center; color:#CC3E25;'>Let's Code_ Your Career</strong>\n";

  return summary;
}
