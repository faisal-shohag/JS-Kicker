/**
 * Executes user-provided JavaScript function code in a sandboxed iframe.
 * Designed for Manifest V3 Chrome extensions (WXT compatible).
 *
 * @param code - The full function code as string (e.g. "function newPrice(a,b){...}")
 * @param testCases - Array of test cases
 * @param funcName - Expected name of the function (e.g. "newPrice", "validOtp")
 * @param timeLimit - Max execution time per test case (ms)
 * @returns Promise with array of per-test results
 */
export async function executeFunctionsInIframe(
  code: string,
  testCases: Array<{
    input: any[];
    expected: any;
    type?: string;
  }>,
  funcName: string,
  timeLimit = 2000,
): Promise<
  Array<{
    passed: boolean;
    actual?: any;
    input: any[];
    expected: any;
    type?: string;
    error?: string;
    errorType?: "SYNTAX" | "RUNTIME" | "TIMEOUT" | "SETUP" | "UNKNOWN";
    stdout: string[];
    status?: string;
  }>
> {
  return new Promise((resolve) => {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.sandbox.add("allow-scripts");

    const allResults: Array<{
      passed: boolean;
      actual?: any;
      input: any[];
      expected: any;
      type?: string;
      error?: string;
      errorType?: "SYNTAX" | "RUNTIME" | "TIMEOUT" | "SETUP" | "UNKNOWN";
      stdout: string[];
      status?: string;
    }> = [];

    let completedTests = 0;
    const totalTests = testCases.length;
    const timeoutIds: Map<number, NodeJS.Timeout> = new Map();

    const messageListener = (event: MessageEvent) => {
      if (event.source !== iframe.contentWindow) return;
      if (event.data.type !== "TEST_RESULT") return;

      const testIndex = event.data.testIndex;
      if (timeoutIds.has(testIndex)) {
        clearTimeout(timeoutIds.get(testIndex)!);
        timeoutIds.delete(testIndex);
      }

      const { result, error, errorType, stdout } = event.data;

      allResults[testIndex] = {
        passed: !error && deepEqual(result, testCases[testIndex].expected),
        actual: error ? undefined : result,
        input: testCases[testIndex].input,
        expected: testCases[testIndex].expected,
        type: testCases[testIndex].type,
        error: error || undefined,
        errorType: errorType || (error ? "RUNTIME" : undefined),
        stdout: stdout || [],
      };

      completedTests++;
      if (completedTests === totalTests) {
        cleanupAndResolve();
      }
    };

    window.addEventListener("message", messageListener);

    // ────────────────────────────────────────────────────────────────
    // Improved script with better error classification
    // ────────────────────────────────────────────────────────────────
    const scriptContent = `
      (function() {
        const testCases = ${JSON.stringify(testCases)};
        const funcName = ${JSON.stringify(funcName)};
        const TIME_LIMIT = ${timeLimit};

        const stdout = [];

        // Simple console override
        const originalConsoleLog = console.log;
        console.log = (...args) => {
          stdout.push(args.map(x => String(x)).join(" "));
          originalConsoleLog.apply(console, args);
        };

        let fn;

        // ─── Phase 1: Parse & define user function ─────────────────────
        try {
          // We wrap in Function() to get better stack traces for syntax errors
          const userCodeFn = new Function(\`
            "use strict";
            ${code.replace(/`/g, "\\`").replace(/\\${/g, "\\\\${")}
            return ${funcName};
          \`);

          fn = userCodeFn();
          
          if (typeof fn !== "function") {
            throw new Error(\`Expected function named "${funcName}", got \${typeof fn}\`);
          }
        } catch (setupErr) {
          const errMsg = setupErr instanceof Error 
            ? setupErr.message 
            : String(setupErr);

          // Try to detect line number from stack (very basic)
          let lineInfo = "";
          if (setupErr instanceof Error && setupErr.stack) {
            const match = setupErr.stack.match(/<anonymous>:(\\d+):(\\d+)/);
            if (match) {
              lineInfo = \` (near line \${match[1]})\`;
            }
          }

          const fullError = "Syntax/Setup Error" + lineInfo + ": " + errMsg;

          testCases.forEach((_, index) => {
            parent.postMessage({
              type: "TEST_RESULT",
              testIndex: index,
              result: undefined,
              error: fullError,
              errorType: "SYNTAX",   // or "SETUP" — SYNTAX is more common here
              stdout: stdout
            }, "*");
          });
          return;
        }

        // ─── Phase 2: Run test cases ───────────────────────────────────
        testCases.forEach((test, index) => {
          const testStdout = [];

          let result;
          let execError = null;
          let localConsole = {
            log: (...args) => testStdout.push(args.map(x => String(x)).join(" "))
          };

          try {
            // We can also override console per test if needed
            result = fn.apply(null, test.input);
          } catch (e) {
            execError = e instanceof Error 
              ? e.message 
              : String(e);

            // Optional: try to get line from user function
            if (e instanceof Error && e.stack) {
              const match = e.stack.match(/<anonymous>:(\\d+):(\\d+)/);
              if (match) {
                execError += \` (line \${match[1]})\`;
              }
            }
          }

          parent.postMessage({
            type: "TEST_RESULT",
            testIndex: index,
            result: execError ? undefined : result,
            error: execError,
            errorType: execError ? "RUNTIME" : undefined,
            stdout: testStdout
          }, "*");
        });
      })();
    `;

    iframe.srcdoc = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body>
        <script>
          ${scriptContent}
        </script>
      </body>
      </html>
    `;

    document.body.appendChild(iframe);

    // Per-test timeout
    testCases.forEach((test, index) => {
      const timeoutId = setTimeout(() => {
        if (timeoutIds.has(index)) {
          allResults[index] = {
            passed: false,
            input: test.input,
            expected: test.expected,
            type: test.type,
            error: `Time limit exceeded (${timeLimit}ms)`,
            errorType: "TIMEOUT",
            stdout: [],
            status: "TIMEOUT",
          };
          completedTests++;

          if (completedTests === totalTests) {
            cleanupAndResolve();
          }
        }
      }, timeLimit);

      timeoutIds.set(index, timeoutId);
    });

    const cleanupAndResolve = () => {
      window.removeEventListener("message", messageListener);
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }

      // Fill missing results (should rarely happen)
      for (let i = 0; i < totalTests; i++) {
        if (!allResults[i]) {
          allResults[i] = {
            passed: false,
            input: testCases[i].input,
            expected: testCases[i].expected,
            type: testCases[i].type,
            error: "Test did not complete (possible internal error)",
            errorType: "UNKNOWN",
            stdout: [],
          };
        }
      }

      resolve(allResults);
    };
  });
}

// deep equality helper (unchanged)
function deepEqual(a: any, b: any): boolean {
  if (Object.is(a, b)) return true;
  if (a == null || b == null) return false;
  if (typeof a !== "object" || typeof b !== "object") return false;

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  return keysA.every((key) => deepEqual(a[key], b[key]));
}