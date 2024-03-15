<template>
    <div class="my-custom-container text-center">
      <v-container fluid>
        <h2>전체공지</h2>
        <v-row>
          <v-col cols="12" class="d-flex">
            <v-text-field v-model="searchText" label="회원에게 전체공지가 가능합니다." filled solo class="mx-2"></v-text-field>
            <v-btn @click="send" style="border-radius: 50; margin-top: 5px; width: 100px; height: 60px; background-color: rgb(247, 195, 160);">전송</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </template>
  
  <script>
  export default {
    name: 'sendMessage',
    data() {
      return {
        searchText: '',
      };
    },
    methods: {
      send() {
        this.axios.post('http://localhost:8000/sendMSG', { 
            message: this.searchText
          }, { withCredentials: true })
          .then((res) => {
            this.searchText = null;
          })
          .catch((err) => {
            alert('에러 발생: ' + err);
          });
      },
    },
  };
  </script>
  
  <style scoped>
  .my-custom-container {
    background-color: #FCA096;
    width: 100%;
  }
  
  .v-text-field {
    max-width: 800px;
    border-radius: 30px;
    margin: 0 auto;
  }
  
  .v-btn {
    border-radius: 50px; /* Adjust the border-radius as needed */
  }
  </style>