package com.b5f1.atention.domain.item.repository;

import com.b5f1.atention.entity.Item;
import com.b5f1.atention.entity.ItemType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ItemTypeRepository extends JpaRepository<ItemType, Long> {

}