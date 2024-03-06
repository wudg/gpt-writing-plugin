package com.ye.aiback.dao;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.ye.aiback.entity.User;
import org.apache.ibatis.annotations.Mapper;

/**
 * (User)表数据库访问层
 *
 * @author makejava
 * @since 2024-03-06 23:26:05
 */
@Mapper
public interface UserDao extends BaseMapper<User> {

}

