const Board = require('./board.model.js');

// 새로운 게시글 등록
exports.create = (req, res) => {
    $socket.emit('boardPost',{         //새로운 게시물 업로드되면 소켓을 이용하여 관리자 페이지에 전달
        userId:req.body.userId,
        title:req.body.title,
        register_date: Date.now // 현재 등록했다는 알림을 위해
    }); 
    const sample = new Board({ 
        userId: req.body.userId,
        title: req.body.title,
        contents: req.body.contents
    });
    console.log("board update")
    //데이터베이스에 새로운 게시물 저장하기 
    sample.save()
    .then(data => { res.send(data); })
    .catch(err => { 
        res.status(500).send({ message: err.message}); 
    });
};


//모든 게시글 검색
exports.findAll = (req, res) => {
  Board.find()
  .then( samples => { 
	res.send(samples);
	//console.log(samples)	//test log
	  })
  .catch(err => { 
    res.status(500).send({ message: err.message }); 
  });
};

//특정한 게시글 검색 -> 게시글 클릭시 자세히 보기위함
exports.findOne = (req, res) => {
    Board.find({userId : req.params.userId, title: req.params.title}) // 같은 유저가 여러글, 혹은 제목이 같은 글이 달릴 수 있으므로 두 개가 모두 일치해야 찾아온다.
  .then( samples => {
    if(!samples){
      return res.status(404).send({
        message: req.params.title + "에 해당하는 게시물이 없습니다." }); 
    }
    res.send(samples);
  }).catch(err => { 
    return res.status(500).send({ message: req.params.userId +req.params.title +" 로 검색 중 에러 발생" });
  });  
};


//업데이트
exports.update = (req, res) => {
  $socket.emit('boardUpdate',{         //새로운 게시물 업로드되면 소켓을 이용하여 관리자 페이지에 전달
  }); 
  console.log(req.body.userId)
  console.log(req.body.title)
  console.log(req.body)
  Board.findOneAndUpdate( {userId:req.params.userId, title:req.params.title, contents:req.params.contents}, 
      { userId: req.body.userId, title:req.body.title, contents:req.body.contents}, 
      {new:true}
  )
  .then(samples => { 
      if(!samples) {
      console.log(samples)
      return res.status(404).send({ message: req.params.title +
          "에 해당하는 장치가 발견되지 않았습니다." })
      }

      res.send(samples);
  }).catch(err => { 
      return res.status(500).send({ message: err.message });
  });
};

//삭제
exports.delete = (req, res) => {
  $socket.emit('boardDelete',{         //새로운 게시물 업로드되면 소켓을 이용하여 관리자 페이지에 전달
}); 
Board.findOneAndDelete({userId:req.params.userId, title: req.params.title, contents: req.params.contents})
.then(samples => {
  if(!samples) {
    return res.status(404).send({ message: req.params.title +"에 해당하는 장치가 없습니다." })
  }
  res.send({ message: "정상적으로 " + req.params.title + " 장치가 삭제되었습니다." })
})
.catch(err => {
  return res.status(500).send({ message: err.message }); 
});
};
