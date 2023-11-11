const mongoose = require('mongoose');

var LocationSchema = mongoose.Schema({   //스키마(Schema) 설정
  Id: {type: Number, require:true},
  lat: { type: Number, require: true},
  lng: { type: Number, require: true},
  register_date: { type: Date, default:Date.now}
});

module.exports = mongoose.model('Location', LocationSchema); //소문자화 후 복수형으로 바꾸어 contacts 컬렉션이 됨
