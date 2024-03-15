const mongoose = require('mongoose');

var BoardSchema = mongoose.Schema({   //스키마(Schema) 설정
  userId: {type: String, require:true},
  title: { type: String, require: true},
  contents: { type: String, require: true},
  register_date: { type: Date, default:Date.now}
});

module.exports = mongoose.model('Board', BoardSchema); //소문자화 후 복수형으로 바꾸어 devices 컬렉션이 됨