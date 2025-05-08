const path = require('path');
const { parseHL7Message } = require('./src/parser'); // Corrected function name
const fs = require('fs');

const filePath = process.argv[2];

if (!filePath) {
  console.error('❌ Please provide a path to an HL7 file. Example: node cli.js data/sample.hl7');
  process.exit(1);
}

try {
  const fullPath = path.resolve(__dirname, filePath);

  if (!fs.existsSync(fullPath)) {
    throw new Error(`File not found at ${fullPath}`);
  }

  const hl7Content = fs.readFileSync(fullPath, 'utf-8');
  const parsed = parseHL7Message(hl7Content); // Updated to use the correct function
  
  console.log('✅ Parsed Appointment Data:\n');
  console.log(JSON.stringify(parsed, null, 2));
} catch (err) {
  console.error('❌ Error reading or parsing HL7 file:', err.message);
  process.exit(1);
}