function parseHL7Message(hl7Text) {
  const segments = hl7Text.trim().split('\n').map(line => line.trim());
  const appointment = {};

  for (const segmentLine of segments) {
    const fields = segmentLine.split('|');
    const segmentType = fields[0];

    switch (segmentType) {
      case 'MSH':
        console.log(fields); // debugging
        if (!fields[8] || !fields[6]) {
          throw new Error('MSH segment is missing required fields (messageType or messageDateTime).');
        }
        appointment.messageType = fields[8];
        appointment.messageDateTime = fields[6];
        break;

      case 'SCH':
        appointment.appointmentId = fields[1];
        appointment.placerAppointmentId = fields[2];
        appointment.appointmentReason = fields[3];
        appointment.scheduledBy = fields[4];
        appointment.location = fields[5];
        appointment.startDateTime = fields[6];
        appointment.endDateTime = fields[7];
        appointment.duration = fields[8] + ' ' + fields[9];
        appointment.status = fields[10];
        break;

      case 'PID':
        appointment.patientId = fields[3];
        const [lastName, firstName, middleInitial] = fields[5].split('^');
        appointment.patientName = {
          firstName,
          lastName,
          middleInitial,
        };
        appointment.birthDate = fields[7];
        appointment.gender = fields[8];
        break;

      case 'PV1':
        appointment.visitType = fields[2];
        appointment.assignedLocation = fields[3];
        if (fields[7]) {
          const [docId, docLast, docFirst, docMiddle] = fields[7].split('^');
          appointment.attendingDoctor = {
            id: docId,
            firstName: docFirst,
            lastName: docLast,
            middleInitial: docMiddle,
          };
        }
        break;

      default:
        // Ignore unknown segments
        break;
    }
  }

  return appointment;
}

module.exports = { parseHL7Message };