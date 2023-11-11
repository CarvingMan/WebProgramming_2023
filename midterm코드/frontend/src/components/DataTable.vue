<template>
  <div id="app">
    <v-layout row justify-center>
      <v-dialog v-model="dialog" persistent max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">{{dialogTitle}}</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field label="번호" v-model="locationInfo.Id" required></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field label="위도"  v-model="locationInfo.lat" required></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field label="경도"  v-model="locationInfo.lng" required></v-text-field>
                </v-flex> 
                <v-flex xs12>
                  <v-text-field label="등록일"  v-model="locationInfo.register_date" required></v-text-field>
                </v-flex> 
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="btnClick($event)">취소</v-btn>
            <v-btn color="blue darken-1" text @click="btnClick($event)">확인</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
	<v-btn color="primary" v-on:click.native="addLocation()">추가</v-btn>
	<v-data-table :headers="headers" :items="items" class="elevation-1">
		<template v-slot:item="row">
		<tr v-on:click = "sendLocation(row.item)">
			<td>{{row.item.Id}}</td>
			<td>{{row.item.lat}}</td>
			<td>{{row.item.lng}}</td>
			<td>{{row.item.register_date}}</td>
			<td class="text-xs-right">
				<v-btn color="primary" v-on:click.native="updateLocation(row.item)">수정</v-btn>
				<v-btn color="primary" v-on:click.native="deleteLocation(row.item)">삭제</v-btn>
			</td>
		</tr>
      </template>
	</v-data-table>
  </div>
</template>

<script>
import axios from 'axios';  
import EventBus from '../eventBus.js'

export default {
  data () {
    return {
      urlinfo:'http://localhost:8000/locations',
      locationInfo:{
        _id: null,
        Id: null,
        lat:null,
        lng:null,
        register_date: null
      },
      dialog: false,
      dialogTitle:null,

      headers: [
        { text: '번호', align: 'left', value: 'Id'},
        { text: '위도', align: 'left',value: 'lat' },
        { text: '경도', align: 'left', value: 'lng' },
		{ text: '등록일', align: 'left', value: 'register_date' },
		{ text: '관리', align: 'left', value: '' },
      ],
      items:[]
    }
  },
  created(){
    axios.get(this.urlinfo) //서버에 요청하기
    .then((res) => {
      console.log(res.data); //성공시
      this.items = res.data;
    })
    .catch((err) => {
      alert('에러 발생: ' + err); //에러 발생
    });
  },
  methods:{
    addLocation(){
      this.dialog = true;
      this.dialogTitle = "추가";
      this.locationInfo.register_date = Date.now();
    },
    updateLocation(data){
      this.dialog = true;
      this.dialogTitle = "수정";
      this.locationInfo.Id = data.Id;
      this.locationInfo.lat = data.lat;
      this.locationInfo.lng = data.lng;
      this.locationInfo.register_date = data.register_date;
    },
    deleteLocation(data){
      this.dialog = true;
      this.dialogTitle = "삭제";
      this.locationInfo.Id = data.Id;
      console.log('deleteLocation : ' + data);
    },

    btnClick($event){
      this.dialog = false;
      if($event.target.innerHTML == "확인"){
        if(this.dialogTitle =="추가"){ 
          axios.post(this.urlinfo,{ 
            Id: this.locationInfo.Id, lat: this.locationInfo.lat, lng:  this.locationInfo.lng
          })
          .then(() => {
            axios.get(this.urlinfo) //서버에 요청하기
            .then((res) => {
              //console.log(res.data); //성공시
              this.items = res.data;
              alert("좌표 추가 성공");
            })
            .catch((err) => {
              alert('에러 발생: ' + err); //에러 발생
            });
            
          })
          .catch((err) => {
            alert('에러 발생: ' + err); //에러 발생
          });          
        }
        else if(this.dialogTitle=="수정"){
          //alert("입력된 정보 : " + "이메일 : " + this.contactInfo.email + " 패스워드 : " + this.contactInfo.password);
          axios.put(this.urlinfo + '/'+ this.locationInfo.Id, { 
            Id: this.locationInfo.Id, lat: this.locationInfo.lat, lng:  this.locationInfo.lng, 
            register_date:this.locationInfo.register_date
          })
          .then(() => {          
            axios.get(this.urlinfo) //서버에 요청하기
            .then((res) => {
              //console.log(res.data); //성공시
              this.items = res.data;
              alert("업데이트 성공");
            })
            .catch((err) => {
              alert('에러 발생: ' + err); //에러 발생
            });
          })
          .catch((err) => {
            alert('에러 발생: ' + err); //에러 발생
          }); 

        }
        else {
          axios.delete(this.urlinfo + '/'+ this.locationInfo.Id, { data: { Id: this.locationInfo.Id } })
          .then((result) => { 
            console.log("삭제 후" + result); //성공시
            axios.get(this.urlinfo) //서버에 요청하기
            .then((res) => {
              this.items = res.data;
              alert("삭제 성공");
            })
            .catch((err) => {
              alert(' 삭제 후 데이터 가져오는 중 에러 발생: ' + err); //에러 발생
            });            
          })
          .catch((err) => { alert('에러 발생: ' + err); });          

        }
      }
      this.locationInfo.Id = null;
      this.locationInfo.lat = null;
      this.locationInfo.lng = null;
      this.locationInfo.register_date = null;
    },
    sendLocation(item){ //이벤트버스로 선택한 행의 위도경도를 보내는 함수
      const dbLocation = {lat : item.lat, lng : item.lng}; 
      // 테이블에서 선택한 row의 lat과 lng를 객체로 저장한다.
      EventBus.$emit('sendlocation', dbLocation);
    }

  }
}
</script>
<style scoped>
  div{
    margin:0 5px 0 5px;
  }
</style>