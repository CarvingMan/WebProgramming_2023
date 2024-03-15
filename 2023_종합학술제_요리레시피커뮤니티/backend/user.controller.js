const User = require('./user.model.js');



// 회원등록
exports.create = (req, res) => {
  $socket.emit('join',{         //새로운 회원이 등록되면 소켓을 이용하여 클라이언트에 전달
    userId:req.body.userId,
    name:req.body.name,
    register_date: Date.now // 현재 등록했다는 알림을 위해
  }); 

  const contact = new User({ 
    userId: req.body.userId,
    userPassword: req.body.userPassword,
    name: req.body.name,
    phone_number: req.body.phone_number
  });
  
  //데이터베이스에 새로운 회원정보 저장하기 
  contact.save()
  .then(data => { res.send(data); })
  .catch(err => { 
    res.status(500).send({ message: err.message}); 
  });
};


//모든 회원 검색
exports.findAll = (req, res) => {
  User.find()
  .then( contacts => { 
	res.send(contacts);
	console.log(contacts)	//test log
	  })
  .catch(err => { 
    res.status(50).send({ message: err.message }); 
  });
};

//아이디 찾기
exports.findOne = (req, res) => {
  User.find({phone_number: req.params.phone_number})
  .then( contact => {
    console.log('아이디찾기 요청결과: '+contact)
    if(contact.length === 0){
      res.send({result:false, userId:null}); 
    }
    else{
      console.log(contact.userId)
      res.send({result:true, userId:contact[0].userId}); //연락처에 해당하는 아이디 응답
    }
    
  }).catch(err => { 
    return res.status(500).send({ message: req.params.phone_number +" 로 검색 중 에러 발생" });
  });  
};

//아이디 중복확인
exports.findOverlap = (req, res) => {
  User.find({ userId: req.params.userId })
    .then(contact => {
      console.log("contact : " + contact);
      if (contact.length === 0) {
        res.send({ idAble: true }); // 아이디 사용가능 
      } else {
        res.send({ idAble: false }); // 아이디 사용불가능
      }
    })
    .catch(err => {
      return res.status(501).send({ message: req.params.userId + " 로 검색 중 에러 발생" });
    });
};
//삭제
exports.delete = (req, res) => {
  
  User.findOneAndDelete({userId:req.params.userId})
  .then(contact => {
    if(!contact) {
      return res.status(404).send({ message: req.params.userId +"에 해당하는 장치가 없습니다." })
    }
    $socket.emit('join',{         //새로운 회원이 등록되면 소켓을 이용하여 클라이언트에 전달
      userId:req.body.userId,
      name:req.body.name,
      register_date: Date.now // 현재 등록했다는 알림을 위해
    }); 
    res.send({ message: "정상적으로 " + req.params.userId + " 장치가 삭제되었습니다." })
    
  })
  .catch(err => {
    return res.status(500).send({ message: err.message }); 
  });
};








