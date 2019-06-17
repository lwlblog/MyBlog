/**
 * -----入口文件-----
 */

//加载模块
const express = require('express')
const swig = require('swig')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const Cookies = require('cookies')
const app = express()

const User = require('./models/user')

//配置静态资源
app.use('/public', express.static(__dirname + '/public'))
app.use('/node_modules', express.static(__dirname + '/node_modules'))

/**
 * 配置模板引擎
 */

app.engine('html', swig.renderFile)
//设置模板引擎目录
app.set('views', './views')
//注册实用的模板引擎
app.set('view engine', 'html')
//开发模式  取消模板缓存
swig.setDefaults({ cache: false })

//配置body-parser插件
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//设置cookie
app.use(function(req, res, next) {
    req.cookies = new Cookies(req, res)

    //解析用户登录的cookie信息
    req.userInfo = {}
    if(req.cookies.get('userInfo')) {
        try {
            req.userInfo = JSON.parse(req.cookies.get('userInfo'))

            //获取当前登录的类型，是否是管理员
            User.findById(req.userInfo._id).then(function(userInfo) {
                req.userInfo.isAdmin = Boolean(userInfo.isAdmin)
                next()
            })
        }catch(e){
            next()
        }
    }else{
        next()
    }
})

/**
 * 根据功能划分路由模块
 */
app.use('/admin', require('./routers/admin'))
app.use('/api', require('./routers/api'))
app.use('/', require('./routers/main'))


mongoose.connect('mongodb://127.0.0.1:27017/blog', {useMongoClient: true}, function(err) {
    if(err) {
        console.log('数据库连接失败')
    }else{
        console.log('数据库连接成功')
        app.listen(3000, function () {
            console.log('ok...')
        })
    }
})
