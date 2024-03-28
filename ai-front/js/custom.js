// 自定义当前prompt
function custom() {
    console.log(currentPrompt);
    let stepList = '';
    for (let i = 0; i < currentPrompt.processes.length; i++) {
        stepList += `<div class="step-item" data-index="${i}">提问${i + 1}</div>`;
    };

    let tips = '<p>${body}：引用对标文章的正文</p><p>${title}：引用对标文章的标题</p><p>${3}：使用GPT回答的文案“3”表示回答的第三骤</p>'

    let str = `
    <div id="custom">
        <div class="mask"></div>
        <div class="custom-input">
            <div class="templateTile">模板修改【${currentPrompt.ruleName}】</div>
            <div class="step">
                ${stepList}
            </div>
            <div class="textarea-container">
                <textarea id="custom-textarea"></textarea>
            </div>
            <div class="tips">
                <p>注意：出现以下关键字请勿更改关键字字符</p>
                ${tips}
            </div>
            <div id="custombtnBOx">
                <span id="closeCustombtnBOx">关闭</span>
                <span id="confirmCustombtnBOx">确定</span>
            </div>
        </div>
    </div>`;
    // 将按钮插入到页面body结束前  
    $(document.body).append(str);
}


// 点击步骤 
$('body').on('click', '#custom .step-item', function () {
    let index = $(this).data('index');
    $(this).siblings('div').removeClass('on');
    $(this).addClass('on');
    processes = currentPrompt.processes[index].express;
    $('#custom-textarea').val(processes);
})

$('body').on('click', '#custom #closeCustombtnBOx', function () {
    $('#custom').remove();
});

$('body').on('click', '#custom #confirmCustombtnBOx', async function () {

    let index = $("#custom .step-item.on").data('index');
    if (index === undefined) {
        alert('请选中需要修改的步骤');
        return;
    }

    let val = $('#custom-textarea').val();
    if (!val) {
        alert('请输入模板内容');
        return;
    }
    currentPrompt.processes[index].express = val; 
    let l = [];
    for (let i = 0; i < currentPrompt.processes.length; i++) {
        l.push({
            "express": currentPrompt.processes[i].express,
            "operateType": currentPrompt.processes[i].operateType,
            "id": currentPrompt.processes[i].processId,
            "step": currentPrompt.processes[i].step,
        });
    }  
    let user = await retrieveData('user-info') || null;
    // 开始添加
    $.ajax({
        url: url + "/ruleTemplate",
        type: "post",
        dataType: 'json', // 期望的响应数据类型
        contentType: 'application/json', // 设置请求的内容类型为 JSON
        data: JSON.stringify({
            "createTemplateFlowReqList": l,
            "outputSteps": JSON.stringify(currentPrompt.txtOutput),
            "templateCategory": 1,
            "templateIntro": currentPrompt.intro,
            "id": currentPrompt.templateId,
            "templateName": currentPrompt.ruleName,
            "userId": user.userid
        }),
        success: function (res) {
            loding = false;
            if (res.code == 200) {
                alert('修改成功！');
                $('#custom').remove();
            } else {
                alert(res.msg);
            }
        },
        error: function (xhr, type, errorThrown) {
            loding = false;
            if (xhr.status == 0) {
                alert('无法连接到服务器，请检查网络');
            }
            alert("异常：" + JSON.stringify(xhr));
        }
    });
    
    setUserActionLog(4, '');
});