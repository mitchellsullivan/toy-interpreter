// Interpreter

let symbols = {};

const runScript = (script) => {
  symbols = { ...symbols, ...script }
  execFunction('init');
}

const execFunction = (functionName, caller = {}) => {
  const func = symbols[functionName];
  for (let i = 0; i < func.length; ++i) {
      const command = func[i];

      // Evaluated special args
      const evaldArgs = {};

      // Evaluate parameters and pass by value
      Object.keys(command).forEach((k) => {
        const name = command[k];
        if (k === 'cmd') {
          return;
        }
        else if (String(name).startsWith('#')) {
          const varName = name.substring(1);
          evaldArgs[k] = symbols[varName];
        }
        else if (String(name).startsWith('$')) {
          const paramName = name.substring(1);
          evaldArgs[k] = caller[paramName];
        }
        else {
          evaldArgs[k] = name;
        }
      });

      switch (command.cmd) {
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
          if (command.cmd.startsWith('#')) {
            const functionName = command.cmd.substring(1);
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