<template>
    <div id="app">

        <div class="my-custom-container text-center">
        <v-row >
          <v-col>
            <center>
                <span style="font-size: 30px; font-weight: bold; color:rgb(139, 91, 85)">회원 관리</span>
            </center>
          </v-col>
        </v-row>
      </div>
    

      <v-data-table :headers="headers" :items="items" class="elevation-1"
      fixed-header
      height="300" 
      >
          <template v-slot:item="row">
          <tr>
              <td>{{row.item.userId}}</td>
              <td>{{row.item.name}}</td>
              <td>{{row.item.phone_number}}</td>
              <td>{{row.item.register_date}}</td>
              <td class="text-xs-right">
                 
                  <v-btn color="primary" v-on:click.native="deleteUser(row.item.userId)">삭제</v-btn>
                
              </td>
          </tr>
        </template>
      </v-data-table>
    </div>
  </template>
  
  <script>
  import axios from 'axios'
  export default {
    data () {
      return {
        urlinfo:'http://localhost:8000/users',
        headers: [
        { text: '아이디', align: 'left', value: 'userId'}, //테이블 헤더용
        { text: '이름', align: 'left', value: 'name'},
        { text: '전화번호', align: 'left',value: 'phon_number'},
		{ text: '등록일', align: 'left', value: 'register_date'},
      ],

        userId:null,
        name:null,
        phone_number:null,
        register_date: null,
      
        items:[]
      }
    },
    created(){
        this.$socket.on('join',(data)=>{
         this.updateUser(); // 회원가입시 소켓 통신을 사용하여 새로 테이블 업로드
        });
        
        this.$socket.on('delete-account',(data)=>{
         this.updateUser(); // 회원탈퇴 소켓 통신을 사용하여 새로 테이블 업로드
        });      
    },
    mounted(){
        this.updateUser(); // 컴포넌트 마운트될시 가져옴
    },
    methods:{   

      updateUser(){
        axios.get(this.urlinfo) //서버에 요청하기
        .then((res) => {
            if(res.data.code === 2){        //로그인 실패
                    alert('로그인이 필요한 페이지입니다.')
                    this.$router.push('/login');       
             } 
            console.log(res.data); //성공시
            this.items = res.data;
        })
        .catch((err) => {
            alert('에러 발생: ' + err); //에러 발생
        });
      },
      deleteUser(Id){ // 부적절한 회원이 있을 시 관리자가 강제 탈퇴
        axios.delete('http://localhost:8000/users/'+encodeURIComponent(Id),{withCredentials:true})
           .then((res) => {
                if(res.data.code === 2){        //로그인 실패
                        alert('로그인이 필요한 페이지입니다.')
                        this.$router.push('/login');       
                    } 
                 alert('회원 탈퇴 성공!');
               
           })
             .catch((err) => {
                alert('에러 발생: ' + err); //에러 발생
          });          
      }
  
    }
  }
  </script>
  <style scoped>
    div{
      margin:0 5px 0 5px;
    }
  </style>
  