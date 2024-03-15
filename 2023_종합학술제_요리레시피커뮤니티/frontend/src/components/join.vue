<template class="body">
    <v-row justify="center">
      <v-dialog
        v-model="dialog"
        persistent
        width="1024"
      >
        <template v-slot:activator="{ props }">
          <v-btn
            color="primary"
            v-bind="props"
            @click="dialog = !dialog"
          >
            회원가입하기
          </v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="text-h5">회원가입</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
               
               
                <v-col cols="8" style="margin-left: 4%;">
                  <v-text-field
                    label="id*"
                    required v-model="userId"
                  ></v-text-field>
                </v-col>
                <v-col cols="3" >
                  <v-btn color="my_color1" @click="checkId">아이디중복확인</v-btn>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Password*"
                    type="password"
                    required v-model="userPassword"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="이름*"
                    required v-model="name"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="전화번호*"
                    hint="공백없이 숫자만 입력해 주세요"
                    persistent-hint
                    required v-model="phone_number"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
              color="blue-darken-1"
              variant="text"
              @click="searchId"
            >
              가입하기
            </v-btn>
            <v-btn
              color="blue-darken-1"
              variant="text"
              @click="dialog = false"
            >
              닫기
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </template>
  
  
  <script setup>
    import { ref } from 'vue'
  
    const dialog = ref(false)
  </script>
  
  
  <script>
  import axios from 'axios'
  //import qs from 'qs'

    export default {
      name: 'Join',
      methods: {
        checkId() { //아이디 중복확인
            try {
                if(this.userId===null){ //아무것도 입력하지 않았을시
                  alert('아이디를 입력하세요');
                  return this.id_able=false;
                }
                if (this.userId && /\s/.test(this.userId)) { //정규 표현식 사용 \s:공백 or tab등 이스케이프 문자를 찾아
                                                    //test()는 정규 표현식을 사용하여 문자열을 검사하는 JavaScript의 메서드 라고한다.
                  // this.userId가 존재하고, 하나 이상의 공백이 있는 경우
                  alert('아이디에는 공백이 포함될 수 없습니다.');
                  this.id_able = false;
                  this.userId = null;
                  return;
                }
                axios.get('http://localhost:8000/join/'+ this.userId, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    withCredentials: true
                }).then((res) => {
                  console.log(res.data);
                
                    // 아이디 중복확인 후 처리해줘야할 부분
                    if(res.data.idAble === true){        //아이디 사용가능
                        this.id_able=true;
                        alert('아이디 사용가능');
                    } else if(res.data.idAble=== false) {  //아이디 중복
                        alert('이미 사용중인 아이디입니다.');
                        this.userId = null//초기와                
                    }
                   
                
                });
            } catch (error) {
            console.error(error);
            }
        },

        searchId() { //입력한 전화번호로 가입된 아이디가 있는지 검사
            try {
                axios.get('http://localhost:8000/users/'+this.phone_number, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    withCredentials: true
                }).then((res) => {
                   //console.log(res);
                  if(res.data.result === true){
                    this.join_able=false; //아이디가 이미 존재하면 가입불가
                  }
                  else{
                    this.join_able=true;
                    console.log('joinable:'+this.join_able);
                  }
                  this.checkInfo(); // 나머지 데이터 검사 후 회원등록          
                });
            } catch (error) {
              console.error(error);
            }
        },
        checkInfo(){ //등록을 하기전 공백, 등을 확인한다.
          if(this.join_able===false){
            alert('이미 해당 번호로 가입이 되어있습니다.');
            this.userId=null; //전부 초기화
            this.id_able=false;
            this.userPassword=null;
            this.name=null;
            this.phone_number=null;
          }
          else if(this.id_able === false){
            alert('아이디의 중복 여부를 확인하세요');
            return this.userId = null; //클라이언트가 쓴 아이디 초기화
          }
          else if(this.userPassword === null){
            alert('비밀번호를 입력하세요');
            return;
          }
          else if(this.userPassword && /\s/.test(this.userPassword)){
            alert('비밀번호에 공백문자가 포함되어 있습니다.');
            return this.userPassword = null
          }
          else if(this.name === null){
            alert('이름을 입력해 주세요');
            return;
          }
          else if(this.name && /\s/.test(this.name)){
            alert('이름에 공백문자가 포함되어 있습니다.');
            return this.name = null;
          }
          else if(this.phone_number===null){
            alert('전화번호를 입력해 주세요');
            return;
          }
          else if(this.phone_number && /\s/.test(this.phone_number)){
            alert('전화번호에 공백이 포함되어 있습니다.');
            return this.phone_number = null;
          }
          else if (/[^\d]/.test(this.phone_number)) { //[]는 정규 표현식에서 문자 클래스(character class)를 나타내는데 사용한다고 한다.
                                                      //즉, \d(정수)가 ^(아닌)문자 클래스들을 찾는다. 
            alert('전화번호에는 숫자만 입력해 주세요.');
            return this.phone_number = null;
          }
          else{//전부 괜찮을시
            this.signUp(); //등록함수 호출
          }
        },
        signUp(){
          axios.post('http://localhost:8000/users',{ 
            userId: this.userId, userPassword:this.userPassword, name: this.name,  phone_number: this.phone_number
          },{withCredentials:true})
          .then((res) => {
            alert(res.data.userId+'님 가입 축하합니다. 로그인을 해주세요');
            this.id_able=false; this.join_able=false;// 가입아이디 재등록 금지
            this.userId=null; this.userPassword=null;
            this.name=null; this.phone_number=null; 
          })
          .catch((err) => {
            alert('에러 발생: ' + err); //에러 발생
          });          
        }
         
      },
      data() {
        return {
            dialog: false,
            urlinfo:'http://localhost:8000/users',
            userId:null,
            userPassword:null,
            name:null,
            phone_number:null,
            id_able:false,
            join_able:false

        };
      },
    };
  </script>
  
  <style scoped>
 .body{
    background-color: rgb(250, 200, 195);
 }
  </style>