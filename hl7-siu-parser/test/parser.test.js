const { parseHL7Message } = require('../src/parser');

it('should parse a valid HL7 message correctly', () => {
  const hl7Message = `
    MSH|^~\\&|SendingApp|Dignityhealth|ReceivingApp|Bannerhealth|202505051200||SIU^S12|123456|P|2.3
    SCH|1234^SessionID|A123|Book Appt|Dr. shahul|ClinicA|202505101000|202505101030|30|Min|Scheduled
    PID|1||123456^^^Hospital MRN||peter^Ahonsi^A||19800101|M
    PV1|1|O|ClinicA^Room1^Bed1||||12345^Smith^John^A
  `;

  const result = parseHL7Message(hl7Message);

  expect(result).toEqual({
    messageType: 'SIU^S12',
    messageDateTime: '202505051200',
    appointmentId: '1234^SessionID',
    placerAppointmentId: 'A123',
    appointmentReason: 'Book Appt',
    scheduledBy: 'Dr. shahul',
    location: 'ClinicA',
    startDateTime: '202505101000',
    endDateTime: '202505101030',
    duration: '30 Min',
    status: 'Scheduled',
    patientId: '123456^^^Hospital MRN',
    patientName: {
      firstName: 'Ahonsi',
      lastName: 'peter',
      middleInitial: 'A',
    },
    birthDate: '19800101',
    gender: 'M',
    visitType: 'O',
    assignedLocation: 'ClinicA^Room1^Bed1',
    attendingDoctor: {
      id: '12345',
      firstName: 'John',
      lastName: 'Smith',
      middleInitial: 'A',
    },
  });
});

it('should throw an error for invalid HL7 messages', () => {
  const invalidMessage = `
    MSH|^~\\&|SendingApp|Dignityhealth|ReceivingApp|Bannerhealth||||123456|P|2.3
  `;

  expect(() => parseHL7Message(invalidMessage)).toThrow(
    'MSH segment is missing required fields (messageType or messageDateTime).'
  );
});