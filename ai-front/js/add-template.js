var addStepList = [];
var exportList = [];
// 自定义添加prompt
function addTemplate() {
    addStepList = [];
    let tips = '<p>${body}：引用对标文章的正文</p><p>${title}：引用对标文章的标题</p><p>${3}：使用GPT回答的文案“3”表示回答的第三步</p>'
    let str = `
    <div id="addTemplate">
        <div class="mask"></div>
        <div class="custom-input">
            <div class="templateTile">添加模板</div>
            <div class="inputGroup">
                <div class="item-input">
                    <div class="lable">
                        模板标题：
                    </div>
                    <div class="value">
                        <input id="templateTitle" type="text">
                    </div>
                </div>
                <div class="item-input">
                    <div class="lable">
                        模板描述：
                    </div>
                    <div class="value">
                        <input id="templateIntro" type="text">
                    </div>
                </div>
            </div>
            <div class="step">
                <div class="step-item" data-index="-1">+添加提问</div>
            </div>
            <div class="step step2">
            </div>
            <div class="item-input type">
                <div class="lable">
                    选择提问类型：
                </div>
                <div class="value">
                    <label for="option1">
                        <input type="radio" id="option1" name="options" value="1" checked>
                        自定义文案
                    </label> 
                    <label for="option2">
                        <input type="radio" id="option2" name="options" value="2">
                        引用GPT回答内容
                    </label> 
                    <label for="option3">
                        <input type="radio" id="option3" name="options" value="3">
                        引用对标文章标题
                    </label>
                    <label for="option4">
                        <input type="radio" id="option4" name="options" value="4">
                        引用对标文章内容
                    </label>
                </div>
            </div>
            <div class="item-input type">
                <div class="lable">
                    选择导出时内容：
                </div>
                <div class="value export"> 
                </div>
            </div>

            <div class="textarea-container">
                <textarea id="addTemplateTextarea"></textarea>
            </div>
             
            <div class="tips">
                <p>注意：出现以下关键字请勿更改关键字字符</p>
                ${tips}
            </div>
            <div id="custombtnBOx">
                <span id="closeCustombtnBOx">关闭（会清空当前所有配置）</span>
                <span id="confirmCustombtnBOx">确定添加</span>
            </div>
        </div>
    </div>`;
    // 将按钮插入到页面body结束前  
    $(document.body).append(str);
}

// 点击步骤 
$('body').on('click', '#addTemplate .step .step-item', function () {
    let index = $(this).data('index');
    if (index == '-1') {
        for (let i = 0; i < addStepList.length; i++) {
            if (!addStepList[i].express) {
                alert('请先完成：《提问' + (i + 1) + '》，的提问内容！');
                return;
            }
        }
        addStepList.push({
            express: '',
            operateType: 1,
        });
        let step = `<div class="step-item" data-index="${addStepList.length - 1}">提问${addStepList.length} <span class="delDtep" data-index="${addStepList.length - 1}">X</span> </div>`;
        let answer = `<div class="step-item" data-index="${addStepList.length - 1}">答案${addStepList.length}</div>`;
        $('#addTemplate .step2').append(step);
        $('#addTemplate .export').append(answer);
        // 默认选中最后一次添加的
        $('#addTemplate .step .step-item').removeClass('on');
        $('#addTemplate .step .step-item').eq(addStepList.length).addClass('on');
        $('input[type="radio"][name="options"][value="1"]').prop('checked', true);
        $('#addTemplateTextarea').val('');
        return;
    }
    $(this).siblings('div').removeClass('on');
    $(this).addClass('on');
    var selectedValue = $("#addTemplate :radio:checked").val();
    if (addStepList[index].operateType !== null) {
        $('#addTemplateTextarea').val(addStepList[index].express);
        $('input[type="radio"][name="options"][value="' + addStepList[index].operateType + '"]').prop('checked', true);
        return;
    }
    renderingTextarea(selectedValue);
})

$('body').on('change', '#addTemplate input[type="radio"][name="options"]', function () {
    var selectedValue = $(this).val();
    renderingTextarea(selectedValue);
});
$('body').on('input', '#addTemplate #addTemplateTextarea', function () {
    changeValue();
});

function renderingTextarea(val) {
    if (val == 2) {
        $('#addTemplateTextarea').val('${1}');
    } else if (val == 3) {
        $('#addTemplateTextarea').val('${title}');
    } else if (val == 4) {
        $('#addTemplateTextarea').val('${body}');
    } else {
        $('#addTemplateTextarea').val('');
    }
    changeValue();
}

$('body').on('click', '#addTemplate #closeCustombtnBOx', function () {
    $('#addTemplate').remove();
});

function changeValue() {
    let index = $("#addTemplate .step-item.on").data('index');
    if (index === undefined) {
        return;
    }
    var selectedValue = $("#addTemplate :radio:checked").val();
    addStepList[index].operateType = selectedValue;
    let val = $('#addTemplateTextarea').val();
    addStepList[index].express = val;
} 

$('body').on('click', '#addTemplate .delDtep', function (event) {
    let index = $(this).data('index');
    $(this).remove();
    addStepList.splice(index, 1);
    let stepList = '';
    let answer = '';
    for (let i = 0; i < addStepList.length; i++) {
        stepList += `<div class="step-item" data-index="${i}">提问${i + 1} <span class="delDtep" data-index="${addStepList.length - 1}">X</span> </div>`;
        answer += `<div class="step-item" data-index="${i}">答案${i + 1}</div>`;
    };
    $('#addTemplate .step2').html(stepList);
    $('#addTemplate .export').html(answer);
    event.stopPropagation(); // 阻止
});

$('body').on('click', '#addTemplate #confirmCustombtnBOx', function () {
    let title = $("#addTemplate #templateTitle").val();
    if (!title) {
        alert('请输入模板标题');
        return;
    }
    let intro = $("#addTemplate #templateIntro").val();
    if (!intro) {
        alert('请输入模板描述');
        return;
    }
    if (addStepList.length == 0) {
        alert('请添加提问内容');
        return;
    }

    for (let i = 0; i < addStepList.length; i++) {
        if (!addStepList[i].express || !addStepList[i].operateType) {
            alert('提问' + (i + 1) + '，没有填写提问内容！');
            return;
        }
    }
    if (exportList.length == 0) {
        alert('请选择导出的内容顺序');
        return;
    }
    let obj = {
        type: 1,
        intro,
        ruleName: title,
        txtOutput: exportList,
        processes: addStepList
    }
    promptList.unshift(obj);
    localityPromptList.unshift(obj);
    chrome.storage.local.set({ 'localityPromptList': localityPromptList });

    let menuList = '';
    for (let i = 0; i < promptList.length; i++) {
        menuList += `<li class="item ${i == 0 ? 'on' : ''}" data-index="${i}">
                <div class="item-title">${promptList[i].ruleName}</div>
                <div class="item-describe">${promptList[i].intro}</div>
            </li>`;
    };
    $('#menuList').html(menuList);
    $('#addTemplate').remove();
});



// 点击步骤 
$('body').on('click', '#addTemplate .export .step-item', function () {
    if ($(this).hasClass('on')) {
        // 元素具有 on 类
        $(this).removeClass('on');
    } else {
        // 元素没有 on 类
        $(this).addClass('on');
    }
    exportList = [];
    let arr = $('#addTemplate .export .step-item.on');
    for (let i = 0; i < arr.length; i++) {
        exportList.push($(arr[i]).data('index') + 1);
    }

});