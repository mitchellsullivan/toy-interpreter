// Read file and run

const fs = require('fs');
const { runScript } = require('./lib');

// Get filename from args
const cleanArgs = process.argv.slice(2);
const inputFilename = cleanArgs[0];

// Read and parse input file into individual scripts
const scripts = [];

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
        throw new Error('invalid input, use JSON object or array of objects');
    }
} catch (err) {
    console.error(err);
}

// Run all scripts
scripts.forEach(s => {
    runScript(s);
    console.log();
});

