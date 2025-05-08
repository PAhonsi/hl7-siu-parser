# HL7 SIU^S12 Parser (JavaScript)

Here's a sample HL7 SIU^S12 parser I built from scratch in JavaScript. It parses real healthcare messages, extracts patient and appointment data, validates required fields, and outputs structured JSON.
🧪 A backend tool that parses HL7 SIU^S12 appointment messages into structured JSON — built without external HL7 libraries to demonstrate deep understanding of HL7 formatting and parsing logic.



## 🚀 Features

- 📄 Reads `.hl7` files from the filesystem
- 🔍 Extracts data from MSH, SCH, PID, PV1 segments
- ✅ Validates required fields (e.g., appointment ID, patient name, provider ID)
- 🧪 Includes unit tests (Jest)
- 🖥️ CLI interface (run from terminal)
- ❌ Gracefully handles errors and malformed messages
- 🔧 Clean, modular, testable JavaScript code

---

## Validation

The parser includes basic validation to ensure required fields are present in the HL7 message. If required fields are missing, the parser will throw an error.

### Example Validation
1. **`MSH` Segment**:
   - The parser checks for:
     - `messageType` (Field 9)
     - `messageDateTime` (Field 7)
   - If either field is missing, the parser throws an error:
     ```
     MSH segment is missing required fields (messageType or messageDateTime).
     ```

2. **Test Case for Validation**:
   ```javascript
   const invalidMessage = `
     MSH|^~\\&|SendingApp|Dignityhealth|ReceivingApp|Bannerhealth||||123456|P|2.3
   `;

   expect(() => parseHL7Message(invalidMessage)).toThrow(
     'MSH segment is missing required fields (messageType or messageDateTime).'
   );


---

## Installation

1. Clone the repository:
  
   git clone <repository-url>
   cd hl7-siu-parser
   ```

2. Install dependencies:
   RUN: npm install
   

---

## Usage

### Parse an HL7 File
To parse an HL7 file and convert it to JSON, run the following command:

RUN: node -e "const { parseHL7Message } = require('./src/parser'); const fs = require('fs'); const hl7Text = fs.readFileSync('./data/sample.hl7', 'utf8'); console.log(JSON.stringify(parseHL7Message(hl7Text), null, 2));"
```

### Using the CLI Script
Alternatively, you can use the CLI script for easier usage:
1. Create a file named `cli.js` in the root directory:
  
   const fs = require('fs');
   const { parseHL7Message } = require('./src/parser');

   const filePath = process.argv[2];

   if (!filePath) {
     console.error('❌ Please provide the path to an HL7 file. Example: node cli.js data/sample.hl7');
     process.exit(1);
   }

   try {
     const hl7Text = fs.readFileSync(filePath, 'utf8');
     const result = parseHL7Message(hl7Text);
     console.log('✅ Parsed HL7 Message:');
     console.log(JSON.stringify(result, null, 2));
   } catch (err) {
     console.error('❌ Error:', err.message);
     process.exit(1);
   }
   ```

2. Run the CLI script:
   
RUN:   node cli.js data/sample.hl7
   


## Example Input and Output

### Input (`data/sample.hl7`):

MSH|^~\&|SendingApp|Dignityhealth|ReceivingApp|Bannerhealth|202505051200||SIU^S12|123456|P|2.3
SCH|1234^SessionID|A123|Book Appt|Dr. shahul|ClinicA|202505101000|202505101030|30|Min|Scheduled
PID|1||123456^^^Hospital MRN||peter^Ahonsi^A||19800101|M
PV1|1|O|ClinicA^Room1^Bed1||||12345^Smith^John^A
```

### Output (JSON):

{
  "messageType": "SIU^S12",
  "messageDateTime": "202505051200",
  "appointmentId": "1234^SessionID",
  "placerAppointmentId": "A123",
  "appointmentReason": "Book Appt",
  "scheduledBy": "Dr. shahul",
  "location": "ClinicA",
  "startDateTime": "202505101000",
  "endDateTime": "202505101030",
  "duration": "30 Min",
  "status": "Scheduled",
  "patientId": "123456^^^Hospital MRN",
  "patientName": {
    "firstName": "Ahonsi",
    "lastName": "peter",
    "middleInitial": "A"
  },
  "birthDate": "19800101",
  "gender": "M",
  "visitType": "O",
  "assignedLocation": "ClinicA^Room1^Bed1",
  "attendingDoctor": {
    "id": "12345",
    "firstName": "John",
    "lastName": "Smith",
    "middleInitial": "A"
  }
}

## Testing

To run the unit tests and ensure the parser works as expected:

RUN:npx jest

---

## Notes
- The parser currently supports `MSH`, `SCH`, `PID`, and `PV1` segments. Additional segments can be added as needed.


