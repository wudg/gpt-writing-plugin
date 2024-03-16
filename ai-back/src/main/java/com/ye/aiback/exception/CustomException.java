package com.ye.aiback.exception;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class CustomException extends RuntimeException{
    /**
     *  自定义业务异常类
     * @param message
     */
    public CustomException(String message){
        super(message);
        log.info(message.toString());
    }
}
