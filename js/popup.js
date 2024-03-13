var token = null;

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
        url: "http://aiwrite.wudiguang.top/user/doLogin",
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
                chrome.storage.local.set({ 'token': res.data });

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

    if (!username || !password || !registerCode) {
        return;
    }
    // 开始注册 
    $.ajax({
        url: "http://aiwrite.wudiguang.top/user/doRegister",
        type: "post",
        data: {
            username: username,
            password: password,
            registerCode: registerCode
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
    chrome.storage.local.get(['token'], function (items) {
        token = items['token'] || null;
        $.ajax({
            url: "http://aiwrite.wudiguang.top/user/isLogin?token=" + token,
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
                    $('.info').show();
                } else {
                    $('.login').show();
                }
            }
        });

    });
})();