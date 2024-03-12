// content.js
var href = '';
var hostname = '';
var token = null;
var gatherList = []; // 采集的数据列表

var loding = false;
var selectAll = false;
var textarea = null; // textarea 输入框元素
var currentPage = -1; // 当前回答的问题 
(function () {
    // 获取textarea元素
    textarea = document.getElementById('prompt-textarea');

    // 创建页面中的按钮组
    var div = document.createElement('div');
    div.style.position = 'fixed';
    div.style.top = '50%';
    div.style.transform = 'translateY(-50%)';
    div.style.right = '20px';
    div.id = 'gatherDiv';
    // 将按钮插入到页面body结束前
    document.body.appendChild(div);

    // 获取主机名（不包括协议和端口）
    hostname = window.location.hostname;
    href = window.location.href;

    // 获取所有本地存储的内容
    getRrticleAll();
    chrome.storage.local.get(['token'], function (items) {
        token = items['token'] || null;
    });
    // 判断主机名是否包含 "chat.openai.com"
    if (hostname.includes('chat.openai.com')) {
        // console.log('当前域名包含 chat.openai.com');
        // 批量提问
        questionBtn();
        // 内容导出
        exportBtn();
    } else {
        // ('当前域名不包含 chat.openai.com');
        // 创建文字采集按钮元素
        gatherBtn();
    }
})();
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
    // 判断主机名是否包含 "chat.openai.com"
    if (href.includes('toutiao.com/article')) {
        let obj = await toutiaoArticle();
        if (!obj) {
            return;
        }
        gatherList.push(obj);
        chrome.storage.local.set({ 'gather-list': gatherList }, function () {
            alert('已选择文章，可以选择下一个了');
        });
    }
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
// 校验token
async function checkToken() {
    // loding = true;
    // token = await retrieveData('token');
    // if (!token) {
    //     alert('当前没有登录，或登录失效，请重新登录');
    //     loding = false;
    //     return false;
    // }
    let status = true;
    // $.ajax({
    //     url: "http://frp.wudiguang.top/user/isLogin?token=" + token,
    //     type: "get",
    //     dataType: 'json',
    //     async: false, // 将 async 设置为 false
    //     xhrFields: {
    //         withCredentials: true
    //     },
    //     success: function (res) {
    //         status = res.data;
    //         if (!status) {
    //             alert('当前没有登录，或登录失效，请重新登录');
    //             chrome.storage.local.set({ 'token': null });
    //         }
    //     }
    // });
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
    let el = $('#ask');
    if (el.length) {
        // ID 存在
    } else {
        // ID 不存在
        createEL();
    }

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
    if (loding) { return; };
    if (!await checkToken()) {
        return;
    }
    alert('内容导出按钮被点击了！' + JSON.stringify(event));
}

// 与background通信
function sendMessage(type) {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ message: type }, function (response) {
        });
    });
};
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
function myMethod(key) {
    alert(111);
};

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    console.log('收到来自 background.js 的消息：', message);
    // 在这里可以处理来自 background.js 的消息 
    if (message.method === "myMethod") {
        console.log('myMethod')
        // 执行你的方法
        // sendResponse({ result: "Method executed" });
        myMethod();
    }
});

function createEL() {

    let li = '';
    for (let i = 0; i < gatherList.length; i++) {
        li += `<li>
            <input type="checkbox" name="content" value="${i}">
            <a style="text-decoration: none; color:#333" target="_blank" title="${gatherList[i].title}" href="${gatherList[i].url}">${gatherList[i].title}</a>
            <span class="delete-btn" dom-index="${i}">删除</span>
        </li>`;
    };
    let str = `
    <div id="ask">
        <p class="title">备注：请上传提问模板或勾选采集文章，点击下面“确定”按钮自动提问，回答结束后会自动导出所有回答内容的Word文件!</p>
        <form>
            <p><span>浓缩内容指令：</span><textarea id="briefContent">请根据上面文章内容，写一个通俗易懂100字左右的前言</textarea></p>
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
            <!-- <p><span>上传提问Excel:</span><input id="uploadInput" type="file" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"></p> -->
            <p class="divflex"><span>选择文章列表：(共${gatherList.length}篇)</span>
                <lebel id="countNum"></lebel>
                <span class="select-btn" id="allSelect">全选</span>
                <span class="delete-all-btn" id="allDelete">删除选中</span>
            </p>
            <ul id="contentListsDom">
                ${li}
            </ul>
            <p></p>
        </form>
        <div id="btnBOx"><span id="closeButton">取消</span> <span id="confirm">确定</span></div>
    </div>`;
    // 将按钮插入到页面body结束前  
    $(document.body).append(str);
    $(document.body).append('<div id="mask"></div>');
}

$('body').on('click', '#closeButton', function () {
    $('#ask').remove();
    $('#mask').remove();
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
    getCheckboxStatus();
});


// 点击确认 
$('body').on('click', '#confirm', function () {
    // chrome.runtime.sendMessage({ message: 'myMethod' }, function (response) { });
    // 获取选中的内容
    $('#ask').remove();
    $('#mask').remove();
    forAsk();
});

// 循环提问 openai
function forAsk() {
    if (!textarea) {
        // 模拟在textarea中输入文本
        textarea = document.getElementById('prompt-textarea');
    }
    let contentList = [
        '帮我写一份500字的自我介绍',
        `帮我写一篇 吹灭别人的灯，并不会让自己更加光明；阻挡别人的路，也不会让自己行得更远。“一花独放不是春，百花齐放春满园。”如果世界上只有一种花朵，就算这种花朵再美，那也是单调的。
        以上两则材料出自习近平总书记的讲话，以生动形象的语言说出了普遍的道理。请据此写一篇文章，体现你的认识与思考。
        要求：选准角度，确定立意，明确文体，自拟标题；不要套作，不得抄袭；不得泄露个人信息；不少于800字。`
    ]
    // 或页面上是否还正在回答 
    var button = document.querySelector('[aria-label="Stop generating"]');
    console.log(button);
    // 如果没有回答
    if (!button) {
        // 如果currentPage大于-1 说明回答过一次 需要获取回答的内容
        if (currentPage > -1) {
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
            console.log(markdownContent);
        }

        currentPage++;
        if(currentPage > contentList.length - 1) {
            return;
        }
        textarea.value = contentList[currentPage];
        // 创建并触发 input 事件
        var inputEvent = new Event('input', { bubbles: true });
        textarea.dispatchEvent(inputEvent);
        $('[data-testid="send-button"]').prop('disabled', false);
        $('[data-testid="send-button"]').click();
        setTimeout(() => {
            forAsk();
        }, 1000);
    } else {
        console.log(button);
        // 还在回答中
        setTimeout(() => {
            forAsk();
        }, 1000);
    }

}
