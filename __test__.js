// Sort of useless. Just demonstrating test-consciousness without
// pulling in third-party libraries, etc.

const { runScriptRecursive } = require('./lib');

const tests = [
  {
    'var1': 420,
    'var2': 69,
    'init': [
      { 'cmd': 'divide', 'id': 'var3', 'operand1': '#var1', 'operand2': '#var2' },
      { 'cmd': 'print', 'value': '#var3' }
    ]
  }
];

const test = (testScript) => {
  // Replace console.log with stub implementation.
  const originalLog = console.log;
  const calls = [];

  console.log = (...args) => {
    calls.push(args);
    originalLog(...args);
  };

  try {
    console.assert(calls.length === 0);
    runScriptRecursive(testScript)
    console.assert(calls.length === 1);
    console.assert(calls[0][0] === 6.086956521739131);
  } catch (error) {
    console.error(error);
  } finally {
    // Restore original implementation after testing.
    console.log = originalLog;
  }
}

tests.forEach(t => test(t));