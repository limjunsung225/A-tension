package com.b5f1.atention.domain.item.repository;

import com.b5f1.atention.entity.Item;
import com.b5f1.atention.entity.MyItem;
import com.b5f1.atention.entity.Team;
import com.b5f1.atention.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MyItemRepository extends JpaRepository<MyItem, Long> {
    Optional<MyItem> findByUser(User user);

    Optional<MyItem> findByUserAndIsDeletedFalse(User user);

    List<MyItem> findByUserAndItemAndIsDeletedFalse(User user, Item item);
}
