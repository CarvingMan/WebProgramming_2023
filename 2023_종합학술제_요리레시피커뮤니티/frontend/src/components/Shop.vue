<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      width="800"
    >
      <template v-slot:activator="{ props }">
        <v-btn
          color="primary"
          v-bind="props"
          @click="dialog=true"
        >
          재료구매하기
        </v-btn>
      </template>
      <v-card style="background-color: rgb(255, 219, 215)">
        <v-card-title>
          <span class="text-h5">재료 구매하기</span>
        </v-card-title>
        <table border="1">
        <tr v-for = "product in products" :key="product.name"  >
          <td>
            <img :src="product.image">
          </td>
          <td>
            <span style="font-weight: bold;">
              {{ product.title }}
            </span><br>
            <span style="color: red;">
              {{ product.lprice }} 원
            </span>
          </td>
          <td>
            <v-btn @click="openLink(product.link)">구매</v-btn>
          </td>
        </tr>
      </table>
        <v-card-actions>
          <v-overlay :value="loading">
            <v-progress-circular
              indeterminate
              color="my_color1"
              size="70"
            > 
            <span style="font-size: 20px;">로딩중</span>
            </v-progress-circular>
          </v-overlay>
          <v-spacer></v-spacer>
          <v-btn
            color="green-darken-1"
            variant="text"
            @click="dialog = false"
          >
            닫기
          </v-btn>
         
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>



  

<script setup>
  import { ref } from 'vue'

  const dialog = ref(false)
</script>


<script>

  export default {
    name: 'Shop',
    created() {
      //이벤트 구독
      this.$bus.$on('shop', (ingredientList) => {
        this.search(ingredientList);
      });
    },
    methods: {
       search(ingredients) {
        this.products = [];
        this.loading = true;

        for (const ingredient of ingredients) {
            const apiUrl = `/api/naver-search?query=${encodeURIComponent(ingredient)}`;
            this.axios.get(apiUrl)
                .then(response => {
                    const data = response.data.items;
                    if (data && data.length > 0) {
                        for (const item of data) {
                            const object = {
                                title: item.title.replace(/<[^>]*>/g, ''),
                                link: item.link,
                                lprice: item.lprice,
                                image: item.image,
                            };
                            this.products.push(object);
                        }
                    } else {
                        console.error('No items found.');
                    }
                })
                .catch(error => {
                    console.error(error);
                })
                .finally(() => {
                    this.loading = false;
                });
        }
    }
        ,
        openLink(link) { // 새로운 창을 연다.
          window.open(link, '_blank'); //_blank는 새로운 창을 열게하는 매개변수이다.
        },
    },
    data() {
      return {
        products:[], // 상품들을 담을 배열
        dialog: false,
         loading: false, // 로딩 상태를 나타내는 변수
      };
    },
  };
</script>

<style scoped>
  .contents {
  align-items: center;
  text-align: center;
  margin-top: 10px;
}
  img {
    
    max-width: 40px; /* 최대 크기 설정 */
    height: auto; /* 가로 비율에 따라 세로 크기 자동 조정 */
  }
</style>