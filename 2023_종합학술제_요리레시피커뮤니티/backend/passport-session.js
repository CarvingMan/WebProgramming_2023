const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const cookieParser = require('cookie-parser');
const session = require('express-session');
//const mongoose = require('mongoose');
const User = require('./user.model.js');
// const bcrypt = require('bcrypt');

module.exports = (app) => {
    app.use(cookieParser('passportExample'));
    app.use(session({
        resave: false,              // 수정 false->truewn
        saveUninitialized: true,   // 수정 false->true
        secret: 'passportExample',
        //        proxy: true,//추가
        cookie: {
            httpOnly: true,
            secure: false,  // true로 하면 https에서만 동작하기에 http를 사용하는 현제 프로젝트에서는 사용불가
           // maxAge: 1000 * 60 * 30,
            //sameSite: "none",
        }
    }));

    /* passport middleware */
    app.use(passport.initialize()); // passport 초기화
    app.use(passport.session()); // passport session 연동

    // 세션 처리 - 로그인에 성공했을 경우 딱 한번 호출되어 사용자의 식별자를 session에 저장
    passport.serializeUser(function (user, done) {
        console.log('serializeUser', user);
        done(null, user.userId);
    });

   // 세션 처리 - 로그인 후 페이지 방문 마다 사용자의 실제 데이터 주입
   passport.deserializeUser((userId, done)=> {
    User.findOne({userId: userId},(error,result)=>{
        done(error,result);     //db 사용자정보 컬렉션에서 해당 사용자 정보를 조회하고 req.user에 저장
        //console.log(user);
    })
    console.log('deserializeUser', userId);
});

passport.use(new LocalStrategy(
    function (userId, userPassword, done) {
        User.findOne({userId: userId}, (error, user)=>{
            if(error) return done(error);
            if(!user) {
                console.log('로그인실패: 아디없음');
                return done(null, false, {message: '존재하지 않는 아이디'});
            }
            if (userPassword === user.userPassword) { // password OK
                return done(null, user);
            } else {
                return done(null, false, { message: "비번 틀림" });
            }
            /*
            bcrypt.compare(password, user.password, (error, result)=>{  // 기존 로그인 확인 코드
                try {
                    if(result) {
                        console.log('로그인성공');
                        return done(null, user);
                    } else {
                        console.log('로그인실패: 비번틀림');
                        return done(null, false, {message: '비번틀림'});
                    }
                } catch(error) {
                    return done(error);
                }
            })
            */
        })
    }
));
    



    /* 라우터 설정 */
    /* Passport Login : Strategy-Local */
    /* Authenticate Requests */
    app.post('/login', (req, res, next) => {
       
        passport.authenticate('local', (err, user, info) => {//authenticate는 Passport.js에서 사용자를 인증하는 메서드라고 한다.
            // err는 서버의 에러
            if (err) {
                console.error(err);
                return next(err);
            }
            // info는 로직 상의 에러
            if (info) {
                console.log(req.isAuthenticated());//

                return res.send({ code: 0 });
            }
            // 위의 모든 에러가 없다면 로그인 성공
            // req.login을 하면 서버쪽에 세션과 쿠키로 저장이 된다.
            //로그인 성공시 req.isAuthenticated()는 true
            return req.login(user, (loginErr) => {//login(): passport의 메소드로 사용자를 세션에 로그인시키는 역할
                if (loginErr) return next(loginErr);
                // 정상적이라면 비밀번호를 제외한 유저 정보를 클라이언트에게 보낸다.
                console.log(req.isAuthenticated());
                console.log('세션'+passport.session);
                console.log('user:'+user);
                req.session.save((err) => {
                    if (err) {
                        console.error(err)
                        next(err)
                    }
                    else if(user.userId === '관리자' && user.userPassword==='1234'){//만약 관리자 번호라면
                        $socket.emit('login',{ //로그인 아이디 소켓으로 전달
                            userId:user.userId
                        }); 
                        res.send({code: 2}); //관리자 페이지로 바로 이동할 수 있게 설정
                    }
                    else {
                        $socket.emit('login',{ //로그인 아이디 소켓으로 전달
                            userId:user.userId
                        }); 
                        res.send({ code: 1 });
                        //                        res.redirect(`/user/${user.id}`);
                    }
                });
            });
        })(req, res, next); //미들웨어 내의 미들웨어에는 (req,res,next)를 붙인다.
    });

    app.get('/logout', function (req, res) {
        $socket.emit('logout',{ //로그인아웃시 소켓으로 전달
            message:'로그인을 해주세요'
        }); 
        req.logout((err)=>{
            if (err) {
                return res.status(500).send(err.message);
            }
           // res.redirect('/');
        });
        //res.redirect('/');
    });


    
    app.get('/user-info', (req, res) => {
        // 사용자가 인증되었는지 확인
        if (req.isAuthenticated()) {
            // req.user 객체에서 userId에 직접 접근
            const userId = req.user.userId; // 사용자 객체에 userId 속성이 있다고 가정합니다.
            res.send({ userId });
        } else {
            // 인증되지 않았다면 null을 보냄
            res.send({ userId: null });
        }
    });
}