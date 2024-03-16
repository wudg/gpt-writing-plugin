package com.ye.aiback.config;

import com.ye.aiback.domain.R;
import com.ye.aiback.exception.CustomException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * 全局异常捕获
 */
@Slf4j
@ControllerAdvice(annotations = {RestController.class, Controller.class})
//只要类的注解上有这些注解。那么发生的异常都能被捕获到
@ResponseBody
public class GlobalExceptionHandler {
    /**
     * 处理除0异常捕获
     * @param exception
     * @return
     */
    @ExceptionHandler(ArithmeticException.class)//ArithmeticException异常类型通过注解拿到
    public R<String> exceptionHandler(ArithmeticException exception){
        log.error(exception.getMessage());//在控制台打印错误信息
        return R.fail(exception.getMessage());

    }

    @ExceptionHandler(CustomException.class)//RuntimeException异常类型通过注解拿到
    public R<String> exceptionCategoryDelete(CustomException exception){
        log.error(exception.getMessage());//在控制台打印错误信息
        return R.fail(exception.getMessage());

    }
}

