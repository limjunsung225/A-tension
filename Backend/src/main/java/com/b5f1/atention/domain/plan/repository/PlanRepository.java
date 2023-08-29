package com.b5f1.atention.domain.plan.repository;

import com.b5f1.atention.entity.Plan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlanRepository extends JpaRepository<Plan, Long> {

    // teamId로 해당 팀의 모든 일정 찾기
    List<Plan> findAllByTeamIdAndIsDeletedFalse(Long teamId);
    // id로 일정 하나 찾기
    Optional<Plan> findByIdAndIsDeletedFalse(Long id);
    // teamId 들로 모든 일정 찾기
    List<Plan> findAllByTeamIdInAndIsDeletedFalse(List<Long> teamIds);
}
