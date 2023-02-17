// Interpreter

let symbols = {};

const runScript = (script) => {
  symbols = { ...symbols, ...script }
  execFunction('init');
}

const execFunction = (functionName, params = {}) => {
  const func = symbols[functionName];
  for (let i = 0; i < func.length; i++) {
      const execLine = func[i];

      // Evaluated special args
      const evaldArgs = {};

      // Evaluate parameters and pass by value
      for (const [k, val] of Object.entries(execLine)) {
        if (k === 'cmd') {
          continue;
        }
        else if (String(val).startsWith('#')) {
          const varName = val.substring(1);
          evaldArgs[k] = symbols[varName];
        }
        else if (String(val).startsWith('$')) {
          const paramName = val.substring(1);
          evaldArgs[k] = params[paramName];
        }
        else {
          evaldArgs[k] = val;
        }
      }

      switch (execLine.cmd) {
        case 'print': {
          console.log(evaldArgs.value);
          break;
        }
        case 'create': {
          symbols[evaldArgs.id] = evaldArgs.value;
          break;
        }
        case 'update': {
          symbols[evaldArgs.id] = evaldArgs.value;
          break;
        }
        case 'delete': {
          delete symbols[evaldArgs.id];
          break;
        }
        case 'add': {
          symbols[evaldArgs.id] = evaldArgs.operand1 + evaldArgs.operand2;
          break;
        }
        case 'subtract': {
          symbols[evaldArgs.id] = evaldArgs.operand1 - evaldArgs.operand2;
          break;
        }
        case 'multiply': {
          symbols[evaldArgs.id] = evaldArgs.operand1 * evaldArgs.operand2;
          break;
        }
        case 'divide': {
          symbols[evaldArgs.id] = evaldArgs.operand1 / evaldArgs.operand2;
          break;
        }
        default: {
          // Jump out of current frame and call new func
          if (execLine.cmd.startsWith('#')) {
            const functionName = execLine.cmd.substring(1);
            execFunction(functionName, evaldArgs);
          }
          break;
        }
      }
    }
}

module.exports = {
  runScript,
}