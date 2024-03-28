// content.js
var href = '';
var hostname = '';
var token = null;
var gatherList = []; // 采集的数据列表

var loding = false;
var selectAll = false; // 是否全选
var textarea = null; // textarea 输入框元素
var currentPage = 0; // 当前回答的问题 第几步
var currentPrompt = null; // 当前选中的模板
var answerList = []; // 答案列表
var promptList = []; // 模板列表
var localityPromptList = []; // 本地模板列表
var content = null; // 当前文章


// var url = "http://frp.wudiguang.top"; // 测试环境
var url = "https://aiwrite.wudiguang.top"; // 正式环境

(async function () {
    // 获取textarea元素
    textarea = document.getElementById('prompt-textarea');
    // 创建页面中的按钮组
    var div = document.createElement('div');
    div.style.position = 'fixed';
    div.style.top = '50%';
    div.style.transform = 'translateY(-50%)';
    div.style.zIndex = '990';
    div.style.right = '20px';
    div.id = 'gatherDiv';
    // 将按钮插入到页面body结束前
    document.body.appendChild(div);

    // 获取主机名（不包括协议和端口）
    hostname = window.location.hostname;
    href = window.location.href;

    // 获取所有本地存储的内容
    getRrticleAll();
    // 判断主机名是否包含 "chat.openai.com"
    if (hostname.includes('chat.openai.com') || hostname.includes('frp.wudiguang.top')) {
        // 批量提问
        questionBtn();
        // 内容导出
        exportBtn();
    } else {
        // ('当前域名不包含 chat.openai.com');
        // 创建文字采集按钮元素
        gatherBtn();
    }
    getPromptList();
})();

async function getPromptList(v) {
    token = await retrieveData('token');
    if (!token) {
        return;
    }
    $.ajax({
        url: url + "/ruleTemplate/listTemplate?token=" + token,
        type: "get",
        dataType: 'json',
        success: function (res) {
            if (res.code == 200) {
                promptList = res.data;
                if (v === 1) {
                    createEL();
                }
            }
        }
    });

}

// 操作按样式
function operateBtnCss(button) {
    button.style.fontSize = '16px';
    button.style.padding = '7px 14px';
    button.style.display = 'block';
    button.style.margin = '10px 0';
    button.style.borderRadius = '6px';
    button.style.fontWeight = '400';
    button.style.backgroundColor = '#54b01c';
    button.style.textShadow = 'none';
    button.style.border = 'none';
    button.style.color = '#fff';
    button.className = 'button1';
};
// 获取收集的文章
function getRrticleAll() {
    chrome.storage.local.get(['gather-list'], function (items) {
        gatherList = items['gather-list'] || [];
    });
};

// 创建文字采集按钮元素
function gatherBtn() {
    var button = document.createElement('button');
    button.textContent = '文字采集';
    operateBtnCss(button);
    // 添加事件监听器
    button.addEventListener('click', startGather);
    var targetElement = document.getElementById('gatherDiv');
    targetElement.appendChild(button); // 将HTML内容添加到目标元素的末尾
};
// 文章按钮采集点击时
async function startGather() {
    if (loding) { return; };
    if (!await checkToken()) {
        return;
    }
    let obj = null;
    // 判断主机名是否包含 "chat.openai.com"
    if (href.includes('toutiao.com/article')) {
        obj = await toutiaoArticle();

    } else if (href.includes('mp.weixin.qq.com')) {
        obj = await wxArticle();
    }
    if (!obj) {
        return;
    }
    gatherList.push(obj);
    chrome.storage.local.set({ 'gather-list': gatherList }, function () {
        alert('已选择文章，可以选择下一个了');
    });
    setUserActionLog(1, JSON.stringify(obj));
};

// 头条文章采集article
async function toutiaoArticle() {
    let gatherObj = {
        title: $('.article-content h1').text(),
        content: $('.tt-article-content p').text(),
        url: window.location.href
    }
    if (!await check(gatherObj)) {
        return false;
    }
    return gatherObj;
};

// 公众号文章采集article
async function wxArticle() {
    let gatherObj = {
        title: $('#activity-name').text(),
        content: $('#js_content').text(),
        url: window.location.href
    }
    if (!await check(gatherObj)) {
        return false;
    }
    return gatherObj;
};


