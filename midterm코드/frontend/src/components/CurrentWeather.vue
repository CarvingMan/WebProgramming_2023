<template>
    <div id="current-weather">
        <div class="location">{{location}}</div>
        <div class="weather">{{weather}}</div>
        <div class="temperature">{{temperature}}℃</div>
    </div>
</template>

<script>
    import EventBus from '../eventBus.js'

    export default {
        name: 'current-weather',
        data(){
            return{
                location:'',
                weather:'',
                temperature:0,
                lat:37.566535, //위도
                lng:126.977969 //경도
            }
        },
        /*
        mounted(){//axios에 서비스키 참조 // 마운티드는 컴포넌트가 렌더링된후 실행되는 훅이다.
                this.axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${this.lat}&lon=${this.lng}&appid=fc91e9cad20baf3799e0695068627190`)
            .then((response)=>{
                let data = response.data
                this.location = data.name
                this.weather = data.weather.main
                this.temperature = (data.main.temp-273.15).toFixed(1)
            })
            .catch((error)=>{
                console.log(error)
            })
        },*/
        methods: {
            updateWeather() { //계속 날씨를 업데이트 해 주어야 하기 때문에 메소드로 만들고 created에서 실행하고 이벤트 발생시에도 실행
            // OpenWeatherMap API로 날씨 정보 업데이트
                this.axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${this.lat}&lon=${this.lng}&appid=fc91e9cad20baf3799e0695068627190`)
                    .then((response) => {
                        let data = response.data;
                        this.location = data.name;
                        this.weather = data.weather[0].main;
                        this.temperature = (data.main.temp - 273.15).toFixed(1);
                        /*
                         data.main.temp가 켈빈(Kelvin)로 표시된 온도를 가져오기에 0도가 절대영도-273.15이다.
                         따라서 절대영도를 뻬주고 toFixed로 소수점 1째자리까지 반올림한다.
                         */
                    })
                    .catch((error) => {
                    console.log(error);
                    });
                }
        },
        created(){

            // 이벤트 버스 구독
            EventBus.$on('sendCoordinate',(mapPositon) =>{
                this.lat = mapPositon.lat;
                this.lng = mapPositon.lng;
                this.updateWeather(); // 위치 정보가 업데이트될 때 날씨 정보를 업데이트
            });

            EventBus.$on('sendlocation', (dbLocation) =>{ //데이터 테이블에서 전달된 위도경도를 받아 업데이트한다.
                this.lat = dbLocation.lat;
                this.lng = dbLocation.lng;
                this.updateWeather();
            });

             // 초기 위치 정보에 따라 날씨 정보 업데이트
             this.updateWeather();
        }
    }
</script>

<style scoped>
	.location {
		text-align : center;
		font-size : 40pt;
		color : white;
	}
	.weather{
		text-align : center;
		font-size : 20pt;
		font-weight : 100;
		color : white;
	}
	.temperature{
		text-align : center;
		font-size : 50pt;
		font-weight : 100;
		color : white;
	}
</style>