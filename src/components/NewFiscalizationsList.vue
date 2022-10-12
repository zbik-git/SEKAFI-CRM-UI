<template>
  <div id="new-fiscaliztions-list">
    <h1> Nowe instalacje [F]</h1>

      
    <div>
      <label for="start">Od daty:</label>
      <input type="date" id="start" name="trip-start"
       v-model="tripStart"
       min="2021-07-01" max="2023-12-31">

      <label for="end">Do daty: </label>
      <input type="date" id="end" name="trip-end"
       v-model="tripEnd"
       min="2021-07-01" max="2023-12-31">



    </div>
    
 
    <table>
      <thead class="header">
        <tr>
          <th>NAZWA</th>
          <th>NR_FABRYCZNY</th>
          <th>NR_UNIKAT</th>
          <th>NIP <input type="text" v-model="userSearchQuery"/></th>
          <th>NAZWA_FIRMY</th>
          <th>NAZWA_MIEJSCA <input type="text" v-model="locationName"/></th>
          <th>ADRES</th>
          <th>WYKONAL_FISKALIZACJE</th>
         
          <th>USLUGA_WYKONANA</th>
          <th>DATA_WYKONANIA</th>
          <th>fv </th>
          <th>KODY </th>
   
       
        </tr>
      </thead>
      <tbody>
        <tr v-for="register in filteredRegisters" :key="register.NR_UNIKAT">
          <td>{{ register.NAZWA }}</td>
          <td>{{ register.NR_FABRYCZNY }}</td>
          <td>{{ register.NR_UNIKAT }}</td>
          <td>{{ register.NIP }}</td>
          <td>{{ register.NAZWA_FIRMY }}</td>
          <td>{{ register.NAZWA_MIEJSCA }}</td>
          <td>{{ register.ADRES }}</td>
          <td>{{ register.WYKONAL_FISKALIZACJE}}</td>
          <td>{{ register.USLUGA_WYKONANA }}</td>
          <td>{{ register.DATA_WYKONANIA.slice(0, 10)}}</td>
          <td>
            
            
            <div>
              <div v-if="isEditingText == register.NR_UNIKAT">
                <input 
                type="text" 
                v-model="isEditing" 
                
                
                />
                <button @click="(()=> isEditingText = [])">
                cancel
                </button>
                <button @click="editText">
                  save
                </button>
              </div>
           
              <div v-else>
                <div> {{ register.KOMENTARZ }} </div>
                <div v-if="isEditingText.length < '1'">
                  
                  <input type="checkbox" :id="register.NR_UNIKAT" :value="register.NR_UNIKAT" v-model="isEditingText">

                </div>
              </div>
            </div>
          
          
        
          </td>
          <td>{{ convertToPlain(register.OPIS) }}</td>
          
          

       
        </tr>
      </tbody>
      <tfoot class="tfoot"></tfoot>
    </table>
  </div>
</template>

<script>

import gql from 'graphql-tag'
export default {
  name: "new-fiscaliztions-list",
  props: {
    newFiscalizations: Array,

  },
  data(){
    return{
      userSearchQuery: '',
      locationName: '',
      tripStart: "2021-11-01",
      tripEnd: "2022-12-31",
      isEditing: "",
      isEditingText: []
    }
  },



  methods: {

    async editText() {
      try {
        await this.$apollo.mutate({
          // Query
          mutation: gql`mutation Mutation($uText: String, $noU: String) {
            updateText(uText: $uText, noU: $noU) {
              KOMENTARZ
              NR_UNIKAT
            }
          }`,
          // Parameters
          variables: {
            uText: this.isEditing,
            noU: this.isEditingText[0],
          }
          
        })

      } catch(e) {

        console.log(e)
      }
     
      this.isEditing = ''
      this.isEditingText = []
    },


    convertToPlain(rtf) {
      if (rtf) {
        rtf = rtf.replace(/\\par[d]?/g, "")
        return rtf.replace(/\{\*?\\[^{}]+}|[{}]|\\\n?[A-Za-z]+\n?(?:-?\d+)?[ ]?/g, "").trim()

      }
      else {
        return null
      }
    
    }

  },
  computed: {
      filteredRegisters() {
      if(this.userSearchQuery) {
        return this.newFiscalizations?.filter(
        register => this.userSearchQuery ? (register.NIP === this.userSearchQuery && register.DATA_WYKONANIA >= this.tripStart && register.DATA_WYKONANIA <= this.tripEnd ) || register.NIP === this.userSearchQuery2 : register)
        
        
      }

      else if(this.locationName){
         return this.newFiscalizations?.filter(
           register => (register?.NAZWA_MIEJSCA?.toLowerCase().includes(this.locationName.toLowerCase())) && (register.DATA_WYKONANIA >= this.tripStart && register.DATA_WYKONANIA <= this.tripEnd))
      }
      else{
        return this.newFiscalizations?.filter(register => register.DATA_WYKONANIA >= this.tripStart && register.DATA_WYKONANIA <= this.tripEnd)
      }

    }
  }
  
   
};
</script>

<style scoped>
th {
  background-color: lightslategray;
  font-weight: 600;
}

table tr:nth-child(even) {
  background: rgb(223, 215, 215);
}

table,
th,
td {
  padding: 5px;
  text-align: center;
  border: 2px solid black;
  border-collapse: collapse;
}


.header {
  position: -webkit-sticky;
  position: sticky;
  top: 00px;


}
</style>
