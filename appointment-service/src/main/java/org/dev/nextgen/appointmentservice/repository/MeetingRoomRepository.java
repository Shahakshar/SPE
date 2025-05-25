package org.dev.nextgen.appointmentservice.repository;

import org.dev.nextgen.appointmentservice.model.MeetingRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MeetingRoomRepository extends JpaRepository<MeetingRoom, Long> {
    Optional<MeetingRoom> findByRoomCode(String roomCode);
    Optional<MeetingRoom> findByAppointmentId(Long appointmentId);
}