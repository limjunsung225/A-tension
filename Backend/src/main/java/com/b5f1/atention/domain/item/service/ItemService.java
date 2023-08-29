package com.b5f1.atention.domain.item.service;

import com.b5f1.atention.domain.item.dto.CreateMyItemResponseDto;
import com.b5f1.atention.domain.item.dto.FindMyItemResponseDto;
import com.b5f1.atention.domain.item.dto.FindAllItemsDto;
import com.b5f1.atention.entity.Item;
import com.b5f1.atention.entity.MyItem;
import com.b5f1.atention.entity.User;

import java.util.List;
import java.util.Set;
import java.util.UUID;

public interface ItemService {

    // 모든 종류의 아이템 타입 조회
    public List<FindAllItemsDto> findAllItems();

    // 아이템 타입

    // 모든 종류의 아이템 가져오기 - 이름만 반환
    public Set<Long> findAllItemNames();

    // 나의 보유 아이템 가져오기
    public FindMyItemResponseDto findMyItemList(UUID userId);

    // 아이템 뽑기
    public CreateMyItemResponseDto createMyItem(UUID userId);

    // 아이템 사용
    public void useItem(UUID userId, Long itemId);

    // 내부 로직
    // userId로 User 찾기
    public User findUserById(UUID userId);

    // itemId로 item 찾기
    public Item findItemById(Long itemId);

    // userId & itemId로 myItem 찾기
    public List<MyItem> findMyItemByUserIdAndItemId(UUID userId, Long itemId);
}
