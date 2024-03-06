package com.ye.aiback.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.ye.aiback.dao.RegisterCodeDao;
import com.ye.aiback.entity.RegisterCode;
import com.ye.aiback.service.RegisterCodeService;
import org.springframework.stereotype.Service;

import java.util.Objects;

/**
 * (TUserRegister)表服务实现类
 *
 * @author makejava
 * @since 2024-03-06 11:18:34
 */
@Service
public class RegisterCodeServiceImpl extends ServiceImpl<RegisterCodeDao, RegisterCode> implements RegisterCodeService {

    @Override
    public boolean checkLegalCode(String registerCode) {
        RegisterCode registerCodeRecord = this.baseMapper.selectOne(new QueryWrapper<RegisterCode>().eq("register_code", registerCode));
        return Objects.nonNull(registerCodeRecord);
    }

    @Override
    public void expire(String registerCode) {
        RegisterCode registerCodeRecord = this.baseMapper.selectOne(new QueryWrapper<RegisterCode>().eq("register_code", registerCode));
        registerCodeRecord.setDeleted(1);
        this.baseMapper.updateById(registerCodeRecord);
    }
}

