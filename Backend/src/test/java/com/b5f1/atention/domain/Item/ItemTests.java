package com.b5f1.atention.domain.Item;

import com.b5f1.atention.domain.item.dto.CreateMyItemResponseDto;
import com.b5f1.atention.domain.item.dto.MyItemDto;
import com.b5f1.atention.domain.item.repository.ItemRepository;
import com.b5f1.atention.domain.item.repository.ItemTypeRepository;
import com.b5f1.atention.domain.item.repository.MyItemRepository;
import com.b5f1.atention.domain.item.service.ItemService;
import com.b5f1.atention.domain.user.repository.UserRepository;
import com.b5f1.atention.entity.Item;
import com.b5f1.atention.entity.ItemType;
import com.b5f1.atention.entity.MyItem;
import com.b5f1.atention.entity.User;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.junit4.SpringRunner;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

@RunWith(SpringRunner.class)
@SpringBootTest
@Transactional
@Rollback
public class ItemTests {
    @Autowired
    private ItemService itemService;

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private MyItemRepository myItemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ItemTypeRepository itemTypeRepository;


    @Test
    public void findAllItemsTest() {
        // 아이템 3개를 만들고, 저장, 이 때 아이템Id들을 저장해놓는다
        // findAllItems 메서드를 써서 set를 받아온 후 위 아이템 3개가 있는지 확인
        //given
        ItemType itemType1 = ItemType.builder()
                .build();
        itemType1 = itemTypeRepository.save(itemType1);
        // 아이템 3개 저장
        Item item1 = Item.builder()
                .itemType(itemType1)
                .build();
        item1 = itemRepository.save(item1);
        Item item2 = Item.builder()
                .itemType(itemType1)
                .build();
        item2 = itemRepository.save(item2);
        Item item3 = Item.builder()
                .itemType(itemType1)
                .build();
        item3 = itemRepository.save(item3);
        // when
        // 아이템 3개의 ID 보관
        Long itemId1 = item1.getId();
        Long itemId2 = item2.getId();
        Long itemId3 = item3.getId();

        //then
        Set<Long> allItemsSet = itemService.findAllItemNames();
        assertThat(allItemsSet.contains(itemId1)).isEqualTo(true);
        assertThat(allItemsSet.contains(itemId2)).isEqualTo(true);
        assertThat(allItemsSet.contains(itemId3)).isEqualTo(true);
    }

    @Test
    public void findMyItemListTests() {
        // 아이템 2개 만들어서 user1 아이템에 넣고 넣은 후 myItem개수 2개인지 확인해보자
        //given
        // 임의 user 생성 후 db 저장
        User user1 = User.builder()
                .email("testEmail1")
                .meetingUrl("testUrl1")
                .build();
        // 티켓 2장
        user1.addTicket();
        user1.addTicket();
        user1 = userRepository.save(user1);
        List<MyItem> myItemList1 = new ArrayList<>();
        // 임의의 myItem 생성
        CreateMyItemResponseDto createMyItemResponseDto1 = itemService.createMyItem(user1.getId());
        // optional 쓰는 대신 orElseThrow해주면 optional<Item>이 아닌 item으로 사용가능
//        Item item1 = itemRepository.findByNameAndIsDeletedFalse(createMyItemResponseDto.getName())
//                .orElseThrow(() -> new RuntimeException("해당 아이템을 찾을 수 없습니다"));
//        myItemList.add(MyItem.builder().item(item1).user(user1).build());
        CreateMyItemResponseDto createMyItemResponseDto2 = itemService.createMyItem(user1.getId());
//        Item item2 = itemRepository.findByNameAndIsDeletedFalse(createMyItemResponseDto.getName())
//                .orElseThrow(() -> new RuntimeException("해당 아이템을 찾을 수 없습니다"));
//        myItemList.add(MyItem.builder().item(item2).user(user1).build());

        //when
        List<MyItemDto> myItemDtoList = itemService.findMyItemList(user1.getId()).getMyItemDtoList();
        for (MyItemDto myItemDto : myItemDtoList) {
            Item item = itemRepository.findByNameAndIsDeletedFalse(myItemDto.getName())
                    .orElseThrow(() -> new RuntimeException("해당 아이템을 찾을 수 없습니다"));
            List<MyItem> sameMyItemList = myItemRepository.findByUserAndItemAndIsDeletedFalse(user1, item);
            myItemList1.addAll(sameMyItemList);
        }

        System.out.println("myItem");
        for (MyItem myItem : myItemList1) {
            System.out.println(myItem.getItem().getName());
        }


        //then
        assertThat(myItemList1.size()).isEqualTo(2);
    }

    @Test
    public void createMyItemTests() {
        //given
        User user1 = User.builder()
                .email("testEmail1")
                .meetingUrl("testUrl1")
                .build();
        user1 = userRepository.save(user1);
        // 티켓 2장 보유
        user1.addTicket();
        user1.addTicket();

        //when

        //then

    }
}