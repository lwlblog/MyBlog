# My blog
## 基于nodejs mongodb数据库开发的小型个人博客系统
## 使用方法
1. 安装 `npm install`
2. 打开mongodb数据库
3. 程序自动创建blog数据库，如果连接成功则开启本地服务器，端口号3000
4. 注册账号默认都是非管理员，如果需要操作后台则需要在数据库手动添加一个管理员账号，格式为如下
```javascript
{
  "username" : "admin",
  "password" : "admin",
  "isAdmin" : true,
}
5. 前端展示的分类，内容等信息需要在后台管理进行添加数据，前端分类部分是flex布局固定定位自适应