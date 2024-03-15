<template>
    <div>
      <div v-if="isRecipe===false">
        <div style="margin: 50px;">
            <center><h2>{{ message }}</h2></center>
        </div>
      </div>
      <div v-if="isRecipe === true" class="contents">
        <div>
            <h2>{{ title.name }} 의 재료!</h2>
            <img :src="title.mainImg" alt="Main Image">
        </div>
        <div style=" margin-left: 50px;">
          
            <ul>
                <li v-for="(item, index) in ingredients" :key="index">
                {{ item }}
                </li>
            </ul>
        </div>
        <div style="margin-left: 100px;">
              
              <shop/>
           
        </div>
        </div>
    </div>
  </template>
  
  <script setup>
    import { ref } from 'vue'

    const dialog = ref(false)
  </script>

  <script>
  import Shop from './Shop';
 
  export default {
    name: 'Recipe',
    components : {
      Shop,
    },
    created() {
      this.$bus.$on('search', (result) => {
        if (result.RESULT.CODE === 'INFO-000') {
          const data = result.row[0];
          this.title.mainImg = data.ATT_FILE_NO_MAIN;
          this.title.name = data.RCP_NM;
          this.setIngredient(data);
          this.isRecipe = true; // 검색 결과가 있을 때만 true로 설정
          this.message = ''; // 검색 결과가 있으면 메시지를 초기화
        } else {
          this.isRecipe = false;
          this.message = '죄송합니다. 검색 결과가 없으니 다시 검색해 주세요';
        }
      });
    },
  
    methods: {
        setIngredient(data) {
         this.ingredients = this.extractIngredients(data.RCP_PARTS_DTLS);
        },

        extractIngredients(partsDetails) {
            const ingredientsArray = partsDetails.split('\n').map(line => line.trim());

            // '재료' 키워드를 포함하지 않는 요소만 추출
           const array = ingredientsArray.filter(item => !item.includes('재료'));

             // ,를 기준으로 분리된 재료들을 일차 배열로 펼치기
            return array.flat().map(ingredient => ingredient.split(', ')).flat();
            //Array.prototype.flat()은 중첩된 배열을 평평하게 만들어주는 메서드. 
            //이차배열 -> 일차 배열.
        },
        sendIngredients(){
         
          const ingredientList = this.ingredients.map(item => item.replace(/\([^)]*\)/, '').trim());
          /* <정규 표현식 참고용>
              /: 정규표현식 패턴의 시작 및 끝.
              \(: 열린 괄호 ( 참고로 \는 이스케이프 문자를 찾을 때 쓴다고 한다. 
              [^)]*: [^)]는 닫힌 괄호 )를 제외한 모든 문자
              *는 0회 이상 반복, 즉, 닫힌 괄호가 나타날 때까지의 모든 문자열을 찾는다.
              \): 닫힌 괄호 )를 나타냅니다. 
           */
           this.$bus.$emit('shop', ingredientList);
           console.log(ingredientList)
           
        }
    },
    updated(){ //화면 재랜더링 및 갱신 라이프사이클 훅
      this.sendIngredients(); //Shop 컴포넌트에 이벤트 전송
    },
    data() {
      return {
        isRecipe: false, // 검색한 레시피가 있을 시에만 true
        message: '궁금한 요리를 검색해 보세요!', // 검색하기 전은 default 검색 후 결과가 없을 시 '검색결과가 없습니다.'
        title: { mainImg: '', name: '' },
        ingredients: [],
        dialog: false,
        loading: false, // 로딩 상태를 나타내는 변수
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
  </style>