<template>
    <div id="current-aqi">
        <div class="aqi">
            
            현재 미세먼지 농도 AQIUS<br>
            {{aqius}}  {{condition}}
        </div>
    </div>
</template>

<script>
    import EventBus from '../eventBus.js'

    
    export default {
        name: 'current-aqi',
        data(){
            return{
                lat:37.566535, //위도
                lng:126.977969, //경도
                aqius: 50, // 미세먼지 농도 aqi: Air Quality Institude 대기질 지수 us: us기준으로 산정한 값이라고 한다.
                condition: "좋음" //미세먼지 상태 초기값
            }
        },
      
        methods: {
           
            updateAQI(){ //iqair API에서 현재 위도 경도의 미세먼지 농도를 가져온다.
                var config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: `http://api.airvisual.com/v2/nearest_city?lat=${this.lat}&lon=${this.lng}&key=14e05bdc-2c6e-47d2-b561-816846e7d581`,
                headers: { }        // 위도와 경도 입력 and rad:해당주변 몇 미터까지 확인할 것인지 반경 입력
                };

                this.axios(config)
                    .then((response) => {
                        const data = response.data.data;
                        const pollution = data.current.pollution;

                        this.aqius = pollution.aqius;
                        if (this.aqius <= 50) {
                            this.condition = "좋음😀";
                        } else if (this.aqius  <= 100) {
                            this.condition = "보통😐";
                        } else {
                            this.condition = "나쁨😡";
                        }
                       
                        })
                    .catch(function (error) {
                        console.log(error);
                    });
                    }
        },
        created(){

            EventBus.$on('sendCoordinate',(mapPositon) =>{
                this.lat = mapPositon.lat;
                this.lng = mapPositon.lng;
                this.updateAQI(); //위치 정보가 업데이트 될 때 미세먼지 정보 업데이트
            });


            EventBus.$on('sendlocation', (dbLocation) =>{ //데이터 테이블에서 전달된 위도경도를 받아 업데이트한다.
                this.lat = dbLocation.lat;
                this.lng = dbLocation.lng;
                this.updateAQI();
            });

             // 초기 위치 정보에 따라 날씨/미세먼지 정보 업데이트
             this.updateAQI();
        }
    }
</script>

<style scoped>
	

    .aqi{
        text-align : center;
		font-size : 20pt;
		font-weight : 10;
		color : white;
    }
</style>