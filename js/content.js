// content.js
var href = '';
var hostname = '';
var token = null;
var gatherList = []; // 采集的数据列表

var loding = false;

(function () {
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
    questionBtn();
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
    loding = true;
    token = await retrieveData('token');
    if (!token) {
        alert('当前没有登录，或登录失效，请重新登录');
        loding = false;
        return false;
    }
    let status = false;
    $.ajax({
        url: "http://frp.wudiguang.top/user/isLogin?token=" + token,
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
            }
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
    sendMessage("openAsk");
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
            console.log('response: ' + JSON.stringify(response));
            resolve(response.message);
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

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.method === "myMethod") {
        // 执行你的方法
        sendResponse({ result: "Method executed" });
        myMethod(); 
    }
});