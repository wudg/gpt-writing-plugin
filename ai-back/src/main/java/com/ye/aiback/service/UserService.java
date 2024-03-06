package com.ye.aiback.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.ye.aiback.entity.User;

/**
 * (User)表服务接口
 *
 * @author makejava
 * @since 2024-03-06 23:26:14
 */
public interface UserService extends IService<User> {

    String doLogin(String username, String password);

    void doRegister(String username, String password, String registerCode);
}

