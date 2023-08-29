package com.b5f1.atention.domain.team.repository;

import com.b5f1.atention.entity.Team;
import com.b5f1.atention.entity.TeamParticipant;
import com.b5f1.atention.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeamParticipantRepository extends JpaRepository<TeamParticipant, Long> {

    Optional<TeamParticipant> findByUser(User user);

    Optional<TeamParticipant> findByUserAndTeamAndIsDeletedFalse(User user, Team team);

    List<TeamParticipant> findAllByTeamAndIsDeletedFalse(Team team);

    List<TeamParticipant> findAllByUserAndIsDeletedFalse(User user);
}