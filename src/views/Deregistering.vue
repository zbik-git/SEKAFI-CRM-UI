<template>


    <div>

        <div v-if="$apollo.loading" class="lds-ring">
          <div></div><div></div><div></div><div></div>
        </div>

        <div v-else>
        <div class="deregistering">
          <registers-deregistering v-if="closeRegistersLists" :closeRegistersLists="closeRegistersLists">
          </registers-deregistering>
        </div>

      </div>
    </div>

</template>

<script>
import RegistersDeregistering from '../components/RegistersDeregistering.vue';
import gql from 'graphql-tag'

export default {
    name: "deregistering",
  components: {
    RegistersDeregistering

  },
  data() {
    return {
            
    }
  },
  apollo: {
    closeRegistersLists: {
    query: gql` query {
      closeRegistersLists {
        NAZWA
        NR_FABRYCZNY
        NR_UNIKAT
        DATA_FISK
        NIP
        NAZWA_FIRMY
        NAZAWA_LOKALU
        ADRES_LOKALU
        NR_ODCZYTU
        DATA_WYDANIA
        NR_FAKTURY
        RECYKLING
        R_DAT
        TRESC_OSTRZEZENIA
        AKCJA_ID
      }
    }`,
      pollInterval: 30000,
      
    }
  },
  
  
  
};
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