var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost:27017/itcast');

var userSchema = Schema({
  email: {
    type: String,
    required: true
  },
  nickname: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  created_time: {  //账号创建时间
    type: Date,
    default: Date.now
  },
  made_time: {
    type: Date,
    default: Date.now
  },
  header_img: {
    type: String,
    default: '/public/img/avatar-default.png'
  },
  bio: {            //个人简介
    type: String,
    default: ''
  },
  gender: {
    type: Number,
    enum: [-1, 0, 1],
    default: -1 
  },
  birthday_time: {
    type: String
  },
  status: {
    //权限设置
    //0 无权限设置  1 不允许评论 2 不用需登录
    type: Number,
    enum: [0, 1, 2],
    default: 0
  } 
})

module.exports = mongoose.model('User', userSchema);