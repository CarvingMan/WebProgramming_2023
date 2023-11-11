module.exports = (app) => {
  const locations = require('./location.controller.js');  //contact.controller.js를 로딩
  app.get('/locations', locations.findAll);             //모든 연락처 검색
  app.get('/locations/:Id', locations.findOne);  //특정 연락처 검색
  app.post('/locations',locations.create);             //새로운 연락처 추가
  app.put('/locations/:Id', locations.update);   //특정 연락처 업데이트
  app.delete('/locations/:Id', locations.delete); //특정 연락처 삭제
}
