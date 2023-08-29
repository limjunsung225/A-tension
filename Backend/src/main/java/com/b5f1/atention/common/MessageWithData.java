package com.b5f1.atention.common;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class MessageWithData {
    private String message;
    private Object data;
}
