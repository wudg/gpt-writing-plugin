package com.ye.aiback.service.impl;

import cn.dev33.satoken.stp.StpUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.ye.aiback.dao.UserDao;
import com.ye.aiback.domain.R;
import com.ye.aiback.entity.User;
import com.ye.aiback.service.UserService;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Map;
import java.util.Objects;

/**
 * (User)表服务实现类
 *
 * @author makejava
 * @since 2024-03-06 23:26:24
 */
@Service
public class UserServiceImpl extends ServiceImpl<UserDao, User> implements UserService {

    @Override
    public String doLogin(String username, String password) {
        User user = this.baseMapper.selectOne(new QueryWrapper<User>().lambda().eq(User::getUsername, username));
        if(Objects.isNull(user)){
            throw new IllegalArgumentException("不存在该账号，请重试");
        }

        if(Objects.nonNull(user.getDeadline()) && user.getDeadline().getTime() < System.currentTimeMillis()){
            throw new IllegalArgumentException("该账号已过期，请联系开发人员（Y1490727316）");
        }

        if(!Objects.equals(password, user.getPassword())){
            throw new IllegalArgumentException("登录密码错误，请重试");

        }
        StpUtil.login(username);
        return StpUtil.getTokenValueByLoginId(username);
    }

    @Override
    public void doRegister(String username, String password, String registerCode) {
        User user = new User();
        user.setUsername(username);
        user.setPassword(password);
        user.setRegisterCode(registerCode);
        user.setRegisterTime(new Date());
        user.setDeadline(new Date(System.currentTimeMillis() + 365*24*60*60));
        user.setStatus(0);
        this.baseMapper.insert(user);
    }
}

