import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: { // 테마색상 설정
          light: {
            
            my_color1: '#FF8A7D',
            my_color2: '#FCA096',
            my_color3: '#EE9288',
            my_color4: '#EFB2AB'

          },
        },
      },
});
