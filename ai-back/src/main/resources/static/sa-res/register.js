// sa 
var sa = {};

// 打开loading
sa.loading = function(msg) {
	layer.closeAll();	// 开始前先把所有弹窗关了
	return layer.msg(msg, {icon: 16, shade: 0.3, time: 1000 * 20, skin: 'ajax-layer-load' });
};

// 隐藏loading
sa.hideLoading = function() {
	layer.closeAll();
};


// ----------------------------------- 登录事件 -----------------------------------

$('.register-btn').click(function(){
	sa.loading("正在注册...");
	// 开始注册
	setTimeout(function() {
		$.ajax({
			url: "user/doRegister",
			type: "post", 
			data: {
				username: $('[name=name]').val(),
				password: $('[name=pwd]').val(),
				registerCode: $('[name=registerCode]').val()
			},
			dataType: 'json',
			success: function(res){
				console.log('返回数据：', res);
				sa.hideLoading();
				if(res.code == 200) {
					layer.msg('注册成功', {anim: 0, icon: 6 });
					window.location.href = "login"; // 请替换为你想要跳转的链接
					// setTimeout(function() {
					// 	location.reload();
					// }, 800)
				} else {
					layer.msg(res.msg, {anim: 6, icon: 2 }); 
				}
			},
			error: function(xhr, type, errorThrown){
				sa.hideLoading();
				if(xhr.status == 0){
					return layer.alert('无法连接到服务器，请检查网络');
				}
				return layer.alert("异常：" + JSON.stringify(xhr));
			}
		});
	}, 400);
});

// 绑定回车事件
$('[name=name],[name=pwd]').bind('keypress', function(event){
	if(event.keyCode == "13") {
		$('.register-btn').click();
	}
});

// 输入框获取焦点
$("[name=name]").focus();

// 打印信息 
var str = "This page is provided by Sa-Token, Please refer to: " + "https://sa-token.cc/";
console.log(str);
