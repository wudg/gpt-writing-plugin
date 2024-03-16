// 自定义当前prompt
function custom() {
    console.log(currentPrompt);
    let stepList = '';
    for (let i = 0; i < currentPrompt.processes.length; i++) {
        if (currentPrompt.processes[i].operateType === 1) {
            stepList += `<div class="step-item" data-index="${i}">步骤${i + 1}</div>`;
        }
    };
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