// 校验token
async function checkToken() {
    loding = true;
    token = await retrieveData('token');
    if (!token) {
        alert('当前没有登录，或登录失效，请重新登录');
        loding = false;
        return false;
    }
    let loginTime = await retrieveData('login-time') || null;
    if (loginTime && isTimestampWithinToday(loginTime)) {
        loding = false;
        return true;
    }
    let status = false;
    $.ajax({
        url: url + "/user/isLogin?token=" + token,
        type: "get",
        dataType: 'json',
        async: false, // 将 async 设置为 false
        xhrFields: {
            withCredentials: true
        },
        success: function (res) {
            status = res.data;
            if (!status) {
                alert('当前没有登录，或登录失效，请重新登录');
                chrome.storage.local.set({ 'token': null });
                loding = false;
                return false;
            }
            chrome.storage.local.set({ 'login-time': new Date().getTime() });
        }
    });
    loding = false;
    return status;
};


// 校验采集文章
async function check(obj) {
    gatherList = await retrieveData('gather-list') || [];
    if (obj.content.length < 11) {
        alert('获取文章出错,文字太少或者是纯图片不能采集');
        return false;
    }
    for (let i = 0; i < gatherList.length; i++) {
        if (gatherList[i].title === obj.title) {
            alert('文章已存在列表中，不用再加了');
            return false;
        }
    }
    if (gatherList.length >= 10) {
        alert('最多只能选择10篇文章哦，将删除最早添加的数据');
        return false;
    }
    return true;
};

// 批量提问
function questionBtn() {
    var button = document.createElement('button');
    button.textContent = '批量提问';
    operateBtnCss(button);
    // 添加事件监听器
    button.addEventListener('click', startQuestion);
    // 将按钮插入到页面body结束前 
    var targetElement = document.getElementById('gatherDiv');
    targetElement.appendChild(button); // 将HTML内容添加到目标元素的末尾
}

// 批量提问点击
async function startQuestion(event) {
    if (loding) { return; };
    if (!await checkToken()) {
        return;
    }

    if (promptList.length === 0) {
        getPromptList(1);
    }

    let el = $('#ask');
    if (el.length) {
        // ID 存在
    } else {
        // ID 不存在
        createEL();
    }
    
    setUserActionLog(1, '');

};

// 内容导出
function exportBtn() {
    var button = document.createElement('button');
    button.textContent = '内容导出';
    operateBtnCss(button);
    // 添加事件监听器
    button.addEventListener('click', startExport);
    // 将按钮插入到页面body结束前 
    var targetElement = document.getElementById('gatherDiv');
    targetElement.appendChild(button); // 将HTML内容添加到目标元素的末尾
}
// 内容导出点击
async function startExport(event) {
    if (answerList.length === 0) {
        alert('当前没有可导出的内容！');
        return;
    }
    if (loding) { return; };
    if (!await checkToken()) {
        return;
    }

    let content = '';
    for (let i = 0; i < currentPrompt.txtOutput.length; i++) {
        content += `${answerList[currentPrompt.txtOutput[i] - 1]}\n\n`
    }
    exportToWord(content);
    setUserActionLog(3, JSON.stringify(content));
}
function getData(key) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(key, (result) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(result[key] || null);
            }
        });
    });
}
async function retrieveData(key) {
    try {
        return await getData(key);
    } catch (error) {
        console.error(error);
    }
}

async function createEL() {
    gatherList = await retrieveData('gather-list') || [];
    let li = '';
    for (let i = 0; i < gatherList.length; i++) {
        li += `<li>
            <input type="checkbox" name="content" value="${i}" data-title="${gatherList[i].title}" />
            <a style="text-decoration: none; color:#333" target="_blank" title="${gatherList[i].title}" href="${gatherList[i].url}">${gatherList[i].title}</a>
            <span class="delete-btn" dom-index="${i}">删除</span>
        </li>`;
    };

    if (!li) {
        li = `<li class="none">暂无文章，快去采集文章吧！</li>`;
    }

    if (promptList.length === 0) {
        alert('数据异常，请重新刷新页面！');
        return;
    }
    let menuList = '';
    currentPrompt = promptList[0];
    for (let i = 0; i < promptList.length; i++) {
        menuList += `<li class="item ${i == 0 ? 'on' : ''}" data-index="${i}">
                <div class="item-title">${promptList[i].ruleName}</div>
                <div class="item-describe">${promptList[i].intro}</div> 
            </li>
        `;
    };
    let str = `
    <div id="ask">
        <div class="menu">
            <div class="menu-title">模板中心 <span id="add-template">创建自定义模板</span> </div>
            <ul calss="menu-list" id="menuList">
                ${menuList}
            </ul>
        </div>
        <form class="askFrom">
        <!-- <p><span>浓缩内容指令：</span><textarea id="briefContent">请根据上面文章内容，写一个通俗易懂100字左右的前言</textarea></p>
            <p><span>写新文章指令：</span><textarea id="newArticle">请根据以上内容，写一篇文章要求原创度高，通俗易懂，结构清晰，不少于1000字</textarea></p>
            <p><span>生成标题指令：</span><textarea id="newTitle">请根据上面文章生成比较吸引人的标题</textarea></p>
            <div class="divflex"><span>生成标题个数：</span><input id="titleCount" type="number" value="5">
                <p class="wordTypeBox">
                    <span>导出文章类型：</span>
                    <select id="wordType">
                        <option value=".docx">docx</option>
                        <option value=".doc">doc</option>
                    </select>
                </p>
            </div>
            <p><span>上传提问Excel:</span><input id="uploadInput" type="file" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"></p> -->
            <p class="divflex">
                <span>文章列表：(共${gatherList.length}篇)</span> 
                <!-- <span class="select-btn" id="allSelect">全选</span>
                <span class="delete-all-btn" id="allDelete">删除选中</span> -->
            </p>
            <ul id="contentListsDom">
                ${li}
            </ul>
            <div id="btnBOx">
                <span id="closeButton">取消</span>
                <span id="confirm">确定(${currentPrompt.ruleName})</span>
                <span id="askCustom">模板修改文案</span>
            </div>
        </form>
        <p class="title">备注：勾选采集文章后，点击下面“确定”按钮自动提问，回答结束后，点击内容导出，可导出Word文件!</p>
    </div>`;
    // 将按钮插入到页面body结束前  
    $(document.body).append(str);
    $(document.body).append('<div id="mask"></div>');
}

