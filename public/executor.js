// entrypoints/sandbox-executor.js  (or put in assets & reference via src)

const logs = []

const originalConsole = console.log
console.log = (...args) => {
  logs.push(args.map(a => String(a)).join(' '))
  originalConsole(...args) // optional: keep browser console
}

function deepEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b) // simple version – improve if needed
}

window.addEventListener('message', (event) => {
  if (event.source !== window.parent) return // security – only from parent

  const data = event.data
  if (data.type !== 'runTests') return

  const results = []

  try {
    // ── This is the part that needs unsafe-eval ──
    const fnFactory = new Function(
      '"use strict";\n' +
      data.functionCode + '\n' +
      `return ${data.functionName};`
    )

    const userFn = fnFactory()

    for (const tc of data.testCases) {
      let actual
      let passed = false
      let error

      try {
        actual = userFn(...tc.input)
        passed = deepEqual(actual, tc.expected)
      } catch (err) {
        error = err?.message || String(err)
      }

      results.push({
        passed,
        input: tc.input,
        expected: tc.expected,
        actual: error ? undefined : actual,
        error,
        consoleOutput: logs.length ? logs.join('\n') : undefined,
      })

      logs.length = 0 // reset per test
    }
  } catch (err) {
    results.push({
      passed: false,
      input: null,
      expected: null,
      actual: null,
      error: `Setup error: ${err?.message || String(err)}`,
    })
  }

  // Send result back to content script
  window.parent.postMessage(
    { type: 'results', results },
    '*'
  )
})