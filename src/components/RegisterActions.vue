<template>
  <div id="register-actions">
    <h1>Kasy do przeglądu [PU-A]</h1>

    <!-- <form class="search-form" >
    <label> ...NIP</label>
    <input 
    type="text"
    
    /> -->
   
    <div>
      <label for="start">Od daty:</label>
      <input type="date" id="start" name="trip-start"
       v-model="tripStart"
       min="2021-05-01" max="2029-12-31">

      <label for="end">Do daty: </label>
      <input type="date" id="end" name="trip-end"
       v-model="tripEnd"
       min="2021-11-01" max="2029-12-31">

      <span> [PU POZA WARSZAWĄ] <input type="checkbox" id="isNotWarsaw" v-model="isNotWarsaw"> </span>

    

    </div>

    <table class="table-main">
      <thead class="header">
        <tr>
          <th>NAZWA</th>
          <th>NR_FABRYCZNY</th>
          <th>NR_UNIKAT</th>
          <th>DATA_FISK</th>
          <th>NIP <input type="text" v-model="userSearchQuery"/></th>
          <th>NAZWA_FIRMY</th>
          <th>NAZWA_MIEJSCA <input type="text" v-model="locationName" /></th>
          <th>ADRES  </th>
          <th>MIASTO <input type="text" v-model="city"/></th>
          <th>NAZWA_AKCJI</th>
          <th>DATA_PRZEGLADU</th>
          <th>KOMENTARZ</th>
          <th>TEL_KLIENT</th>
          <th>TEL_LOKAL</th>
       
        </tr>
      </thead>
      <tbody id="products-table">
        <tr v-for="register in filteredRegisters" :key="register.NR_UNIKAT">
          <td>{{ register.NAZWA }}</td>
          <td>{{ register.NR_FABRYCZNY }}</td>
          <td>{{ register.NR_UNIKAT }}</td>
          <td>{{ register.DATA_FISK.slice(0, 10) }}</td>
          <td>{{ register.NIP }}</td>
          <td>{{ register.NAZWA_FIRMY }}</td>
          <td>{{ register.NAZWA_MIEJSCA }}</td>
          <td>{{ register.ADDRESS ? register.ADDRESS : "--"}}</td>
          <td>{{ register.MIASTO }}</td>
          <td>{{ register.NAZWA_AKCJI }}</td>
          <td>{{ new Date(register.DATA_NAST).toLocaleDateString("af") }}</td>
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
          <td>{{ register.TEL_KLIENT }}</td>
          <td>{{ register.TEL_LOKAL }}</td>

       
        </tr>
      </tbody>
      <tfoot class="tfoot"></tfoot>
    </table>
  </div>
</template>

<script>
import gql from 'graphql-tag'
export default {
  name: "registers-action",
  props: {
    registerActions: Array,
  },

  data() {
    return {
     
      userSearchQuery: '',
      userSearchQuery2: '',
      locationName: '',
      currentDate: null,
      tripStart: new Date().toLocaleDateString("af"), //af , fr-CA
									
      tripEnd: "",
      isNotWarsaw: true,
      city:"",
      isEditing: "",
      isEditingText: [],
   
   
      
    
    }
  },


  computed: {

     filteredRegisters() {
      return this.registerActions?.filter((register) => {
          if(this.userSearchQuery) {
              return register.NIP === this.userSearchQuery
          } else {
              return true
          }
      }).filter((register) => {
          if(this.locationName) {
              return register.NAZWA_MIEJSCA?.toLowerCase().includes(this.locationName.toLowerCase())
          } else {
              return true
          }
      }).filter((reg) => this.tripStart && this.tripEnd && reg.DATA_NAST >= this.tripStart && reg.DATA_NAST <= this.tripEnd)
        .filter((reg) => this.city ? reg.MIASTO.toLowerCase().includes(this.city.toLowerCase()) : true)
        .filter((reg) => this.isNotWarsaw ? reg.MIASTO !== "Warszawa" : true)

    
  }}
  
  ,methods: {



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

     
    setTripEnd() {
      let date_now = new Date()
      date_now.setDate(date_now.getDate() + 90)
      let out = new Date(date_now).toLocaleDateString("af")
      this.tripEnd = out
    },
  
  },
  mounted() {
  this.setTripEnd()
  this.city = this.$route.query.city || ""
  this.isNotWarsaw = this.$route.query.noWarsaw || ""
  console.log("actions", process.env.VUE_APP_GRAPHQL_HTTP)
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

.table-main {
  position: relative;
}
.header {
  position: -webkit-sticky;
  position: sticky;
  top: 00px;


}

table,
th,
td {
  padding: 5px;
  text-align: center;
  border: 2px solid black;
  border-collapse: collapse;
}

#products-table {

  width: auto;
  height: auto;
  overflow:scroll;
}
</style>
