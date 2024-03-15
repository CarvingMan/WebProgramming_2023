<template>
    <div>
      <div v-if="isRecipe===false">
        <div style="margin: 50px;">
            <center><h2>{{ message }}</h2></center>
        </div>
      </div>
      <div v-if="isRecipe === true" class="contents">
        <img :src="title.mainImg" alt="Main Image">
        <h2>{{ title.name }} 만드는 법!</h2>
        <hr>
  
        <div v-for="(item, index) in RecipeList" :key="index" >
          
          <img :src="item.img" alt="Step Image">
          <div class="manual-text" v-html="replaceNewline(item.manual)"></div>
           <!--v-html 디렉티브는 Vue.js에서 사용되는 디렉티브 중 하나로, 해당 엘리먼트의 HTML 내용을
             동적으로 바인딩할 때 사용한다고 한다. 
            즉, replaceNewline 메서드를 호출하여 item.manual에서 \n을 <br>로 대체한 문자열을 반환한다.-->
          
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
          console.log(data); // 데이터 확인용
          this.title.mainImg = data.ATT_FILE_NO_MAIN;
          this.title.name = data.RCP_NM;
          this.setRecipe(data);
          this.isRecipe = true; // 검색 결과가 있을 때만 true로 설정
          this.message = ''; // 검색 결과가 있으면 메시지를 초기화
        } else {
          this.isRecipe = false;
          this.message = '죄송합니다. 검색 결과가 없으니 다시 검색해 주세요';
        }
      });
    },
    methods: {
      replaceNewline(text) {
        // '/':정규표현식의 시작, g:글로벌,전체 즉, 문장의 전체에서 모든 \n을 ''로 대체
        text = text.replace(/\n/g, '<br>');

        // 글자수가 15자 이상인 경우에만 처리
        if (text.length >= 15) {
          // 첫 15자를 가져와서 <br>을 추가한 후, 나머지를 이어붙임
          text = text.substr(0, 15) + '<br>' + text.substr(15);
        }

        return text;
      },
      setRecipe(data) {
      // 검색할 때마다 RecipeList 초기화
      this.RecipeList = [];
      
        for (let i = 1; ; i++) {
          const imgKey = `MANUAL_IMG${i < 10 ? '0' : ''}${i}`;
          const manualKey = `MANUAL${i < 10 ? '0' : ''}${i}`;
  
          // MANUAL_IMG 또는 MANUAL이 하나라도 비어있다면 종료
          if (!data[imgKey] || !data[manualKey]) break;
  
          this.RecipeList.push({
            img: data[imgKey],
            manual: data[manualKey]
          });
        }
  
      }
    },
    data() {
      return {
        isRecipe: false, // 검색한 레시피가 있을 시에만 true
        message: '궁금한 요리를 검색해 보세요!', // 검색하기 전은 default 검색 후 결과가 없을 시 '검색결과가 없습니다.'
        title: { mainImg: '', name: '' },
        RecipeList: [],
      };
    },
  };
</script>
  
<style scoped>
  .contents {
  display: flex;
  flex-direction: column;
  align-items: center;
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
  .manual-text {
    font-size: '16px';
    margin-top: 10px; /* 적절한 여백 추가 */
    font-size: 16px;
    /* 기타 스타일링을 여기에 추가할 수 있습니다. */
  }
</style>