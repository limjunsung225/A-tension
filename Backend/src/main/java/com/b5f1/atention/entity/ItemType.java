package com.b5f1.atention.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Getter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItemType extends BaseEntity {
    /**
     * 아이템 타입은
     * 발표 지목권, 발표 면제권, emoji, 글자 색상권
     * 4종류
     * */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "item_type_id")
    private Long id;

    @Column
    private String name;

    @Column
    private String description;

    // 아래 코드 없어도 돌아가나 check 해보자
    @OneToMany(mappedBy = "itemType")
    @Builder.Default
    private List<Item> itemList = new ArrayList<>();

}