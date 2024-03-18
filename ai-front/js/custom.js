// 自定义当前prompt
function custom() { 
    let stepList = '';
    for (let i = 0; i < currentPrompt.processes.length; i++) { 
        stepList += `<div class="step-item" data-index="${i}">提问${i + 1}</div>`; 
    };

    let tips ='<p>${body}：引用对标文章的正文</p><p>${title}：引用对标文章的标题</p><p>${3}：使用GPT回答的文案“3”表示回答的第三骤</p>'

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

$('body').on('click', '#custom #confirmCustombtnBOx', function () {

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
    alert('修改成功！');
});