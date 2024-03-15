<template>
  <div class="my-custom-container text-center">
    <v-container fluid >
      <v-row>
        <v-col><!--mx-auto: 수평 가운데 정렬 mx: margin, auto: 좌우 마진 자동으로 설정한다-->
          <v-text-field v-model="searchText" label="궁금한 요리를 검색해 보세요! ex) 된장찌개" 
            append-icon="mdi-magnify" @click:append="search" filled solo  class="mx-auto"></v-text-field>
        </v-col>
      </v-row>
    </v-container>
    <v-overlay :value="loading">
      <v-progress-circular
        indeterminate
        color="my_color1"
        size="120"
      > 
      <span style="font-size: 20px;">로딩중</span>
      </v-progress-circular>
    </v-overlay>
    <v-tabs
      fixed-tabs
      bg-color="indigo-darken-2"
      backgroundColor="my_color2" v-model="selectedTab" 
    >
      <v-tab>
        <span class="sub-title">재료</span>
      </v-tab>
      <v-tab>
        <span class="sub-title">레시피</span>
      </v-tab>
      <v-tab>
        <span class="sub-title">영양성분</span>
      </v-tab>

      <!-- v-tab-item을 사용하여 각 탭에 컴포넌트나 요소를 추가합니다. -->
      <v-tab-item>
        <!-- 여기에 첫 번째 탭에 들어갈 컴포넌트나 요소를 추가하세요. -->
        <Ingredient/>
      </v-tab-item>

      <v-tab-item>
        <Recipe/>
      </v-tab-item>
      <v-tab-item>
        <Calorie/>
      </v-tab-item>

    </v-tabs>
  </div>
</template>

<script>

import Ingredient from '../components/Ingredient';
import Recipe from '../components/Recipe';
import Calorie from '../components/Calorie';

export default {
  name: 'Cook',
  components: {
    Ingredient,
    Recipe,
    Calorie
  },
  data() {
    return {
      searchText: '',
      selectedTab: 0,
      loading: false, // 로딩 상태를 나타내는 변수
    };
  },
  watch: {
    selectedTab(newVal, oldVal) {
      // 선택된 탭이 변경될 때의 로직
      this.search();
    },
  },
  methods: {
    search() {
      // 로딩 상태를 시작
      this.loading = true;

      this.axios.get(`http://openapi.foodsafetykorea.go.kr/api/3ec047b22241409f9120/COOKRCP01/json/1/1/RCP_NM=${this.searchText}`)
        .then((response) => {
          let result = response.data.COOKRCP01;
          this.$bus.$emit('search', result);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          // 로딩 상태를 종료
          this.loading = false;
        });
    },
  },
};
</script>

<style>
.my-custom-container {
  background-color: #FCA096; /* 사용자 지정 색상 코드로 변경 */
  /* 다른 스타일 속성들을 필요에 따라 추가할 수 있습니다. */
  width: 100%;
}

.sub-title {
  font-size: 20px;
  font-weight: bold;
}

.v-text-field {
  max-width: 800px; /* 원하는 가로 길이로 조절 */
  border-radius: 30px;
  margin: 0 auto; /* 가운데 정렬을 위한 margin 설정 */
}


</style>