// Recursive version

let symbols = {};

const runScriptRecursive = (script) => {
  symbols = { ...symbols, ...script }

  const execFunction = (functionName, params = {}) => {
    const currFunc = symbols[functionName];
    for (const currLine of currFunc) {
        // Evaluated special args
        const evald = {};
  
        // Evaluate parameters and pass by value
        Object.entries(currLine).forEach(([k, val]) => {
          if (k === 'cmd') {
            return;
          }
          else if (String(val).startsWith('#')) {
            const varName = val.substring(1);
            evald[k] = symbols[varName];
          }
          else if (String(val).startsWith('$')) {
            const paramName = val.substring(1);
            evald[k] = params[paramName];
          }
          else {
            evald[k] = val;
          }
        })
  
        switch (currLine.cmd) {
          case 'print': {
            console.log(evald.value);
            break;
          }
          case 'create': {
            symbols[evald.id] = evald.value;
            break;
          }
          case 'update': {
            symbols[evald.id] = evald.value;
            break;
          }
          case 'delete': {
            delete symbols[evald.id];
            break;
          }
          case 'add': {
            symbols[evald.id] = evald.operand1 + evald.operand2;
            break;
          }
          case 'subtract': {
            symbols[evald.id] = evald.operand1 - evald.operand2;
            break;
          }
          case 'multiply': {
            symbols[evald.id] = evald.operand1 * evald.operand2;
            break;
          }
          case 'divide': {
            if (evald.operand2 === 0) {
              throw new Error('cannot divide by zero')
            }
            symbols[evald.id] = evald.operand1 / evald.operand2;
            break;
          }
          default: {
            if (currLine.cmd.startsWith('#')) {
              const functionName = currLine.cmd.substring(1);
              execFunction(functionName, evald);
            }
            break;
          }
        }
      }
  }

  execFunction('init');
}


// Iterative version
let stack = [];

const runScriptIterative = (script) => {
  // Maintain symbols from last script
  symbols = { ...symbols, ...script }

  // Initialize
  stack.push({
    name: 'init',
    line: 0,
    params: {}
  });

  // I "got to" :-)
  loopy:
  while (stack.length > 0) {
    // Peek stack
    const frame = stack[stack.length - 1];
    // Get lines in function
    const currFunc = symbols[frame.name];

    // Iterate lines
    while (frame.line < currFunc.length) {
      // Execute line
      const currLine = currFunc[frame.line++];

      // Evaluated special args
      const evald = {};

      // Evaluate parameters and pass by value
      Object.entries(currLine).forEach(([k, val]) => {
        if (k === 'cmd') {
          return;
        }
        else if (String(val).startsWith('#')) {
          const varName = val.substring(1);
          evald[k] = symbols[varName];
        }
        else if (String(val).startsWith('$')) {
          const paramName = val.substring(1);
          evald[k] = frame.params[paramName];
        }
        else {
          evald[k] = val;
        }
      })

      switch (currLine.cmd) {
        case 'print': {
          console.log(evald.value);
          break;
        }
        case 'create': {
          symbols[evald.id] = evald.value;
          break;
        }
        case 'update': {
          symbols[evald.id] = evald.value;
          break;
        }
        case 'delete': {
          delete symbols[evald.id];
          break;
        }
        case 'add': {
          symbols[evald.id] = evald.operand1 + evald.operand2;
          break;
        }
        case 'subtract': {
          symbols[evald.id] = evald.operand1 - evald.operand2;
          break;
        }
        case 'multiply': {
          symbols[evald.id] = evald.operand1 * evald.operand2;
          break;
        }
        case 'divide': {
          if (evald.operand2 === 0) {
            throw new Error('cannot divide by zero')
          }
          symbols[evald.id] = evald.operand1 / evald.operand2;
          break;
        }
        default: {
          // Jump out of current frame and call new func
          if (currLine.cmd.startsWith('#')) {
            stack.push({
              name: currLine.cmd.substring(1),
              line: 0,
              params: { ...evald }
            });

            continue loopy;
          }

          break;
        }
      }
    }

    // Remove frame from stack
    stack.pop();
  }
}

module.exports = {
  runScriptRecursive,
  runScriptIterative,
}