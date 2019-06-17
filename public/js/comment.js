var prepage = 5
var page = 1
var pages = 1
var comArr = []

//渲染评论
$.ajax({
    url: '/api/comment',
    data: {
        contentid: $('#contentId').val()
    },
    success: function (responseData) {
        $('#com_con').val('')
        comArr = responseData.data.reverse()
        renderComment()
    }
})
//提交评论
$('.comment').find('.but').on('click', function () {
    if ($('#com_con').val() == '') {
        return alert('评论内容不允许为空！')
    }
    $.ajax({
        type: 'post',
        url: '/api/comment/post',
        data: {
            contentid: $('#contentId').val(),
            content: $('#com_con').val()
        },
        success: function (responseData) {
            $('#com_con').val('')
            comArr = responseData.data.comments.reverse()
            renderComment()
        }
    })
})

//提交回复
$('.alert_back').find('button').click(function () {
    if ($('.alert_back').find("[name='huifu']").val() == '') {
        return alert('回复内容不允许为空！')
    }
    $.ajax({
        type: 'post',
        url: '/api/comment/back',
        data: {
            contentid: $('#contentId').val(),
            user: $('#comBack').find('span').html(),
            backTime: $('#comBack').find("[name='backTime']").val(),
            content: $('#comBack').find("[name='huifu']").val()
        },
        success: function (backData) {
            $('.alert_back').slideUp('300')
            comArr = backData.data.comments.reverse()
            renderComment()
        }
    })
})

//上下页(事件委托)
$('.page').delegate('#up', 'click', function () {
    page--
    renderComment()
})
$('.page').delegate('#down', 'click', function () {
    page++
    renderComment()
})

function renderComment() {
    var $lis = $('.page li')
    var start = Math.max(0, (page - 1) * prepage)
    var end = Math.min(start + prepage, comArr.length)

    if (page <= 1) {
        page = 1
    }
    if (page >= pages) {
        page = pages
    }
    pages = Math.max(Math.ceil(comArr.length / prepage), 1)
    $lis.eq(1).html(page + '/' + pages)


    var com = ''
    var bac = ''
    if (comArr.length == 0) {
        $('#commentsCon').html('<h5 style="text-align: center;margin-top: 10px;">还没有评论</h5>')
    } else {
        $('#messageCount').html(comArr.length)
        for (var i = start; i < end; i++) {
            //评论回复内容
            for(var j = 0; j < comArr[i].back.length; j ++) {
                bac += 
                `<div class="con bac">
                    <p><em>${comArr[i].back[j].username}</em><span>${formatDate(comArr[i].back[j].time)}</span></p>
                    <p>${comArr[i].back[j].content}</p>
                </div>`
            }
            //评论加回复内容
            com += 
            `<div class="con">
                <p><em>${comArr[i].username}</em>
                <input type="hidden" name="postTime" value="${new Date(comArr[i].postTime).toString().replace('中国标准时间', 'GMT+08:00')}">
                <span>${formatDate(comArr[i].postTime)}</span>
                <a href="javascript:;">回复</a></p>
                <p>${comArr[i].content}</p>
                ${bac}
            </div>`
            bac = ''
            $('#commentsCon').html(com)
        }
    }
}

//鼠标聚焦事件
$('#com_con').focus(function () {
    $(this).css("border-color", "#fa3");
})
$('#com_con').blur(function () {
    $(this).css("border-color", "rgb(169, 169, 169)");
})

//处理时间
function formatDate(d) {
    var date = new Date(d)
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
}

//回复
$('#commentsCon').delegate('a', 'click', function () {
    var $username = $(this).prevAll('em').html()
    var $backTime = $(this).prevAll('input').val()
    $('#comBack').find("[name='backTime']").val($backTime)
    $('.alert_back').slideDown('300').find('span').html($username)
})
//回复页面关闭
$('.alert_back').find('i').click(function() {
    $('.alert_back').slideUp('300')
})
