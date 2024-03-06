package com.ye.aiback.controller;

import cn.dev33.satoken.stp.StpUtil;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class IndexController {
    // 浏览器访问测试： http://localhost:8081
    @RequestMapping({ "/index", "/"})
    public String index() {
        if(StpUtil.isLogin()){
            return "index";
        }
        return "login";
    }
    @RequestMapping({"/login"})
    public String login() {
        return "login";
    }

    @RequestMapping({"/register"})
    public String register() {
        return "register";
    }
}
