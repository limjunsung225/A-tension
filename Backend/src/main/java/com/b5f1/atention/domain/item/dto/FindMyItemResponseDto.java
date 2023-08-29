package com.b5f1.atention.domain.item.dto;

import com.b5f1.atention.entity.Item;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Getter @Builder
@NoArgsConstructor
@AllArgsConstructor
public class FindMyItemResponseDto {

    // 이이템 리스트
    // 기본적으로 초기화 하고 싶으면 Builder.Default 사용 필요
    @Builder.Default
    List<MyItemDto> myItemDtoList = new ArrayList<>();
    // 티켓 개수
    private int ticket;

    // 아이템 추가 메서드
    public void addItemDto(Item item) {
        // user를 여기서 받아도 되는데 ㅇ왜 여기서는 item을 받을까? -> 아래처럼 해도 됨
        MyItemDto myItemDto = MyItemDto.builder()
                .name(item.getName())
                .image(item.getImage())
                .itemTypeName(item.getItemType().getName())
                .itemTypeId(item.getItemType().getId())
                .description(item.getItemType().getDescription())
                .build();
        this.myItemDtoList.add(myItemDto);
    }

    // 이렇게 해도 됨. 취향 차이
//    public void test(User user) {
//        List<MyItem> myItemList = user.getMyItemList();
//        for (MyItem myItem : myItemList) {
//            Item item = myItem.getItem();
//            MyItemDto myItemDto = MyItemDto.builder()
//                    .name(item.getName())
//                    .image(item.getImage())
//                    .description(item.getItemType().getDescription())
//                    .build();
//            this.myItemDtoList.add(myItemDto);
//        }
//    }

    // 티켓 개수 설정 메서드
    // set은 안쓰는게 좋음
//    public void setTicket(int ticket) {
//        this.ticket = ticket;
//    }

}
