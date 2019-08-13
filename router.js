var express = require('express');
var User = require('./models/user');     //应用 User 数据模快
var New = require('./models/new');       //应用 New 数据模快
var md5 = require('blueimp-md5');    //引用 blueimp-md5 插件

var router = express.Router();

router.get('/', function(req, res, next) {
  New.find(function(err, data) {
    if(err) {
      return next(err)
    }

    var user = req.session.user;
    res.render('index.html', {
      user: user,
      new_list: data
    })
  })
  
})

router.get('/login', function(req, res) {
  res.render('login.html');
})

router.post('/login', function(req, res, next) {
  User.findOne({
    email: req.body.email,
    password: md5(md5(req.body.password))
  }, function (err, user) {
    if(err) {
      return next(err)
    }

    if(!user) {
      return res.status(200).json({
        err_code: 1,
        message: '邮箱或密码错误！'
      })
    }

    req.session.user = user;

    res.status(200).json({
      err_code: 0,
      message: 'ok'
    })
  })
})


router.get('/register', function(req, res) {
  res.render('register.html');
})

router.post('/register', function(req, res ,next) {
  var body = req.body;

  User.findOne({
    $or: [
      { email: body.email },
      { nickname: body.nickname }
    ]
  }, function(err, data) {
    if(err) {
      return next(err)
    }

    if(data) {
      return res.status(200).json({
        err_code: 1,
        message: '邮箱或用户已存在!'
      })
    }

    body.password = md5(md5(body.password));   //对密码进行加密
    new User(body).save(function(err, user) {
      if(err) {
        return next(err)
      }

      res.status(200).json({
        err_code: 0,
        message: '注册成功!'
      })
    })
  })
})

router.get('/logout', function (req, res) {
  req.session.user = null;

  res.redirect('/');
})

router.get('/topic/show', function(req, res, next) {
  console.log(req.body.id);
  New.findOne({
    _id: req.query.id.replace(/"/g, '')
  }, function(err, data) {
    if(err) {
      return next(err);
    }

    res.render('topic/show.html', {
      new_list: data
    })
  })
})

router.get('/topic/new', function(req, res) {
  res.render('topic/new.html', {
    user: req.session.user
  })
})

router.post('/topic/new', function(req, res, next) {
  var body = req.body;
  body.new_nickname = req.session.user.nickname;
  body.new_header_img = req.session.user.header_img;
  new New(body).save(function(err, newcont) {
    if(err) {
      return next(err);
    }

    res.status(200).json({
      err_code: 1
    })
  })
})

router.get('/settings/profile', function(req, res, next) {

  var id = req.session.user._id.replace(/"/g, '');
  User.findById(id, function(err, user) {
    if(err) {
      return next(err)
    }

    res.render('settings/profile.html', {
      user: user
    })
  })
  
})

router.post('/settings/profile', function(req, res, next) {
  var body = req.body;
  req.session.user.nickname = body.nickname;
  User.findOneAndUpdate(body.email, body, function(err, ok) {
    if(err) {
      return next(err);
    }

    res.status(200).json({
      err_code: 0
    })
  })
})

router.get('/settings/admin', function(req, res) {
  res.render('settings/admin.html')
})

router.post('/settings/admin', function(req, res, next) {
  var body = req.body;
  User.findById(req.session.user._id.replace(/"/g, ''), function(err, user) {
    if(err) {
      return next(err);
    }

    var password = user.password;

    if(md5(md5(body.old_password)) !== password) {
      res.status(200).json({
        err_code: 1
      })
    } else if(body.new_password !== body.neww_password){
      res.status(200).json({
        err_code: 2
      })
    } else {
      User.findByIdAndUpdate(req.session.user._id.replace(/"/g, ''), {
        password: md5(md5(body.new_password))
      }, function(err) {
        if(err) {
          return next(err);
        }

        res.status(200).json({
          err_code: 0
        })
      })
    }
  })
})


router.get('/settings/del', function(req, res, next) {
  User.findByIdAndRemove(req.session.user._id.replace(/"/g, ''), function(err) {
    if(err) {
      return res.status(500).json({
        err_code: 1
      })
    }

    req.session.user = '';
    res.status(200).json({
      err_code: 0
    })
  })
})

module.exports = router;