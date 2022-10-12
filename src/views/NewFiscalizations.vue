<template>
  
 <div>

   <div v-if="$apollo.loading" class="lds-ring">
       <div></div><div></div><div></div><div></div>
    </div>

    <div v-else>
      <div class="new-fiscalizations">
        <new-fiscalizations-list :newFiscalizations="newFiscalizations" />
      </div>
    </div>

 </div>
</template>

<script>

import gql from 'graphql-tag'
import NewFiscalizationsList from '../components/NewFiscalizationsList.vue';

export default {
    name: "new-fiscalizations",
  components: {
   
    NewFiscalizationsList

  },
  data() {
    return {
      
    }
  },
     apollo: {
      newFiscalizations: {
      query: gql`  query {
      
      newFiscalizations {
        NAZWA
        NR_FABRYCZNY
        NR_UNIKAT
        NIP
        NAZWA_FIRMY
        NAZWA_MIEJSCA
        ADRES
        WYKONAL_FISKALIZACJE
        USLUGA_WYKONANA
        DATA_WYKONANIA
        KOMENTARZ
        OPIS
        KOMENTARZ
  
      }
    }`,
      pollInterval: 10000
     }
    } 
  }
;

</script>

<style scoped>

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