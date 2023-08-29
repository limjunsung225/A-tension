package com.b5f1.atention.domain.item.repository;

import com.b5f1.atention.entity.Item;
import com.b5f1.atention.entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {

    Optional<Item> findByIdAndIsDeletedFalse(Long itemId);

    Optional<Item> findByNameAndIsDeletedFalse(String name);

}