<template>
  <div>
    <div v-if="isRecipe===false">
      <div style="margin: 50px;">
          <center><h2>{{ message }}</h2></center>
      </div>
    </div>
    <div v-if="isRecipe === true" class="contents">
      <div>
          <h2>{{ title.name }} 의 영양성분</h2>
          <img :src="title.mainImg" alt="Main Image">
      </div>
      <div style=" margin-left: 50px; margin-top: 100px;">
         <div class="subtitle">
            <div style="display: flex;">
              <img src="./eng.png" alt="eng_icon" class="icon">
              <h3 style="margin-top: 10px;">{{ this.eng }}</h3>
            </div>
            
            <hr>
            <ul>
                <li>{{ this.car }}</li>
                <li>{{ this.pro }}</li>
                <li>{{ this.fat }}</li>
                <li>{{ this.na }}</li>
            </ul>
         </div>
        
        
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Recipe',
  created() {
    this.$bus.$on('search', (result) => {
      if (result.RESULT.CODE === 'INFO-000') {
        const data = result.row[0];
        this.title.mainImg = data.ATT_FILE_NO_MAIN;
        this.title.name = data.RCP_NM;
        this.setCalorie(data);
        this.isRecipe = true; // 검색 결과가 있을 때만 true로 설정
        this.message = ''; // 검색 결과가 있으면 메시지를 초기화
      } else {
        this.isRecipe = false;
        this.message = '죄송합니다. 검색 결과가 없으니 다시 검색해 주세요';
      }
    });
  },
  methods: {
      setCalorie(data){
        this.eng = '총열량 : '+data.INFO_ENG+'kcal';
        this.car = '탄수화물 : '+data.INFO_CAR+'g';
        this.pro = '단백질 : '+data.INFO_PRO+'g';
        this.fat = '지방 : '+data.INFO_FAT+'g';
        this.na = '나트륨 : '+data.INFO_NA+'mg';
      }
  },
  data() {
    return {
      isRecipe: false, // 검색한 레시피가 있을 시에만 true
      message: '궁금한 요리를 검색해 보세요!', // 검색하기 전은 default 검색 후 결과가 없을 시 '검색결과가 없습니다.'
      title: { mainImg: '', name: '' },
      eng: '', //열량
      car: '', //탄수화물
      pro: '', //단백질
      fat: '', //지방
      na: '' // 나트륨

    };
  },
};
</script>

<style scoped>
.contents {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    margin-top: 10px;

}
img {
  max-width: 400px; /* 최대 크기 설정 */
  height: auto; /* 가로 비율에 따라 세로 크기 자동 조정 */
}
.font {
  font-size: '16px';
}

.icon{
  max-width: 40px;
  height: auto;
}
.subtitle{
  justify-content: center;
  vertical-align: center;
}
</style>