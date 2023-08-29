package com.b5f1.atention.domain.item.dto;

import com.b5f1.atention.entity.Item;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter @Builder
@NoArgsConstructor
@AllArgsConstructor
public class MyItemDto {

    // 아이템 이름
    private String name;
    // 아이템 이미지
    private String image;
    // 아이템 타입 id
    private Long itemTypeId;
    // 아이템 타입 이름
    private String itemTypeName;
    // 아이템 타입 설명
    private String description;

}
