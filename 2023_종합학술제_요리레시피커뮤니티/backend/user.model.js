const mongoose = require('mongoose');

var UserSchema = mongoose.Schema({   //스키마(Schema) 설정
  userId: {type: String, require:true},
  userPassword: {type: String, require:true},
  name: { type: String, require: true},
  phone_number: { type: String, require: true}, //NUmber로 하면 010으로 저장하면 db에서 10으로 저장된다. 따라서 String으로 해야한다.
  register_date: { type: Date, default:Date.now}
});

module.exports = mongoose.model('User', UserSchema); //소문자화 후 복수형으로 바꾸어 devices 컬렉션이 됨
