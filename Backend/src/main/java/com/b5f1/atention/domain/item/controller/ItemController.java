package com.b5f1.atention.domain.item.controller;

import com.b5f1.atention.common.MessageOnly;
import com.b5f1.atention.common.MessageWithData;
import com.b5f1.atention.domain.item.dto.CreateMyItemResponseDto;
import com.b5f1.atention.domain.item.dto.FindAllItemsDto;
import com.b5f1.atention.domain.item.dto.FindMyItemResponseDto;
import com.b5f1.atention.domain.item.service.ItemService;
import io.swagger.annotations.Api;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/item")
@Api(tags = "아이템")
@RequiredArgsConstructor
public class ItemController {

   private final ItemService itemService;

   // TODO
    @GetMapping("/all")
    @Operation(summary= "전체 아이템 조회", description = "전체 아이템을 조회하는 API입니다. 아이템 타입 및 설명도 담겨있습니다")
    public ResponseEntity<MessageWithData> findAllItems() {
        List<FindAllItemsDto> data = itemService.findAllItems();
        return new ResponseEntity<>(new MessageWithData("전체 아이템이 조회되었습니다", data), HttpStatus.OK);
    }

    @PostMapping
    @Operation(summary = "아이템 뽑기", description = "티켓을 사용해 랜덤으로 아이템을 뽑는 API입니다.")
    public ResponseEntity<MessageWithData> getRandomItem(Authentication authentication) {
        CreateMyItemResponseDto data = itemService.createMyItem(UUID.fromString(authentication.getName()));
        return new ResponseEntity<>(new MessageWithData("랜덤 아이템이 생성되었습니다.", data), HttpStatus.OK);
    }

    @GetMapping
    @Operation(summary = "보유 아이템 조회", description = "본인이 보유한 아이템을 전체 조회하는 API입니다")
    public ResponseEntity<MessageWithData> findMyItemList(Authentication authentication) {
        FindMyItemResponseDto data = itemService.findMyItemList(UUID.fromString(authentication.getName()));
        return new ResponseEntity<>(new MessageWithData("나의 보유 아이템이 조회 되었습니다.", data), HttpStatus.OK);
    }



    // PathVariable 혹은 RequestBody
    @DeleteMapping("/{itemId}")
    @Operation(summary = "아이템 사용", description = "아이템을 삭제하는 API입니다")
    public ResponseEntity<MessageOnly> deleteMyItem(Authentication authentication, @PathVariable Long itemId) {
        itemService.useItem(UUID.fromString(authentication.getName()), itemId);
        return new ResponseEntity<>(new MessageOnly("아이템 삭제에 성공하였습니다."), HttpStatus.OK);

    }
}