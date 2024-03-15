<template class="body">
    <v-row justify="center">
      <v-dialog
        v-model="dialog"
        persistent
        width="600"
      >
        <template v-slot:activator="{ props }">
          <v-btn
            color="primary"
            v-bind="props"
            @click="dialog = !dialog"
          >
            아이디 찾기
          </v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="text-h5">전화번호를 입력 해주세요</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
               
               
               
                <v-col cols="6">
                  <v-text-field
                    label="전화번호*"
                    hint="공백없이 숫자만 입력해 주세요"
                    persistent-hint
                    required v-model="phone_number"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" v-if="isMessage===true">
                  <span style="font-size: 16px;">{{ message }}</span><br>
                  <span style="color: red;">보안을 위해 5초뒤에 사라집니다.</span>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          
          <v-card-actions>
            <v-row style="margin-bottom: 10px; margin-left: 10px;">
              <v-col cols="2">
                <v-btn
                  color="blue-darken-1"
                  variant="text"
                  @click="checkInfo"
                >
                  아이디찾기
                </v-btn>
              </v-col>
              <v-col style="margin-left: 30px;">
                <v-btn
                  color="blue-darken-1"
                  variant="text"
                  @click="dialog = false"
                >
                  닫기
                </v-btn>
              </v-col>
              
            </v-row>
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
      name: 'SearchId',
      methods: {
        searchId() { //아이디찾기
            this.message=null; //항상 시작할때 초기화

            try {
                
                axios.get(this.urlinfo+this.phone_number, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    withCredentials: true
                }).then((res) => {
                  console.log(res);
                  if(res.data.result === true){
                    this.message='회원님의 아이디: '+res.data.userId; 
                  }
                  else{
                    this.message=this.phone_number+'로 등록된 아이디가 없습니다.'
                  }
                   
                  this.isMessage = true;
                  setTimeout(function () {
                      this.isMessage = false;
                      this.message = null;
                      this.phone_number=null;
                      console.log(this.isMessage);
                  }.bind(this), 5000); // 5초만 메세지를 보여준다.
                  //setTimeout 함수 내부에서 this는 함수가 호출된 컨텍스트를 가리키므로 화살표함수를 사용하거나
                  //bind함수를 사용하여 컴포넌트의 this를 바인딩하라고 명시해 주어야 한다고 한다.
                
                });
            } catch (error) {
            console.error(error);
            }
        },
       
        checkInfo(){ //검색 하기전 공백, 등을 확인한다.
         
          if(this.phone_number===null){
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
            this.searchId(); //아이디 검색 함수 호출
          }
        },
    
         
      },
      data() {
        return {
            
            urlinfo:'http://localhost:8000/users/',
            
            phone_number:null,
            join_able:false,
            message:null,
            isMessage: false

        };
      },
    };
  </script>
  
  <style scoped>
 .body{
    background-color: rgb(250, 200, 195);
 }
  </style>