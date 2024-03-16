package com.ye.aiback.controller;

import cn.dev33.satoken.stp.StpLogic;
import cn.dev33.satoken.stp.StpUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.ye.aiback.config.WriterConfig;
import com.ye.aiback.domain.R;
import com.ye.aiback.domain.WriterInfo;
import com.ye.aiback.entity.User;
import com.ye.aiback.exception.CustomException;
import com.ye.aiback.service.RegisterCodeService;
import com.ye.aiback.service.UserService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.*;

@Api(tags = "用户登录注册",value = "用户登录注册")
@RestController
@RequestMapping("/user/")
public class UserLoginController {

    @Resource
    private RegisterCodeService registerCodeService;

    @Resource
    private UserService userService;

    // 测试登录，浏览器访问： http://localhost:8081/user/doLogin?Postname=zhang&password=123456
    @ApiOperation("登录")
    @PostMapping("doLogin")
    public R doLogin(String username, String password) {
        // 此处仅作模拟示例，真实项目需要从数据库中查询数据进行比对
        return R.ok(userService.doLogin(username, password));
    }

    @ApiOperation("注册")
    @PostMapping("doRegister")
    @Transactional(rollbackFor = CustomException.class)
    public R doRegister(String username, String password, String registerCode) {
        // 此处仅作模拟示例，真实项目需要从数据库中查询数据进行比对
        if(Objects.isNull(registerCode) || registerCode.length() == 0){
            return R.fail("注册码不能为空，如果没有验证码，请联系开发人员（Y1490727316）");
        }

        boolean isLegal = registerCodeService.checkLegalCode(registerCode);
        // check code legal
        if(!isLegal){
            return R.fail("注册码不存在或已被使用，请联系开发人员（Y1490727316）");
        }
        userService.doRegister(username, password, registerCode);
        registerCodeService.expire(registerCode);
        return R.ok(null, "注册成功");
    }

    @ApiOperation("根据Token判断是否登录过期")
    // 查询登录状态，浏览器访问： http://localhost:8081/user/isLogin
    @GetMapping("isLogin")
    public R isLogin(String token) {
        Object username = StpUtil.getLoginIdByToken(token);
        return R.ok(StpUtil.isLogin(username));
    }

    @ApiOperation("获取用户插件有效期信息")
    // 查询登录状态，浏览器访问： http://localhost:8081/user/isLogin
    @GetMapping("userInfo")
    public R userInfo(@RequestParam(required = false) String username) {
        if(Objects.isNull(username)){
            throw new CustomException("购买/续费请联系开发人员（Y1490727316）");
        }
        User existUser = userService.getOne(new QueryWrapper<User>().lambda().eq(User::getUsername, username));
        if(Objects.isNull(existUser)){
            throw new CustomException("不存在该用户，请联系开发人员（Y1490727316）");
        }
        if(Objects.equals(existUser.getStatus(), 1)){
            throw new CustomException("该账号已过期，请联系开发人员（Y1490727316）");
        }
        return R.ok(WriterInfo.builder()
                .deadline(existUser.getDeadline())
                .name("AI爆文自动化插件")
                .registerTime(existUser.getRegisterTime())
                .remark("购买/续费请联系开发人员（Y1490727316）")
                .build(), "获取用户插件相关信息成功");
    }

    @ApiOperation("AI流程配置")
    @GetMapping({"/json"})
    public R json(){
        return R.ok(WriterConfig.writerConfigEntity, "获取AI流程配置成功");
    }
}

