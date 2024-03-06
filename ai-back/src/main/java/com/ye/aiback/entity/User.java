package com.ye.aiback.entity;

import java.util.Date;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.extension.activerecord.Model;
import lombok.Data;

import java.io.Serializable;

/**
 * (User)表实体类
 *
 * @author makejava
 * @since 2024-03-06 23:26:09
 */
@SuppressWarnings("serial")
@Data
@TableName("t_user")
public class User extends Model<User> {

    @TableId(type = IdType.AUTO)
    private Integer id;
    
    private String password;
    
    private String username;
    //注册码
    private String registerCode;
    //注册时间
    private Date registerTime;
    //账号有效期
    private Date deadline;
    //账号状态（0-生效中 1-已过期）
    private Integer status;

}

