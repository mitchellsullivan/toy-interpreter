// Interpreter

let symbols = {};

const runScript = (script) => {
  // Clear stack but maintain symbols
  symbols = { ...symbols, ...script }

  // Initialize
  stack.push({
    name: 'init',
    line: 0,
    args: {}
  });
}

const execute = () => {
  // :-)
  loopy:
  while (stack.length > 0) {
    // Peek stack
    const frame = stack[stack.length - 1];
    // Get lines in function
    const funcLength = symbols[frame.name].length;

    // Iterate lines
    while (frame.line < funcLength) {
      // Execute line
      const command = symbols[frame.name][frame.line];
      ++frame.line;

      // Evaluated special args
      const evaldArgs = {};

      // Evaluate parameters and pass by value
      Object.keys(command).forEach((k) => {
        const val = command[k];
        if (k === 'cmd') {
          return;
        }
        else if (String(val).startsWith('#')) {
          const varName = val.substring(1);
          evaldArgs[k] = symbols[varName];
        }
        else if (String(val).startsWith('$')) {
          const varName = val.substring(1);
          evaldArgs[k] = frame.args[varName];
        }
        else {
          evaldArgs[k] = val;
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
            const name = command.cmd.substring(1);

            stack.push({
              name,
              line: 0,
              args: { ...evaldArgs }
            });

            continue loopy;
          }

          break;
        }
      }
    }
}

module.exports = {
  runScript,
}