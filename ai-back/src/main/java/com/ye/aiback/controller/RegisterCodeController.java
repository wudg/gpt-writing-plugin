package com.ye.aiback.controller;



import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.ye.aiback.domain.R;
import com.ye.aiback.entity.RegisterCode;
import com.ye.aiback.service.RegisterCodeService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.io.Serializable;
import java.util.Date;
import java.util.List;
import java.util.UUID;

/**
 * (UserRegister)表控制层
 *
 * @author makejava
 * @since 2024-03-06 11:18:27
 */

@Api(tags = "用户注册权限验证控制器",value = "用户注册权限验证控制器")
@RestController
@RequestMapping("registerCode")
public class RegisterCodeController {
    /**
     * 服务对象
     */
    @Resource
    private RegisterCodeService registerCodeService;

    /**
     * 分页查询所有数据
     *
     * @param page 分页对象
     * @param registerCode 查询实体
     * @return 所有数据
     */
    @ApiOperation("查询全部注册码")
    @GetMapping("selectAll")
    public R selectAll(Page<RegisterCode> page, RegisterCode registerCode) {
        return R.ok(this.registerCodeService.page(page, new QueryWrapper<>(registerCode)));
    }

    /**
     * 通过主键查询单条数据
     *
     * @param id 主键
     * @return 单条数据
     */
    @ApiOperation("根据ID查询注册码")
    @GetMapping("{id}")
    public R selectOne(@PathVariable Serializable id) {
        return R.ok(this.registerCodeService.getById(id));
    }

    /**
     * 新增数据
     *
     * @return 新增结果
     */
    @ApiOperation("插入注册码")
    @GetMapping("insert")
    public R insert() {
        RegisterCode registerCode = new RegisterCode();
        registerCode.setRegisterCode(UUID.randomUUID().toString());
        registerCode.setCreateTime(new Date());
        this.registerCodeService.save(registerCode);
        return R.ok(registerCode.getRegisterCode(), "注册码生成成功，快去使用吧");
    }

    /**
     * 修改数据
     *
     * @param registerCode 实体对象
     * @return 修改结果
     */
    @ApiOperation("更新注册码")
    @PostMapping("update")
    public R update(@RequestBody RegisterCode registerCode) {
        return R.ok(this.registerCodeService.updateById(registerCode));
    }

    /**
     * 删除数据
     *
     * @param idList 主键结合
     * @return 删除结果
     */
    @ApiOperation("删除全部注册码")
    @DeleteMapping
    public R delete(@RequestParam("idList") List<Long> idList) {
        return R.ok(this.registerCodeService.removeByIds(idList));
    }
}

