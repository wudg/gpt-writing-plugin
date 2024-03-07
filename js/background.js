async function sendFetchRequest(url, data = null) {
    const options = {
        method: data ? 'POST' : 'GET',
        ode: 'no-cors',
        headers: {
            'Content-Type': 'application/json',
        },
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json(); // 如果你期望JSON响应
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}


var askId = null;
// 在 background.js 中
chrome.runtime.onMessage.addListener(
    async function (request, sender, sendResponse) {
        if (request.message === "openAsk") {
            openAsk();
            return true;
        }
        if (request.message === "closeAsk") {
            closeAsk();
            return true;
        }
        if (request.message === "checkLogin") {
            let token = await retrieveData('token');
            let data = await checkLogin(token);
            sendResponse({ message: data });
            return true;
        }
        return true;
    }
);
// 打开Ask窗口
function openAsk() {
    closeAsk();
    chrome.windows.create({
        url: 'ask.html', // 要打开的新窗口的HTML文件路径
        type: 'popup', // 或者 'normal'，'popup' 类型会以小窗口的形式打开
        width: 800, // 窗口宽度
        height: 800 // 窗口高度
    }, function (window) {
        // 可选的回调函数，当窗口创建完成时执行
        askId = window.id;
        // 监听窗口关闭事件
        chrome.windows.onRemoved.addListener(function (closedWindowId) {
            if (closedWindowId === askId) {
                askId = null;
            }
        });
        
        chrome.tabs.executeScript(window.tabs[0].id, { file: "content.js" }, function () {
            chrome.tabs.sendMessage(window.tabs[0].id, { method: "myMethod" }, function (response) {
                // 处理来自 content script 的响应
                console.log(response);
            });
        });


    });
};
// 关闭Ask窗口
function closeAsk() {
    if (askId) {
        chrome.windows.remove(askId, function () {
            askId = null;
        });
    }
};
// 校验登录
function checkLogin(token) {
    // 使用示例 
    return sendFetchRequest('http://frp.wudiguang.top/user/isLogin?token=' + token).then(data => {
        return data.data;
    }).catch(error => {
        return false;
    });
}


function getData(key) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(key, (result) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(result[key] || []);
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
