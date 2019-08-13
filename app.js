var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');
var router = require('./router');


var app = express();

app.use('/public/', express.static(path.join(__dirname, './public/')));
app.use('/node_modules/', express.static(path.join(__dirname, './node_modules')));

//应用 express 模板引擎
app.engine('html', require('express-art-template'));
app.set('views', path.join(__dirname, './views'))

//引用 body-parser 插件，处理 post 请求
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(session({
  // secret 配置加密字符串，它会在原有加密基础之上和这个字符串拼起来去加密
  // 目的是为了增加安全性，防止客户端恶意伪造
  secret: 'itcast',
  resave: false,
  saveUninitialized: false // 无论你是否使用 Session ，我都默认直接给你分配一把钥匙
}))

app.use(router);


//全局处理 404
app.use(function(req, res) {
  res.render('404.html');
})

//全局处理  500  错误
app.use(function(err, req, res, next) {
  res.status(500).json({
    err_code: 500,
    message: err.message
  })
})

app.listen(3000, function() {
  console.log('running =>···>···>')
})