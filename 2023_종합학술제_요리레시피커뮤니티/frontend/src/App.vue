<template>
    <v-app>
        <v-app-bar app color="my_color1" dark >
            <v-app-bar-nav-icon @click.stop="bDrawer=!bDrawer"></v-app-bar-nav-icon>
            <v-toolbar-title class="mx-auto" style="font-size: 30px; font-weight: bold;">
                <img src="./title.png" alt="Cook Image"  style="vertical-align: middle; height: 50px; width: 50px;">
                요리의 모든 것
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <router-link to="/login">
                <v-btn class="pink" v-if="loginBtn">로그인</v-btn>
                <v-btn @click="logOut" class="pink" v-if="logoutBtn">로그아웃</v-btn>
            </router-link>
        </v-app-bar>
        
        <v-navigation-drawer absolute temporary v-model="bDrawer" color="my_color4" >
            <v-toolbar flat height="100px" color ="my_color3">
                <v-list>
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-avatar>
                                <img src="http://randomuser.me/api/portraits/men/44.jpg">
                            </v-list-item-avatar>
                            <v-list-item-title class="title">{{ userId }}</v-list-item-title>
                            <v-list-item-subtitle></v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-toolbar>
            <v-divider></v-divider>
            <v-list class="pt-3">
                <v-list-item v-for="item in items" :key="item.text" :href="item.to">
                    <v-list-item-action>
                        <v-icon>{{item.icon}}</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>{{item.text}}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
    
        <v-content>
            <v-alert
            v-model="alert"
                :value="alert"
                type="info"
                dismissible
                @input="alert = false"
            >
            <center>전체공지: {{ message }}</center>
            </v-alert>
            <router-view></router-view>
        </v-content>
        <v-footer>
            <v-btn text value="서비스 안내">
                <v-icon>목원대학교 정보통신공학과</v-icon>
            </v-btn>
        </v-footer>
    </v-app>
</template>

<script>

export default {
  name: 'Recipe',
  data() {     
      return {
      bDrawer: false,
      items: [
        { text: '홈', icon: "mdi-home", to:'/home' },
        { text: '레시피검색', icon: 'mdi-star' , to:'/Cook'},
        { text: '커뮤니티', icon: 'mdi-account-multiple', to:'/community' },
      ],
      userId:'로그인을 해주세요',
      loginBtn:true,
      logoutBtn:false,
      alert: false,
      message:null,
      }
  },
  created(){
    this.$socket.emit('rint',{data:"First Request"});
    this.$socket.on('login',(data)=>{this.userId=data.userId+' 페이지' // 로그인 성송시 소켓이 서버로부터 날라온다.
        this.loginBtn=false; //로그인시 로그인 버튼을 끄고 로그아웃버튼 활성화
        this.logoutBtn=true;
    }); 
    this.$socket.on('logout',(data)=>{this.userId=data.message
        this.loginBtn=true; //로그인시 로그인 버튼을 끄고 로그아웃버튼 활성화
        this.logoutBtn=false;
    })
    this.$socket.on('sendMessage',(data)=>{
        this.message=data.message //관리자가 서버에 요정한 /sendMSG에서 emit
        this.showAlert(); //5초간 알림창 보여준다.
    })
  },
  methods:{
    logOut(){
        try {
            this.axios.get('http://localhost:8000/logout', {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                withCredentials: true
            }).then((res) => {
              if (res.status === 200) {
                alert('로그아웃 성공');
                console.log(res)
                this.$router.push('/login');   
              } 
            });
        } catch (error) {
          console.error(error);
        }
    },
    showAlert() {//알림 5초간 보여준다.
      this.alert = true;
      setTimeout(()=>{
        this.alert=false;
        },5000);
    },
  }
};
</script>
