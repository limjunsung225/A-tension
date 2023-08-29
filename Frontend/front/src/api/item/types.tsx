
export interface CreateMyItemResponseDto{
     // 아이템 이름
     name : string,
     // 아이템 이미지
     image : string, 
     // 아이템 타입 id
     itemTypeId : bigint,
     // 아이템 타입 이름
     itemTypeName : string, 
     // 아이템 타입 설명
     description : string
}

export interface FindAllItemsDto{
     // 아이템 이름
     name : string,
     // 아이템 이미지
     image : string, 
     // 아이템 타입 id
     itemTypeId : bigint,
     // 아이템 타입 이름
     itemTypeName : string, 
     // 아이템 타입 설명
     description : string
}

export interface FindMyItemResponseDto{
    ticket : number, 
    myItemDtoList : MyItemDto[]
}

export interface MyItemDto {
    // 아이템 이름
    name : string,
    // 아이템 이미지
    image : string, 
    // 아이템 타입 id
    itemTypeId : bigint,
    // 아이템 타입 이름
    itemTypeName : string, 
    // 아이템 타입 설명
    description : string
}