$('body').on('click', '#closeButton', function () {
    $('#ask').remove();
    $('#mask').remove();
});

$('body').on('click', '#menuList .item', function (event) {
    let index = $(this).data('index');
    $(this).siblings('li').removeClass('on');
    $(this).addClass('on');
    currentPrompt = promptList[index];
    $('#confirm').text(`确定(${currentPrompt.ruleName})`);
    event.stopPropagation(); // 阻止
});

$('body').on('click', '.delete-btn', function () {
    let number = $(this).attr('dom-index');
    gatherList.splice(number, 1); // 从数组中删除指定索引处的元素
    chrome.storage.local.set({ 'gather-list': gatherList });
    $(this).parent().remove(); // 删除当前点击的按钮
});
function getCheckboxStatus() {
    let el = $('#contentListsDom').find('input');
    for (let i = 0; i < el.length; i++) {
        const element = el[i];
        // 判断复选框是否被选中
        if (!($(element).is(':checked'))) {
            selectAll = false;
            return;
        }
    }
    selectAll = true;
};
$('body').on('click', '#allDelete', function () {
    let el = $('#contentListsDom').find('input');
    for (let i = 0; i < el.length; i++) {
        const element = el[i];
        if ($(element).is(':checked')) {
            gatherList.splice(i, 1); // 从数组中删除指定索引处的元素
            $(element).parent().remove(); // 删除当前点击的按钮
        }
    }
    chrome.storage.local.set({ 'gather-list': gatherList });
});
// 全选 
$('body').on('click', '#allSelect', function () {
    let el = $('#contentListsDom').find('input');
    for (let i = 0; i < el.length; i++) {
        const element = el[i];
        if (!selectAll) {
            $(element).prop('checked', true);
        } else {
            $(element).prop('checked', false);
        }
    }
    getCheckboxStatus();
});
// 监听复选框变化事件 
$('body').on('change', '#contentListsDom input', function () {
    let $checkbox = $(this);
    let $parentLi = $checkbox.closest('li');
    let $siblingsLi = $parentLi.siblings('li');
    let $otherCheckboxes = $siblingsLi.find('input[type="checkbox"]');
    $otherCheckboxes.prop('checked', false);
    getCheckboxStatus();
});

$('body').on('click', '#confirm', function () {
    // chrome.runtime.sendMessage({ message: 'myMethod' }, function (response) { });
    var checkboxes = document.querySelectorAll('#contentListsDom li input[type="checkbox"]:checked');
    var titles = Array.from(checkboxes).map(function (checkbox) {
        return checkbox.getAttribute('data-title');
    });
    if (titles.length == 0) {
        alert('请选择模板文章！');
        return;
    }
    // 获取选中的内容
    $('#ask').remove();
    $('#mask').remove();
    for (let i = 0; i < gatherList.length; i++) {
        if (gatherList[i].title == titles[0]) {
            content = gatherList[i];
        }
    }
    answerList = []; // 答案列表
    currentPage = 0;


    // 判断主机名是否包含 "chat.openai.com"
    if (hostname.includes('chat.openai.com')) {
        forAsk();
    } else if (hostname.includes('kimi.moonshot.cn')) {
        forAskKimi();
    }
});

// 循环提问 kimi
function forAskKimi() {
    if (!textarea) {
        // 模拟在textarea中输入文本
        textarea = document.getElementById('prompt-textarea');
    }


}


