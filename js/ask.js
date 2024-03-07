var gatherArr = [];
var selectAll = false;
$('#closeButton').click(function () {
    chrome.runtime.sendMessage({ message: 'closeAsk' }, function (response) {
        // console.log('Response from background:', response);
    });
});

(function () {
    getarticle();
})();
// 获取收集的文章
function getarticle() {
    chrome.storage.local.get(['gather-list'], function (items) {
        gatherArr = items['gather-list'] || [];
        rendering();
    });
};
// 渲染采集数据
function rendering() {
    let str = '';
    for (let i = 0; i < gatherArr.length; i++) {
        str += `<li>
            <input type="checkbox" name="content" value="${i}">
            <a style="text-decoration: none;" target="_blank" title="${gatherArr[i].title}" href="${gatherArr[i].url}">${gatherArr[i].title}</a>
            <span class="delete-btn" dom-index="${i}">删除</span>
        </li>`;
    };
    $('#contentListsDom').html(str);
};

$('#contentListsDom').on('click', '.delete-btn', function () {
    let number = $(this).attr('dom-index');
    gatherArr.splice(number, 1); // 从数组中删除指定索引处的元素
    chrome.storage.local.set({ 'gather-list': gatherArr });
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

// 删除选中
$('#allDelete').on('click', function () {
    let el = $('#contentListsDom').find('input');
    for (let i = 0; i < el.length; i++) {
        const element = el[i];
        if ($(element).is(':checked')) {
            gatherArr.splice(i, 1); // 从数组中删除指定索引处的元素
            $(element).parent().remove(); // 删除当前点击的按钮
        }
    }
    chrome.storage.local.set({ 'gather-list': gatherArr });
});

// 全选
$('#allSelect').on('click', function () {
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
$('#contentListsDom').on('change', 'input', function () {
    getCheckboxStatus();
});