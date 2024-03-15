module.exports = (app) => {
    const users = require('./user.controller.js');  //user.controller.js를 로딩
    const boards = require('./board.controller.js');  //board.controller.js를 로딩
    const axios = require('axios');

    const authenticateUser = (req, res, next) => {
      console.log(req.isAuthenticated());
      if (req.isAuthenticated()) {
          console.log('인증 성공');
          next();
      } else {
          console.log('인증 실패');
          res.send({code:2});
      }
  };
    app.get('/users',authenticateUser, users.findAll);             //모든 회원정보 검색
    app.get('/users/:phone_number', users.findOne);  // 아이디 찾기
    app.get('/join/:userId', users.findOverlap);  // 아이디 중복확인
    app.post('/users', users.create);             //새로운 회원 추가
    app.delete('/users/:userId',authenticateUser, users.delete); //특정 아이디 삭제/관리자가
    app.get('/boards',authenticateUser, boards.findAll);             //모든 게시물 검색
    app.get('/boards/:userId/:title',  boards.findOne ); //특정 게시글 검색
    app.post('/boards',authenticateUser, boards.create);  //게시글 등록
    app.put('/boards/:userId/:title/:contents',authenticateUser, boards.update);   // 게시글 수정
    app.delete('/boards/:userId/:title/:contents',authenticateUser, boards.delete); //특정 게시글 삭제
    

    app.get('/api/naver-search', async (req, res) => { // naverapi는 cors를 보안상 차단하기에 프론트엔드에서 프록시 해주어야 하지만 npm run build하면 오류가 생긴다.
      try {                                           // 따라서 서버에서 직접 axis 요청을 하여 cors문제를 방지
          const { query } = req.query;
          const response = await axios.get(`https://openapi.naver.com/v1/search/shop.json?query=${encodeURIComponent(query)}&display=3`, {
              headers: {
                  'X-Naver-Client-Id': 'uc23LP0UWNTQ7hJ3rHlV',
                  'X-Naver-Client-Secret': 'Ak7kBYp_pF',
              },
          });

          res.json(response.data);
      } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal Server Error' });
      }
  });

  app.post('/sendMSG',(req,res)=>{
    $socket.emit('sendMessage',{ 
        message: req.body.message
    }); 
  });
}
