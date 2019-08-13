var mongoose = require('mongoose');

var Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost:27017/itcast');

var newSchema = new Schema({
  new_nickname: {
    type: String,
    required: true
  },
  new_header_img: {
    type: String,
    default: '/public/img/avatar-default.png'
  },
  new_plate: {
    type: String,
    requierd: true
  },
  new_title: {
    type: String,
    required: true
  },
  new_content: {
    type: String,
    required: true
  },
  new_time: {
    type: Date,
    default: Date.now
  },
  comment_person_nickname: {
    type: String
  },
  love_num: {
    type: Number,
    default: 0
  },
  comment_person_num: {
    type: Number,
    default: 0
  },
  browse_num: {
    type: Number,
    default: 0
  }
})

module.exports = mongoose.model('New', newSchema);