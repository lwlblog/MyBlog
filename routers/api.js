const express = require('express')
const User = require('../models/user')
const Content = require('../models/Content')
const router = express.Router()

//统一返回格式
var responseData;

router.use(function(req, res, next) {
    responseData = {
        code: 0,
        message: ''
    }
    next()
})

/**
 * 用户注册
 *   1.用户名不能为空
 *   2.密码不能为空
 *   3.两次输入必须一致
 * 用户是否被注册
 *   数据库查询
 */
router.post('/user/register', function(req, res, next) {
    var username = req.body.username
    var password = req.body.password
    var repassword = req.body.repassword

    //用户是否为空
    if(username == '') {
        responseData.code = 1
        responseData.message = '用户名不能为空'
        res.json(responseData)
        return
    }

    //密码不能为空
    if(password == '') {
        responseData.code = 2
        responseData.message = '密码不能为空'
        res.json(responseData)
        return
    }

    //两次输入密码不一致
    if(password != repassword) {
        responseData.code = 3
        responseData.message = '两次输入密码不一致'
        res.json(responseData)
        return
    }

    //用户名是否被注册
    User.findOne({
        username: username
    }).then(function(userInfo) {
        if(userInfo) {
            responseData.code = 4
            responseData.message = '用户名已被注册'
            res.json(responseData)
            return
        }
        //保存用户注册信息到数据库
        var user = new User({
            username: username,
            password: password
        })
        return user.save()
    }).then(function(newUserInfo) {
        responseData.message = '注册成功'
        res.json(responseData)
    })

})

/**
 * 登录
 */
router.post('/user/login', function(req, res) {
    var username = req.body.username
    var password = req.body.password

    if(username == '' || password == '') {
        responseData.code = 1
        responseData.message = '用户名和密码不能为空'
        res.json(responseData)
        return
    }

    //查询数据库用户名和密码是否存在
    User.findOne({
        username: username,
        password: password
    }).then(function(userInfo) {
        if(!userInfo) {
            responseData.code = 2
            responseData.message = '用户名或密码错误'
            res.json(responseData)
            return
        }
        //用户名和密码正确
        responseData.message = '登陆成功'
        responseData.userInfo = {
            _id: userInfo.id,
            username: userInfo.username
        }
        //发送一个cookie信息
        req.cookies.set('userInfo', JSON.stringify({
            _id: userInfo.id,
            username: userInfo.username
        }))
        res.json(responseData)
        return
    })
})


/**
 * 退出
 */
router.get('/user/logout', function(req, res) {
    req.cookies.set('userInfo', null)
    res.json(responseData)
})

/**
 * 渲染评论
 */
router.get('/comment', function(req, res) {
    var contentId = req.query.contentid || ''

    Content.findOne({
        _id: contentId
    }).then(function(content) {
        responseData.data = content.comments
        res.json(responseData)
    })
})

/**
 * 评论提交
 */
router.post('/comment/post', function(req, res) {
    //内容的id
    var contentId = req.body.contentid || ''
    var postData = {
        username: req.userInfo.username,
        postTime: new Date(),
        content: req.body.content,
        back: []
    }

    //查询当前这篇文章的信息
    Content.findOne({
        _id: contentId
    }).then(function(content) {
        content.comments.push(postData)
        return content.save()
    }).then(function(newContent) {
        responseData.message = '评论成功'
        responseData.data = newContent
        res.json(responseData)
    })
})

/**
 * 回复
 */
router.post('/comment/back', function(req, res) {
    //内容的id
    var contentId = req.body.contentid || ''
    var user = req.body.user || ''
    var comTime = req.body.backTime || ''
    var backData = {
        user: user,
        username: req.userInfo.username,
        time: new Date(),
        content: req.body.content
    }

    var cont = {}

    //查询当前这篇文章的信息
    Content.findOne({
        _id: contentId
    }).then(function(content) {
        content.comments.forEach(element => {
            if(element.postTime.toString() == comTime && element.username == user) {
                element.back.push(backData)
            }
        })
        cont = content
        return Content.update({
            _id: contentId
        },content)
        // return content.save()
    }).then(function() {
        responseData.message = '回复成功'
        responseData.data = cont
        res.json(responseData)
    })
})


module.exports = router