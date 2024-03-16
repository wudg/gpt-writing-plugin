package com.ye.aiback.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import java.util.Date;

@Data
@Accessors(chain = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WriterInfo {

    /**
     * 插件名称
     */
    private String name;

    /**
     * 注册时间(开始时间)
     */
    private Date registerTime;

    /**
     * 账号有效期(截止时间)
     */
    private Date deadline;

    /**
     * 备注（续费或者购买，请联系：Y1490727316）
     */
    private String remark;
}
