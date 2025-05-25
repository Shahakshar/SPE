package org.dev.nextgen.appointmentservice.service;

import org.dev.nextgen.appointmentservice.model.Appointment;
import org.dev.nextgen.appointmentservice.model.MeetingRoom;

import java.util.List;

public interface MeetingRoomService {
    MeetingRoom createMeetingRoom(Appointment appointment);
    MeetingRoom getMeetingRoomByRoomCode(String roomCode);
    MeetingRoom getMeetingRoomByAppointmentId(Long appointmentId);
}