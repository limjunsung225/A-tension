package com.b5f1.atention.domain.team.repository;

import com.b5f1.atention.entity.TeamInvitation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface TeamInvitationRepository extends JpaRepository<TeamInvitation, Long> {
    Optional<TeamInvitation> findByUserIdAndTeamId(UUID userId, Long teamId);
}