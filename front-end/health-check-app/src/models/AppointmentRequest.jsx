class AppointmentRequest {
  constructor({
    doctorId,
    serviceId,
    startTime,
    reason,
    notes,
    consultationFee,
    duration,
    patientId,
    patientName,
    patientEmail,
    patientPhone,
    patientAge,
    patientGender,
    patientAddress,
    medicalHistory,
    newPatient = false
  }) {
    this.doctorId = doctorId;
    this.serviceId = serviceId;
    this.startTime = startTime;
    this.reason = reason;
    this.notes = notes;
    this.consultationFee = consultationFee;
    this.duration = duration;
    this.patientId = patientId;
    this.patientName = patientName;
    this.patientEmail = patientEmail;
    this.patientPhone = patientPhone;
    this.patientAge = patientAge;
    this.patientGender = patientGender;
    this.patientAddress = patientAddress;
    this.medicalHistory = medicalHistory;
    this.newPatient = newPatient;
  }
}

export default AppointmentRequest;