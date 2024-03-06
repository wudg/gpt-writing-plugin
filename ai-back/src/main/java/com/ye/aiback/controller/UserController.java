package com.ye.aiback.controller;

import cn.dev33.satoken.stp.StpUtil;
import com.ye.aiback.domain.R;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

@RestController
@RequestMapping("/user/")
public class UserController {

    private static Map<String, String> users = new HashMap<>(16);
    private static Set<String> legalCodeSet = new HashSet<>();

    static {
        legalCodeSet.add("5555");
        legalCodeSet.add("6666");
        legalCodeSet.add("7777");
    }

    // 测试登录，浏览器访问： http://localhost:8081/user/doLogin?username=zhang&password=123456
    @RequestMapping("doLogin")
    public R doLogin(String username, String password) {
        // 此处仅作模拟示例，真实项目需要从数据库中查询数据进行比对
        for (Map.Entry<String, String> entry : users.entrySet()) {
            if(entry.getKey().equals(username) && entry.getValue().equals(password)) {
                if(entry.getValue().equals(password)){
                    StpUtil.login(10001);
                    return R.ok("登录成功");
                }else{
                    R.fail("登录密码错误，请重试");
                }
            }
        }
        return R.fail("登录失败");
    }

    @RequestMapping("doRegister")
    public R doRegister(String username, String password, String registerCode) {
        // 此处仅作模拟示例，真实项目需要从数据库中查询数据进行比对
        if(Objects.isNull(registerCode) || registerCode.length() == 0){
            return R.fail("注册码不能为空，如果没有验证码，请联系开发人员（Y1490727316）");
        }
        // check code legal
        if(!legalCodeSet.contains(registerCode)){
            return R.fail("注册码不存在或已被使用，请联系开发人员（Y1490727316）");
        }
        users.put(username, password);
        legalCodeSet.remove(registerCode);
        return R.ok();
    }

    // 查询登录状态，浏览器访问： http://localhost:8081/user/isLogin
    @RequestMapping("isLogin")
    public R isLogin() {
        return R.ok(StpUtil.isLogin());
    }

}

