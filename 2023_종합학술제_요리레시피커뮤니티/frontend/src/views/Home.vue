<template>
  <div class="home">
    <v-carousel :showArrows="true"
    cycle
    height="480"
    hide-delimiter-background
    show-arrows="hover">
    <v-carousel-item
      v-for="(item,i) in items"
      :key="i"
      :src="item.src"
      
    ></v-carousel-item>
  </v-carousel>
  </div>
</template>
<script>



export default {
  name: 'App',
  components: {
    
  },
  data(){
    return {
        items: [
          {
            src: 'https://img-cf.kurly.com/shop/data/goodsview/20220314/gv20000288769_1.jpg',
          },
          {
            src: 'https://static.toiimg.com/thumb/82085026.cms?resizemode=4&width=1200',
          },
          {
            src: 'https://recipe1.ezmember.co.kr/cache/recipe/2018/08/07/3bb8e32ea170ebf850a9bb31aa23e1121.jpg',
          },
          {
            src: 'https://img-cf.kurly.com/shop/data/goodsview/20200528/gv10000097809_1.jpg',
          },
        ],
      }
  },
  methods:{
  
  }
}
</script>
