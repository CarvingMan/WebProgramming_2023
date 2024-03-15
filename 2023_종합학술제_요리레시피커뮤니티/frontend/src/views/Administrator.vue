<template>
    <div class="administrator">
      <div class ='head'>
        <h1>관리자 페이지</h1>
        <hr>
      </div>
     <div class="body">
      <table>
        <tr max-width="700px">
          <td>
            <user-table/>
          </td>
          <td>
            <admin-board/>
          </td>
        </tr>
        <tr>
          <td colspan="2">
            <send-message/>
          </td>
        </tr>
      </table>
     </div>

    </div>
  </template>
  
  <script>
  import UserTable from '../components/UserTable';
  import AdminBoard from '../components/AdminBoard';
  import SendMessage from '../components/SendMessage';
  //import Notice from '../components/Notice';

  export default {
    // 관리자 전용 컴포넌트의 로직 추가
    name: 'administrato',
    components: {
      UserTable,
      AdminBoard,
      SendMessage,
      //Notice,
      
    },
    data() {
      return {
        
      };
    },
  }
  </script>
  
  <style scoped>
  .head{
    background-color: rgb(251, 174, 165);
  }
   .body{background-color: rgb(246, 212, 209);}
  </style>