<template>
  <div class="home">

    <div v-if="$apollo.loading" class="lds-ring">
      <div></div><div></div><div></div><div></div>
    </div>
    <div v-else>
      <register-actions :registerActions="registers">
      </register-actions>

    </div>

  </div>
</template>

<script>
// @ is an alias to /src

import RegisterActions from '../components/RegisterActions.vue'
import gql from 'graphql-tag'


export default {
  name: 'Home',
  components: {
    
    RegisterActions
  },

  apollo: {
    registers: {
      query: gql` query {
      registers {
        FIRMA_ID
        NAZWA
        NR_FABRYCZNY
        NR_UNIKAT
        DATA_FISK
        NIP
        NAZWA_FIRMY
        NAZWA_MIEJSCA
        ADDRESS
        NAZWA_AKCJI
        DATA_NAST
        NUMER_CYFRY
        KOMENTARZ
        TEL_KLIENT
        TEL_LOKAL
        MIASTO
      }
    }`,
      pollInterval: 10000
    }
  } 
     

}

</script>


<style scoped>

.home {
  position: -webkit-sticky;
  position: sticky;
  top: 00px;
}


.lds-ring {
  z-index: 100;
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
  top: 35vh;
}
.lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 132px;
  height: 132px;
  margin: 12px;
  border: 8px solid rgb(0, 0, 0);
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: rgb(182, 164, 164) transparent transparent transparent;
}
.lds-ring div:nth-child(1) {
  animation-delay: -0.45s;
}
.lds-ring div:nth-child(2) {
  animation-delay: -0.3s;
}
.lds-ring div:nth-child(3) {
  animation-delay: -0.15s;
}
@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}



</style>