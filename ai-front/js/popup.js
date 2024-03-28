var token = null;
// var url = "http://frp.wudiguang.top"; // 参数环境
var url = "https://aiwrite.wudiguang.top"; // 正式环境

$('.login-btn').click(function () {
    $('.login-btn-p .error').text('');
    let username = $('.login-name [name=name]').val();
    let password = $('.login-pwd [name=pwd]').val();
    if (!username) {
        $('.login-name .error').text('请输入账号');
    } else {
        $('.login-name .error').text('');
    }
    if (!password) {
        $('.login-pwd .error').text('请输入密码');
    } else {
        $('.login-pwd .error').text('');
    }
    if (!username || !password) {
        return;
    }
    // 开始登录 
    $.ajax({
        url: url + "/user/doLogin",
        type: "post",
        data: {
            username: username,
            password: password
        },
        dataType: 'json',
        xhrFields: {
            withCredentials: true // 允许跨域请求携带凭据
        },
        crossDomain: true, // 标记为跨域请求（如果是跨域的话）
        success: function (res) {
            if (res.code == 200) {
                $('.login').hide();
                $('.info').show();
                userInfo(username);
                chrome.storage.local.set({ 'token': res.data });
                chrome.storage.local.set({ 'login-time': new Date().getTime() });
                chrome.storage.local.set({ 'username': username });

            } else {
                $('.login-btn-p .error').text(res.msg);
            }
        },
        error: function (xhr, type, errorThrown) {
            if (xhr.status == 0) {
                $('.login-btn-p .error').text('无法连接到服务器，请检查网络');
            }
            $('.login-btn-p .error').text("异常：" + JSON.stringify(xhr));
        }
    });
});
$('.toRegister').click(function () {
    $('.login').hide();
    $('.register').show();
});
$('.toLogin').click(function () {
    $('.register').hide();
    $('.login').show();
});

$('.register-btn').click(function () {
    $('.register-btn-p .error').text('');
    let username = $('.register-name [name=name]').val();
    let password = $('.register-pwd [name=pwd]').val();
    let registerCode = $('.register-code [name=registerCode]').val();
    let wechatAccount = $('.wechat_account [name=wechatAccount]').val();

    if (!username) {
        $('.register-name .error').text('请输入用户名');
    } else {
        $('.register-name .error').text('');
    }
    if (!password) {
        $('.register-pwd .error').text('请输入密码');
    } else {
        $('.register-pwd .error').text('');
    }
    if (!registerCode) {
        $('.register-code .error').text('请输入注册码');
    } else {
        $('.register-code .error').text('');
    }
    if (!wechatAccount) {
        $('.wechat_account .error').text('请输入微信号');
    } else {
        $('.wechat_account .error').text('');
    }

    if (!username || !password || !registerCode || !wechatAccount) {
        return;
    }
    // 开始注册 
    $.ajax({
        url: url + "/user/doRegister",
        type: "post",
        data: {
            username: username,
            password: password,
            registerCode: registerCode,
            wechatAccount: wechatAccount,
        },
        dataType: 'json',
        success: function (res) {
            if (res.code == 200) {
                $('.register').hide();
                $('.login').show();
            } else {
                $('.register-btn-p .error').text(res.msg);
            }
        },
        error: function (xhr, type, errorThrown) {
            if (xhr.status == 0) {
                $('.register-btn-p .error').text('无法连接到服务器，请检查网络');
            }
            $('.register-btn-p .error').text("异常：" + JSON.stringify(xhr));
        }
    });
});
(function () {
    $('.login').hide();
    $('.info').hide();
    chrome.storage.local.get(['token'], async function (items) {
        token = items['token'] || null;
        let loginTime = await retrieveData('login-time') || null;
        let username = await retrieveData('username') || null;
        if (loginTime && isTimestampWithinToday(loginTime)) {
            userInfo(username);
            return;
        }
        $.ajax({
            url: url + "/user/isLogin?token=" + token,
            type: "get",
            dataType: 'json',
            async: false, // 将 async 设置为 false
            xhrFields: {
                withCredentials: true
            },
            success: function (res) {
                let status = res.data;
                if (!status) {
                    chrome.storage.local.set({ 'token': null });
                    token = null;
                }
                if (token) {
                    chrome.storage.local.set({ 'login-time': new Date().getTime() });
                    userInfo(username);
                } else {
                    $('.login').show();
                }
            }
        });

    });
})();
function userInfo(username) {
    $.ajax({
        url: url + "/user/userInfo?username=" + username,
        type: "get",
        dataType: 'json',
        success: function (res) {
            let data = res.data;
            $('.info h2').text(data.name);
            $('.info #boxWord').text(data.remark);
            $('.info #registerTime').text('注册时间：' + data.registerTime);
            $('.info #endTime').text('到期时间：' + data.deadline);
            
            chrome.storage.local.set({ 'user-info': data });
        }
    });
    $('.info').show();
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

function isTimestampWithinToday(timestamp) {
    var currentDate = new Date(); // 当前日期
    var dateFromTimestamp = new Date(timestamp); // 时间戳转换为日期
    // 比较年、月、日是否相同
    var isSameYear = currentDate.getFullYear() === dateFromTimestamp.getFullYear();
    var isSameMonth = currentDate.getMonth() === dateFromTimestamp.getMonth();
    var isSameDay = currentDate.getDate() === dateFromTimestamp.getDate();
    return isSameYear && isSameMonth && isSameDay;
}