// 循环提问 openai
function forAsk() {
    // 或页面上是否还正在回答 
    var button = document.querySelector('[aria-label="Stop generating"]');
    // 如果没有回答
    if (!button) {
        if (currentPage !== 0) {
            // 使用 document.querySelectorAll 获取所有具有属性 data-testid 的元素
            var elements = document.querySelectorAll('[data-testid]');
            // 筛选出以 "conversation-turn-" 开头的元素，并且从中找到最后一个元素
            var lastElement = null;
            elements.forEach(function (element) {
                var testId = element.getAttribute('data-testid');
                if (testId && testId.startsWith('conversation-turn-')) {
                    lastElement = element;
                }
            });
            // 现在 lastElement 就是匹配到的最后一个元素
            var markdownContent = lastElement.querySelector('.markdown').textContent;
            answerList.push(markdownContent);
        }
        if (currentPage >= currentPrompt.processes.length) {
            return;
        }
        str = currentPrompt.processes[currentPage].express;
        // 使用对应步骤gpt返回的文案
        if (currentPrompt.processes[currentPage].operateType == 2) {
            let numbers = str.match(/\d+/g);
            str = answerList[numbers[0] - 1];
        } else if (currentPrompt.processes[currentPage].operateType == 3) {
            // 3-使用爆文的标题
            str = str.replace(/\${title}/g, content.title);
        } else if (currentPrompt.processes[currentPage].operateType == 4) {
            // 4-使用爆文的正文
            str = str.replace(/\${body}/g, content.content);
        }
        textarea = document.getElementById('prompt-textarea');
        textarea.value = str;
        // 创建并触发 input 事件
        var inputEvent = new Event('input', { bubbles: true });
        textarea.dispatchEvent(inputEvent);
        $('[data-testid="send-button"]').prop('disabled', false);
        $('[data-testid="send-button"]').click();
        ++currentPage;
        setTimeout(() => {
            forAsk();
        }, 1000);
    } else {
        // 还在回答中
        setTimeout(() => {
            forAsk();
        }, 1000);
    }
}

function exportToWord(content) {
    // 创建一个新的 Blob 对象，并指定内容和文件类型
    var blob = new Blob([content], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });

    // 创建一个临时 URL，用于下载 Blob 对象
    var url = window.URL.createObjectURL(blob);

    // 创建一个链接元素
    var link = document.createElement('a');

    // 设置链接的属性
    link.href = url;
    link.download = 'AI爆文.docx'; // 设置下载的文件名

    // 将链接添加到文档中
    document.body.appendChild(link);

    // 模拟点击链接以触发下载
    link.click();

    // 清理临时 URL 和链接元素
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
}


function isTimestampWithinToday(timestamp) {
    var currentDate = new Date(); // 当前日期
    var dateFromTimestamp = new Date(timestamp); // 时间戳转换为日期
    // 比较年、月、日是否相同
    var isSameYear = currentDate.getFullYear() === dateFromTimestamp.getFullYear();
    var isSameMonth = currentDate.getMonth() === dateFromTimestamp.getMonth();
    var isSameDay = currentDate.getDate() === dateFromTimestamp.getDate();
    return isSameYear && isSameMonth && isSameDay;
}

// 点击自定义 
$('body').on('click', '#askCustom', function () {
    custom();
})

// 点击添加自定义 
$('body').on('click', '#add-template', function () {
    addTemplate();
})

$('body').on('click', '#ask .delDtep', function (event) {
    let index = $(this).data('index');
    $(this).parent().remove();
    localityPromptList.splice(index, 1);
    promptList.splice(index, 1);
    chrome.storage.local.set({ 'localityPromptList': localityPromptList });
    let menuList = '';
    currentPrompt = promptList[0];
    for (let i = 0; i < promptList.length; i++) {
        let del = '';
        if (promptList[i].type) {
            del = `<span class="delDtep" data-index="${i}">X</span>`;
        }
        menuList += `<li class="item ${i == 0 ? 'on' : ''}" data-index="${i}">
                <div class="item-title">${promptList[i].ruleName}</div>
                <div class="item-describe">${promptList[i].intro}</div>
                ${del}
            </li>
        `;
    };
    $('#menuList').html(menuList);
    event.stopPropagation(); // 阻止
});

// 获取行为记录
async function setUserActionLog(type, desc) {
    let username = await retrieveData('username') || null;
    $.ajax({
        url: url + "/userActionLog",
        type: "post",
        dataType: 'json', // 期望的响应数据类型
        contentType: 'application/json', // 设置请求的内容类型为 JSON
        data: JSON.stringify({
            "actionDesc": desc,
            "actionType": type,
            "username": username
        })
    });

}