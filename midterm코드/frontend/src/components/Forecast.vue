<template>
    <div style="overflow:auto;"><!--박스 외부로 넘어가면 스크롤 생성-->
       <ul class="forecasts">
             <template v-for="(forecast,j) in forecasts" ><!--v-for은 in이든 of든 똑같이 v-for="(value,index) [in/of] items"이다.-->
                 <li  class="item" v-if = "j%8==0" :key="forecast.dt">
                    <!--하루에 3시간 마다 일기정보 8개룰 보여주기에 8로 나누어서 8번째 요소일때만 출력한다.-->
                 <div class="weekday">
                     {{convertToDate(forecast.dt) | weekday}}
                     <!--dt는 날씨 예보 정보에서 예보 시간을 나타내는 속성.
                     이 속성은 Unix 타임스탬프 형식으로 저장되어 있으며, 일반적으로 초 단위로 표시된다고 한다.
                     |는 필터를 적용하라는 파이프 연산자이며
                      파이프 연산자는 템플릿에서 데이터를 필터 함수로 전달하여 가공할 때 사용된다고 한다..-->
             </div>
             <div class="icon">
                     <img :src="`http://openweathermap.org/img/w/${forecast.weather[0].icon}.png`">
                     <!--:를 사용하여 바인딩한다.-->
              </div>
              <div class="temperature">
                  {{(forecast.main.temp - 273.15).toFixed(0)}}℃
               </div>
                </li>
             </template>
          
       </ul>
    </div>
 </template>

<script>
    import EventBus from '../eventBus.js'

	export default {
    	name: 'forecast',
    	data () {
     		return {
           		forecasts: [],
           		lat: 37.566535,
         		lon: 126.977969
        	}
    	},
    	filters: {//필터는 렌더링되는 데이터를 가공하거나 형식을 변경할 수 있도록 도와준다고 한다.
        	weekday(date){  
            	let weekdayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
				return weekdayName[date.getDay()];//date.getDay()는 unix타임스탬프 날짜를  convertToDate()에서
                // javascript Date객체로 변환된 해당날짜 요일 반환
			}
		},
        /*
    	mounted() { // 마운트는 컴포넌트가 렌더링 된 후 실행되는 훅으로 업데이트 시키기위해서는 메소드 형태로 사용하여 created에서
            // 호출하여 초기 정보를 가져오고 이벤트버스를 통한 데이터가 변경될시 다시 호출하여 업데이트 해야한다.
        	this.axios.get(`http://api.openweathermap.org/data/2.5/forecast?lat=${this.lat}&lon=${this.lon}&appid=67c78818c6afe50f6425fa397c98a955`)
        	.then((response) => {
            	let data = response.data
            	this.forecasts = data.list
            })
            .catch((error) => {
                console.log(error);
            })
    	},*/
        methods: {
            convertToDate (timestamp) {
            	return new Date(timestamp * 1000) //unix타임스탬프 날짜를 1000곱하여 밀리초로 만들어
                //자바스크립트 Date객체호 생성
            },
            updateForecast(){
                this.axios.get(`http://api.openweathermap.org/data/2.5/forecast?lat=${this.lat}&lon=${this.lon}&appid=fc91e9cad20baf3799e0695068627190 `)
                .then((response) => {
                    let data = response.data
                    this.forecasts = data.list
                })
                .catch((error) => {
                    console.log(error);
                })
            }
        },
        created(){

            // 이벤트 버스 구독
            EventBus.$on('sendCoordinate',(mapPositon) =>{
                this.lat = mapPositon.lat;
                this.lng = mapPositon.lng;
                this.updateForecast(); // 위치 정보가 업데이트될 때 날씨 정보를 업데이트
            });

            EventBus.$on('sendlocation', (dbLocation) =>{ //데이터 테이블에서 전달된 위도경도를 받아 업데이트한다.
                this.lat = dbLocation.lat;
                this.lng = dbLocation.lng;
                this.updateForecast();
            });

            this.updateForecast();
        }
	}
</script>

<style scoped>
    .forecasts {
       display: flex;
       width: 80%;
       padding: 0;
       margin: 0 auto;
       align-items: center;
       justify-content: center;
    }
    .forecasts > li.item {
        position: relative;
        flex: 1;
        color: white;
        text-align: center;
        list-style-type: none;
    }
    .forecasts > li.item:first-child:before {
        content: '';
        position: absolute;
        top: -10px;
        left: 50%;
        display: block;
        width: 6px;
        height: 6px;
        margin-left: -3px;
        border-radius: 50%;
        background-color: #fa4444;
    }
    .forecasts > li.item > .temperature {
        margin-top: -8px;
    }
</style>