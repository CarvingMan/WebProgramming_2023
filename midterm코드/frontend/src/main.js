import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import vuetify from './plugins/vuetify'

Vue.use(VueAxios,axios)
/*Vue.use(VueAxios, axios)를 사용하여 Vue 애플리케이션에서 Axios를 사용할 수 있도록 설정합니다.
 이렇게 하면 Vue 인스턴스 내부에서 Axios를 사용할 수 있게 됩니다. */

Vue.config.productionTip = false
/*
Vue.config.productionTip = false를 사용하여 Vue 개발 모드 품질 힌트를 비활성화한다.
 이렇게 하면 프로덕션 환경에서는 불필요한 콘솔 메시지가 표시되지 않는다고 한다.
*/

//Vue.prototype.$bus = new Vue();
//위와 같은 방법으로도 이벤트 버스를 생성할 수 있으나 따로 js코드로 나누었다.

new Vue({
  vuetify,
  render: h => h(App),
}).$mount('#app')
/*
render 함수를 사용하여 앱의 루트 컴포넌트를 렌더링
  -참고-
  h => h(App): render 옵션은 함수를 받으며, 이 함수는 뷰 렌더링을 수행합니다.
  h (hypothesis) 매개변수는 렌더링 함수를 나타냅니다.
  이 함수는 Vue 애플리케이션의 가상 DOM을 생성하고 반환합니다.
  렌더링 함수 h는  가상 DOM 요소를 생성하는 역할을 한다고 한다.

 .mount('#app')를 사용하여 렌더링된 앱을 HTML 문서 내의 #app 엘리먼트에 마운트.

 루프 컴포넌트 애플리케이션의 최상위 컴포넌트
*/