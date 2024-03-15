<template>
  

        <v-container
          style="position: relative; margin-left: 30%"
          class="text-xs-center"
        >
          <v-layout row wrap class="text-xs-center">
            <v-flex>
              <v-card flat class="mx-auto" max-width="800">
                <v-row style="margin-top: 30px">
                  <v-col>
                    <v-form style="width: 400px; height: 300px">
                      <v-card-title>
                        <span style="font-size: 30px; font-weight: bold; color:rgb(175, 105, 97)">
                          로그인 페이지
                        </span>
                      </v-card-title>
                      <div class="mx-3">
                        <v-icon color="black" size="30px">person</v-icon>
                        userId
                        <div class="mx-1">
                          <v-text-field
                            placeholder="userId"
                            v-model="userId"
                            required
                          ></v-text-field>
                        </div>
                      </div>
                      <div class="mx-3">
                        <v-icon color="black" size="30px">lock</v-icon>
                        userPassword
                        <div class="mx-1">
                          <v-text-field
                            placeholder="userPassword"
                            type="password"
                            v-model="userPassword"
                            required
                          ></v-text-field>
                        </div>
                      </div>
  
                      <v-card-actions>
                        <v-btn
                          color="#2c4f91"
                          dark
                          large
                          block
                          @click="loginSubmit"
                          >Login</v-btn
                        >
                        
                      </v-card-actions>
                     <v-row style="margin-top: 3%;">
                        <v-col cols="4"  style="margin-left: 3%;">
                          <join/>
                        </v-col>
                        <v-col cols="4">
                          <SearchId/>
                        </v-col>
                     </v-row>
                
                    </v-form>
                  </v-col>
                
                </v-row>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      
  </template>
  
  <script>
  import axios from 'axios'
  import qs from 'qs'

  import join from '../components/join'; //회원가입 컴포넌트
  import SearchId from '../components/SearchId'; //아이디찾기 컴포넌트

  export default {
    name: 'Login',
    components: {
      join,
      SearchId
  },
    data() {
      return {
        urlinfo:'http://localhost:8000/login',
        userId: null,
        userPassword: null,
      };
    },
    methods: {
      loginSubmit() {
        let saveData = {};
        saveData.username = this.userId;
        saveData.password = this.userPassword;
  
        try {
            axios.post(this.urlinfo, qs.stringify(saveData), {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                withCredentials: true
            }).then((res) => {
              if (res.status === 200) {
                // 로그인 성공시 처리해줘야할 부분
                if(res.data.code === 0){        //로그인 실패
                    alert('로그인 실패')
                    this.userId=null; //입력창 초기화
                    this.userPassword=null;               
                } else if(res.data.code === 1){
                    alert('로그인 성공');
                    this.$router.push('/home');
                }
                else if(res.data.code === 2){//관리자
                    alert('관리자님 환영합니다.');
                    this.$router.push('/admin');
                }
                // 로그인 
              } else if(res.status === 401) {
                alert(res.data.message);
              }
            });
        } catch (error) {
          console.error(error);
        }
      },
    },
  };
  </script>