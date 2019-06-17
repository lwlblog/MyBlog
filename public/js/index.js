$(function () {
    var $loginBox = $('#login')
    var $registerBox = $('#register')
    var $userInfo = $('#info')

    //切换到注册面板
    $loginBox.find('a.colMint').on('click', function () {
        $loginBox.hide()
        $registerBox.show()
    })

    //切换到登陆面板
    $registerBox.find('a.colMint').on('click', function () {
        $loginBox.show()
        $registerBox.hide()
    })

    //注册
    $registerBox.find("input[type='submit']").on('click', function (event) {
        //阻止form表单默认提交行为
        event.preventDefault();
        $.ajax({
            type: 'post',
            url: '/api/user/register',
            data: {
                username: $registerBox.find("[name='username']").val(),
                password: $registerBox.find("[name='password']").val(),
                repassword: $registerBox.find("[name='repassword']").val()
            },
            dataType: 'json',
            success: function (result) {
                $registerBox.find('.tips').html(result.message)
                if (!result.code) {
                    //注册成功
                    setTimeout(function () {
                        $loginBox.show()
                        $registerBox.hide()
                    }, 1000)
                }
            }
        })
    })

    //登陆
    $loginBox.find("input[type='submit']").on('click', function (event) {
        //阻止form表单默认提交行为
        event.preventDefault();
        $.ajax({
            type: 'post',
            url: '/api/user/login',
            data: {
                username: $loginBox.find("[name='username']").val(),
                password: $loginBox.find("[name='password']").val()
            },
            dataType: 'json',
            success: function (result) {
                $loginBox.find('.tips').html(result.message)
                if (!result.code) {
                    //登录成功

                    //重载页面
                    window.location.reload()
                }
            }
        })
    })

    //退出
    $('#logout').on('click', function () {
        $.ajax({
            url: '/api/user/logout',
            success: function (result) {
                if (!result.code) {
                    window.location.reload()
                }
            }
        })
    })

    //鼠标聚焦事件
    $('.login').delegate('input' ,'focus', function() {
        $(this).css("border-color", "#fa3");
    })
    $('.login').delegate('input' ,'blur', function() {
        $(this).css("border-color", "#ccc");
    })

    //时间
    var date = new Date()
        var html = `${date.getHours().toString().padStart(2, '0')}<span>:</span>
        ${date.getMinutes().toString().padStart(2, '0')}<span>:</span>
        ${date.getSeconds().toString().padStart(2, '0')}`
        $('#time').html(html)
    setInterval(function() {
        var date = new Date()
        var html = `${date.getHours().toString().padStart(2, '0')}<span>:</span>
        ${date.getMinutes().toString().padStart(2, '0')}<span>:</span>
        ${date.getSeconds().toString().padStart(2, '0')}`
        $('#time').html(html)
    },1000)
})