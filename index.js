const fs = require('fs');

const cleanArgs = process.argv.slice(2);
const inputFilename = cleanArgs[0];

const scripts = [];

// Read input file
try {
  if (!fs.existsSync(inputFilename)) {
    throw new Error(`file '${inputFilename}' does not exist`);
  }
  const data = fs.readFileSync(inputFilename, 'utf8');
  const parsed = JSON.parse(data);
  // Multiple scripts in file
  if (Array.isArray(parsed)) {
    scripts.push(...parsed);
  }
  // Only one script in file (not in array form)
  else if (parsed !== null && typeof parsed === 'object') {
    scripts.push(parsed);
  }
  else {
    throw new Error('invalid input, use JSON object or array of objects')
  }
} catch (err) {
  console.error(err);
}

let symbols = {};
let stack = [];

const run = (script) => {
    stack = [];
    symbols = {...symbols, ...script }

    stack.push({ name: "init", line: 0, args: {} });
    
    loopy: 
    while (stack.length > 0) {
        // Get top of stack
        const frame = stack[stack.length - 1];
        // Get lines in function
        const funcLength = symbols[frame.name].length;
    
        // Iterate lines
        while (frame.line < funcLength) {
            // Execute line
            const execLine = symbols[frame.name][frame.line];
            ++frame.line;
    
            // Jump out of current frame and call new func
            if (execLine.cmd.startsWith('#')) {
                const next = {
                    name: execLine.cmd.split('#')[1],
                    line: 0,
                    args: {}
                };

                Object.keys(execLine).filter(k => k !== 'cmd').forEach((k) => {
                    const val = execLine[k];
                    if (String(val).startsWith('#')) {
                        const varName = String(val).split('#')[1];
                        next.args[k] = symbols[varName];
                    }
                    else if (String(val).startsWith('$')) {
                        const varName = String(val).split('$')[1];
                        next.args[k] = frame.args[varName];
                    }
                    else {
                        next.args[k] = val;
                    } 
                });
                
                stack.push(next)
                continue loopy;
            } 
            else {
                // Stay in current frame and evaluate args
                const evaldArgs = {};
                
                Object.keys(execLine).filter(k => k !== 'cmd').forEach((k) => {
                    const val = execLine[k];
                    if (String(val).startsWith('#')) {
                        const varName = String(val).split('#')[1];
                        evaldArgs[k] = symbols[varName];
                    }
                    else if (String(val).startsWith('$')) {
                        const varName = String(val).split('$')[1];
                        evaldArgs[k] = frame.args[varName];
                    }
                    else {
                        evaldArgs[k] = val;
                    }
                }); 
    
                switch (execLine.cmd) {
                    case "print": {
                        console.log(evaldArgs.value);
                        break;
                    }
                    case "create": {
                        symbols[evaldArgs.id] = evaldArgs.value;
                        break;
                    }
                    case "update": {
                        symbols[evaldArgs.id] = evaldArgs.value; 
                        break;
                    }
                    case "delete": {
                        delete symbols[evaldArgs.id];
                        break;
                    }
                    case "add": {
                        symbols[evaldArgs.id] = evaldArgs.operand1 + evaldArgs.operand2;
                        break;
                    }
                    case "subtract": {
                        symbols[evaldArgs.id] = evaldArgs.operand1 - evaldArgs.operand2;
                        break;
                    }
                    case "multiply": {
                        symbols[evaldArgs.id] = evaldArgs.operand1 * evaldArgs.operand2;
                        break;
                    }
                    case "divide": {
                        symbols[evaldArgs.id] = evaldArgs.operand1 / evaldArgs.operand2;
                        break;
                    }
                    default: {
                        break;
                    }
                }
            }
        }
    
        // Remove from stack
        if (frame.line === funcLength) {
            stack.pop();
        }
    }
}

scripts.forEach(run);




