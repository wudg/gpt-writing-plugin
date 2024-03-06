package com.ye.aiback.entity;

import java.util.Date;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.extension.activerecord.Model;
import lombok.Data;

/**
 * (TUserRegister)表实体类
 *
 * @author makejava
 * @since 2024-03-06 11:18:32
 */
@SuppressWarnings("serial")
@Data
@TableName("t_register_code")
public class RegisterCode extends Model<RegisterCode> {

    @TableId(type = IdType.AUTO)
    private Integer id;
    //注册码
    private String registerCode;

    private Date createTime;

    private Integer deleted;
}

