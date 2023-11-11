<template>
    <div>
        <input  v-model="inputData" type="text" placeholder="주소입력" style="background-color: aliceblue;"/>
        <button @click="searchMap" style="background-color: gray;">검색</button>
        <div style="background-color: lightgray;"><b>위도:{{test.latitude}} 경도:{{test.longitude}}</b></div>
        <div id = "map-canvas"/>
    </div>
    </template>
        <!--
        <script async="false" type="text/javascript"
         src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCS1Yy2ATpGgjkmuIgMGPgm_J-EHNvMvgk">//구글맵api
        </script>
        -->
    
    <script>
        import EventBus from '../eventBus.js'
    
        export default {
            name: 'map-canvas',
            mounted(){
                this.initMap();
                this.setMarker(this.mapCenter,"ce"); 
            },
            created(){
                EventBus.$on('sendlocation', (dbLocation) =>{ //데이터 테이블에서 전달된 위도경도를 받아 업데이트한다.
                this.lat = dbLocation.lat; this.lng = dbLocation.lng; //이벤트 버스로 받은 db좌표를 저장
                this.test = { latitude: dbLocation.lat, longitude: dbLocation.lng};
                const newCenter = new google.maps.LatLng(dbLocation.lat, dbLocation.lng);
                //LatLng 클래스는 위치 정보를 효과적으로 처리하기 위한 클래스로,
                // 위도와 경도를 받아 새로운 위치를 나타내는 LatLng 객체를 생성한다.
                this.map.setCenter(newCenter); //setCenter를 사용하여 위치 초기화
            });
            },
            methods: {
                initMap() {
                    this.map = new google.maps.Map(document.getElementById("map-canvas"), { //getElementById로 map id 속성의 요소를 가져온다.
                        center: this.mapCenter, //center로 할 위도, 경도를 지정한다.
                        zoom: 17, //zoom size를 지정.
                        maxZoom: 20,
                        minZoom: 3,
                        streetViewControl: true,
                        mapTypeControl: true,
                        fullscreenControl: true,
                        zoomControl: true,
                    });
    
                    EventBus.$emit('sendCoordinate', this.mapCenter); // 처음 마운트 할때 구글맵 좌표를 전달
                                                                     // 처음 마운트 할때이니 this.mapCenter와 같은값
                },
                setMarker(Points, Label) {//지도에 마커를 찍는 함수.
                    const markers = new google.maps.Marker({
                        position: Points,
                        map: this.map,
                        label: {
                        text: Label,
                        color: "#FFF",
                        },
                    });
                    this.map.addListener('center_changed', () => { //addListener로 기다리다 center_changed이벤트가 발생시
                        markers.setPosition(this.map.getCenter()) //마커의 위치를 center로 이동
                    });  
                
                     /*
                        이벤트 리스너(EventListener)는 프로그램에서 특정 이벤트가 발생했을 때
                         해당 이벤트에 대한 처리를 수행하도록 설정하는 메커니즘이다.
                    */
                    // 드래그 종료 이벤트를 감지하는 이벤트 리스너 추가
                    this.map.addListener('dragend', () => {
                        const newCenter = this.map.getCenter(); // 드래그 이후의 중심 위치를 가져옵니다.
                        this.sendCoordinate(newCenter); // 마커의 위치를 업데이트
                    });
                    
                },
                sendCoordinate(newCenter){ //이벤트 버스로 센터의 위도 경도를 전달할 메소드
                    //this.test = newCenter;
                    this.test = { latitude: newCenter.lat(), longitude: newCenter.lng()};
                    /*newCenter는 Google Maps JavaScript API에서 반환된 LatLng 객체입니다.
                     이 객체는 lat()와 lng()라는 메서드를 가지고 있어서 위도와 경도 값을 가져오려면 이 메서드를 호출해야 합니다.
                     괄호 ()를 사용하여 메서드를 호출합니다.
    
                     이렇게 메서드를 호출하여 객체의 속성에 접근하는 것은 해당 API에서 정의된 방식입니다. */
    
                     const mapPosition = {lat: newCenter.lat(), lng: newCenter.lng()};
                     EventBus.$emit('sendCoordinate',mapPosition); //이벤트 버스를 통하여 sendCoordinate라는 이벤트를 발생시키며
                },

                //지오코딩클래스는 주소(지명)를 좌표로 변환하거나, 좌표를 주소로 변환해 준다.
                searchMap() { //지오코더사용
                // 사용자가 입력한 지역명으로 지도 이동
                const geocoder = new google.maps.Geocoder(); //지오코더 객체 생성
                const address = this.inputData; //**입력한 데이더를 주소로 사용**
                geocoder.geocode({ address }, (results, status) => {//geocode메서드로 주소를 좌표로 반환 // adress 객체를 통하여 주소전달
                    if (status === "OK" && results[0]) { // 결과는 콜백함수에서 처리된다.
                         //results는 변환된 좌표와 관련된 정보를 포함하는 배열이고, status는 요청의 처리 상태를 나타냅니다.
                        const location = results[0].geometry.location; //results[0]는 가장 관련성이 높은(첫 번째로 반환된) 결과에 대한 정보를 포함한다.
                        // 이 정보에는 해당 위치의 좌표(geometry.location) 및 다양한 기타 속성이 포함될 수 있다고 한다.
                        this.map.setCenter(location); // setCenter함수를 사용하여 중심좌표 변경
                        this.sendCoordinate(location); //사용자가 input태크에 검색한 주소의 좌표를 sendCoordinate()의 이벤트 버스로 전달
                    } else {
                    console.error("Geocoding failed with status: " + status); //에러시 status(상태) 출력
                    }
                });
                },
                
                
            },
            data() {
                return {
                    map: null,
                    mapCenter: { lat: 37.566535, lng: 126.977969 },
                    test: { latitude: 37.566535, longitude: 126.977969 },
                    inputData: "" // 추가 v-model를 사용하여 양방향 바인딩이 되어있다.
                };
            },
          
        };
        
    </script>
    
    <style scoped>
        #map-canvas{
            width: 400px;
            height: 600px;
        }
    </style>