package com.ye.aiback.controller;

import cn.dev33.satoken.stp.StpUtil;
import com.ye.aiback.config.WriterConfig;
import com.ye.aiback.domain.WriterConfigEntity;
import com.ye.aiback.domain.R;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Api(tags = "页面跳转控制器",value = "页面跳转控制器")
@Controller
public class IndexController {

    // 浏览器访问测： http://localhost:8081
    @ApiOperation("首页")
    @GetMapping({ "/index", "/"})
    public String index() {
        if(StpUtil.isLogin()){
            return "index";
        }
        return "login";
    }

    @ApiOperation("登录页")
    @GetMapping({"/login"})
    public String login() {
        return "login";
    }

    @ApiOperation("注册页")
    @GetMapping({"/register"})
    public String register() {
        return "register";
    }
}
