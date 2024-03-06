package com.ye.aiback.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.ye.aiback.entity.RegisterCode;

/**
 * (TUserRegister)表服务接口
 *
 * @author makejava
 * @since 2024-03-06 11:18:34
 */
public interface RegisterCodeService extends IService<RegisterCode> {

    boolean checkLegalCode(String registerCode);

    void expire(String registerCode);
}

