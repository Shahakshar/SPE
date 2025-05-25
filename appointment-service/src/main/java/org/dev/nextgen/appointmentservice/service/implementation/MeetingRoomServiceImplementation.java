package org.dev.nextgen.appointmentservice.service.implementation;

import org.dev.nextgen.appointmentservice.model.Appointment;
import org.dev.nextgen.appointmentservice.model.MeetingRoom;
import org.dev.nextgen.appointmentservice.repository.MeetingRoomRepository;
import org.dev.nextgen.appointmentservice.service.MeetingRoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MeetingRoomServiceImplementation implements MeetingRoomService {

    private final MeetingRoomRepository meetingRoomRepository;
    private final Random random = new Random();

    @Override
    public MeetingRoom createMeetingRoom(Appointment appointment) {
        MeetingRoom meetingRoom = new MeetingRoom();
        meetingRoom.setRoomCode(generateUniqueRoomCode());
        meetingRoom.setDoctorId(appointment.getDoctorId());
        meetingRoom.setPatientId(appointment.getPatientId());
        meetingRoom.setAppointment(appointment);
        meetingRoom.setCreatedAt(LocalDateTime.now());
        meetingRoom.setIsActive(true);
        meetingRoom.setValidUntil(appointment.getEndTime().plusMinutes(15));

        return meetingRoomRepository.save(meetingRoom);
    }

    private String generateUniqueRoomCode() {
        int roomCode;
        String roomCodeStr;
        boolean isUnique = false;

        do {
            roomCode = 100000 + random.nextInt(900000);
            roomCodeStr = String.valueOf(roomCode);

            isUnique = !meetingRoomRepository.findByRoomCode(roomCodeStr).isPresent();
        } while (!isUnique);

        return roomCodeStr;
    }

    @Override
    public MeetingRoom getMeetingRoomByRoomCode(String roomCode) {
        return meetingRoomRepository.findByRoomCode(roomCode)
                .orElse(null);
    }

    @Override
    public MeetingRoom getMeetingRoomByAppointmentId(Long appointmentId) {
        return meetingRoomRepository.findByAppointmentId(appointmentId)
                .orElse(null);
    }


}