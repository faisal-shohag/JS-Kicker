// jsExecutor.worker.ts  (improved)
self.onmessage = async function (e: MessageEvent) {
  const { code, functionName, testCases } = e.data as {
    code: string;
    functionName: string;
    testCases: Array<{ input: any; expected: any }>;
  };

  const logs: string[] = [];
  const originalLog = console.log;

  console.log = (...args) => {
    logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
  };

  const results:any = [];

  try {
    // Execute user code in strict mode
    const execute = new Function(`
      "use strict";
      ${code}
      return ${functionName};
    `);

    const fn = execute();

    for (const test of testCases) {
      let actual;
      let passed = false;
      let testError: string | null = null;

      try {
        actual = Array.isArray(test.input)
          ? fn(...test.input)
          : fn(test.input);

        // Deep equality (simple version)
        passed = JSON.stringify(actual) === JSON.stringify(test.expected);
      } catch (err: any) {
        testError = err?.message || String(err);
      }

      results.push({
        passed,
        input: test.input,
        expected: test.expected,
        actual: testError ? undefined : actual,
        error: testError,
        console: logs.length > 0 ? logs.join("\n") : undefined,
      });

      // Clear logs per test (optional)
      logs.length = 0;
    }
  } catch (err: any) {
    results.push({
      passed: false,
      error: "Syntax / Setup error: " + (err?.message || String(err)),
    });
  } finally {
    console.log = originalLog;
  }

  self.postMessage({ results });
};