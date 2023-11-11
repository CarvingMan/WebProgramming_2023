const Location = require('./location.model.js');

// 새로운 좌표 만들기
exports.create = (req, res) => {
  const location = new Location({ 
    Id: req.body.Id,
    lat: req.body.lat,
    lng: req.body.lng
  });
  
  //데이터베이스에 새로운 좌표 저장하기 
  location.save()
  .then(data => { res.send(data); })
  .catch(err => { 
    res.status(500).send({ message: err.message}); 
  });
};


//모든 좌표 검색
exports.findAll = (req, res) => {
  Location.find()
  .then( locations => { 
	res.send(locations);
	console.log(locations)	//test log
	  })
  .catch(err => { 
    res.status(500).send({ message: err.message }); 
  });
};

//특정한 좌표 검색
exports.findOne = (req, res) => {
  Location.findOne({Id : req.Id})
  .then( location => {
    if(!location){
      return res.status(404).send({
        message: req.params.Id + "에 해당하는 연락처가 없습니다." }); 
    }
    res.send(location);
  }).catch(err => { 
    return res.status(500).send({ message: req.params.Id +" 로 검색 중 에러 발생" });
  });  
};

//업데이트
exports.update = (req, res) => { 
  Location.findOneAndUpdate( {Id:req.params.Id}, 
    { Id: req.body.Id, lat:req.body.lat, lng:req.body.lng }, 
    {new:true}
  )
  .then(location => { 
    if(!location) {
      return res.status(404).send({ message: req.params.Id +
        "에 해당하는 연락처(contact) 발견되지 않았습니다." })
    }
    res.send(location);
  }).catch(err => { 
    return res.status(500).send({ message: err.message });
  });
};

//삭제
exports.delete = (req, res) => {
  Location.findOneAndDelete({Id:req.params.Id})
  .then(location => {
    if(!location) {
      return res.status(404).send({ message: req.params.Id +"에 해당하는 연락처(contact)가 없습니다." })
    }
    res.send({ message: "정상적으로 " + req.params.Id + " 연락처가 삭제되었습니다." })
  })
  .catch(err => {
    return res.status(500).send({ message: err.message }); 
  });
};








