<template>
    <v-row justify="end" style="margin-right: 5%;">
      <v-dialog
        v-model="dialog"
        persistent
        width="800"
      >
        <template v-slot:activator="{ props }">
          <v-btn
            color="primary"
            v-bind="props"
            @click="dialog = !dialog"
          >
            게시물작성
          </v-btn>
        </template>
        <v-card style="background-color: rgb(255, 219, 215)">
          <v-card-title>
            <span class="text-h5">게시글 등록</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
               
                <v-col cols="8">
                  <v-text-field
                    label="제목*"
                    required v-model="title"
                  ></v-text-field>
                </v-col>
                <v-col cols="10">
                    <v-textarea
                        label="본문"
                        required
                        v-model="contents"
                        filled  
                        outlined  
                        
                    ></v-textarea>
                </v-col>

                
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
              color="blue-darken-1"
              variant="text"
              @click="posting"
            >
              등록하기
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
        checkUser() { //로그인한 아이디 확인
            try {
               
                axios.get('http://localhost:8000/user-info', {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    withCredentials: true
                }).then((res) => {
                  console.log(res.data);
                  this.userId=res.data.userId
                
                });
            } catch (error) {
            console.error(error);
            }
        },

        posting() { //포스팅
          
              
            if(this.title === null || this.title===''){
                alert('제목을 입력하세요');
                return this.title=null;
            }
            else if(this.contents === null || this.contents===''){
                alert('본문을 입력하세요');
                this.contents=null;
                return;
            }
            else{
                axios.post('http://localhost:8000/boards',{ 
                    userId: this.userId, title:this.title, contents:this.contents
                },{withCredentials:true})
                .then((res) => {
                    alert('포스팅 성공!');
                    this.title=null;
                    this.contents=null;
                
                })
                .catch((err) => {
                    alert('에러 발생: ' + err); //에러 발생
                });          
            }
        },
         
      },
      data() {
        return {
            dialog: false,
            urlinfo:'http://localhost:8000/boards',
            userId:null,
            title:null,
            contents:null,
           
            
        };
      },
      created(){
        this.checkUser(); 
      }
    };
  </script>
  
  <style scoped>

  </style>