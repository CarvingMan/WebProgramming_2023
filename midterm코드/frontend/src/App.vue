<template>
	<v-app>
	  <v-main>

  
		<div id = "body">
  
		  <table border="1" width= "1200px"  >
			<tr>
			  	<td id = "currentweather"  width = 35%><current-weather/></td>
			  	<td id = "map" rowspan="2">
					<div style="width: fit-content;">
						<google-map />
					</div>
				</td>
			</tr>
			<tr>
				<td id = "currentaqi">
					<current-aqi/>
				</td>
			</tr>
			<tr>
			  <td id = "forecast">
				<forecast />
			  </td>
			  <td id = "datatable">
				<DataTable />
			  </td>
			</tr>
		  </table>
  
		</div>
		<!--구글맵 추가-->
		<!-- 멍텅구리 버스랑 emit받을거 추가 하기 -->
  
  
	  </v-main>
	</v-app>
  </template>
  
  <script>
	import DataTable from './components/DataTable';
	import GoogleMap from './components/GoogleMap'; // 구글맵 컴포넌트 추가
	import CurrentWeather from './components/CurrentWeather';
	import CurrentAqi from './components/CurrentAqi';
	import Forecast from './components/Forecast';
	
	export default {
		name: 'App',
		components: {
		DataTable,
		CurrentWeather,
		CurrentAqi,
		Forecast,
		GoogleMap // 구글맵 컴포넌트 등록
		},
		data: () => ({
		//
		}),
	}
  </script>
  <style scoped>
	#body{
		background-color: rgb(51, 50, 50);
	}

	h2 {
		margin-top: 20px;
		margin-left: 10px;
		color: blue;
	}
	
	table {
		margin: 0 auto;
		/* 좌우 여백을 자동으로 설정하여 가운데 정렬합니다. */
		
	}
	
	#currentweather{
		background-color: blue;
	}

	#currentaqi{
		background-color: rgb(251, 170, 161);
	}
	
	#forecast{
		background-color: red;
	}

	#datatable{
		background-color: darkgray;
	}

	#map{
		background-color:  rgb(81, 81, 81);
	}
  </style>