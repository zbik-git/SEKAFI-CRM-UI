<template>
  <div id="registers-deregistering">
    <h1>Odczyt Likwidacyjny [O]</h1>

    <div v-if="$apollo.loading">Loading...</div>
    <div>
     {{ isEditingBox }}
    </div>
    <table>
      <thead class="header">
        <tr>
          <th>NAZWA</th>
          <th>NR_FABRYCZNY</th>
          <th>NR_UNIKAT</th>
          <th>DATA_FISK</th>
          <th>NIP <input type="text" v-model="userSearchQuery"/></th>
          <th>NAZWA_FIRMY</th>
          <th>NAZWA_MIEJSCA
            <input type="text" v-model="locationName" />
          </th>
          <th>ADRES</th>
          <th>NR_ODCZYTU</th>
          <th>DATA_WYDANIA <input type="checkbox" id="isCompleted" v-model="isCompleted"></th>
          <th>NR_FAKTURY</th>
          <th>RECYKLING  </th>
          <th>R_DAT</th>
          <th>NR PACZKI <input type="text" v-model="boxNumber"/></th>
        </tr>
      </thead>
      <tbody>
        <tr :class="register.DATA_WYDANIA !== '--' ? 'closed-device' : ''" v-for="register in userSerchRegisterList" :key="register.AKCJA_ID">
          <td>{{ register.NAZWA }}</td>
          <td>{{ register.NR_FABRYCZNY }}</td>
          <td>{{ register.NR_UNIKAT }}</td>
          <td>{{ register.DATA_FISK.slice(0, 10) }}</td>
          <td>{{ register.NIP }}</td>
          <td>{{ register.NAZWA_FIRMY }}</td>
          <td>{{ register.NAZAWA_LOKALU }}</td>
          <td>{{ register.ADRES_LOKALU }}</td>
          <td>{{ register.NR_ODCZYTU }}</td>

          <td>
            <div v-if="register.DATA_WYDANIA !== '--'">
              {{ register.DATA_WYDANIA.slice(0, 10)  }}  
              <!-- ? register.DATA_WYDANIA.slice(0, 10) : "--" -->
            </div>
            <div v-else>
              <button @click="setEndingDate(register.NR_UNIKAT)"> set </button>
            </div>
          
          </td>
          
          <td >
            
            
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
                <div> {{ register.NR_FAKTURY }} </div>
                <div v-if="isEditingText.length < '1'">
                  
                  <input type="checkbox" :id="register.NR_UNIKAT" :value="register.NR_UNIKAT" v-model="isEditingText">

                </div>
              </div>
            </div>
        </td>

          <td>
              <div >
                {{ register.RECYKLING }}
              </div>

              <div >

                <button @click="setRecyclingPlan(register.NR_UNIKAT)">
                   set 
                </button>
              </div>
        
            
          
          
          
          </td>
          <td>{{ register.R_DAT? register.R_DAT.slice(0, 10) : "--" }}</td>
          
          <td >
            
            
            <div>
              <div v-if="isEditingTextBox == register.NR_UNIKAT">
                <input 
                type="text" 
                v-model="isEditingBox"
                ref="boxRef"
                
                
                />
                <button @click="(()=> isEditingTextBox = [])">
                cancel
                </button>
                <button @click="editTextBox">
                  save
                </button>
              </div>
           
              <div v-else>
                <div> {{ register.TRESC_OSTRZEZENIA }} </div>
                <div v-if="isEditingTextBox.length < '1'">
                  
                  <input type="checkbox" :id="register.NR_UNIKAT" :value="register.NR_UNIKAT" v-model="isEditingTextBox">

                </div>
              </div>
            </div>
        </td>
         
        </tr>
      </tbody>
      <tfoot class="tfoot"></tfoot>
    </table>
  </div>
</template>

<script>
import gql from 'graphql-tag'

export default {
  name: "registers-deregistering",
  props: {
    closeRegistersLists: Array,
        
  },
  data() {
    return {
      userSearchQuery: '',
      boxNumber: 'X-',
      isCompleted: false,
      isEditingText: [],
      isEditingTextBox: [],
      isEditing: '',
      isEditingBox: '',
      comment: [],
      locationName: '',
      edit: "test"
   
     
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
    
    

    async editTextBox() {
      
      try {
        await this.$apollo.mutate({
          // Query
          mutation: gql`mutation Mutation($uText: String, $noU: String) {
            updateTextBox(uText: $uText, noU: $noU) {
              KOMENTARZ
              NR_UNIKAT
            }
          }`,
          // Parameters
          variables: {
            uText: this.isEditingBox,
            noU: this.isEditingTextBox[0],
          }
          
        })

      } catch(e) {

        console.log(e)
      }
     
      this.isEditingBox = ''
      this.isEditingTextBox = []
    },
    async setEndingDate(noU) {
      
      try {
        await this.$apollo.mutate({
          // Query
          mutation: gql`mutation SetEndingDate($noU: String) {
            setEndingDate(noU: $noU) {
              KOMENTARZ
              NR_UNIKAT
            }
          }`,
          // Parameters
          variables: {

            noU: noU,
          }
          
        })

      } catch(e) {

        console.log(e)
      }
     
     
    },

    async setRecyclingPlan(noU) {
      
      try {
        await this.$apollo.mutate({
          // Query
          mutation: gql`mutation SetRecyclingPlan($noU: String) {
            setRecyclingPlan(noU: $noU) {
              KOMENTARZ
              NR_UNIKAT
            }
          }`,
          // Parameters
          variables: {

            noU: noU,
          }
          
        })

      } catch(e) {

        console.log(e)
      }
     
     
    }


  },
  computed: {


    userSerchRegisterList() {
      return this.closeRegistersLists?.filter((register) => {
          if(this.userSearchQuery) {
              return register.NIP == this.userSearchQuery
          } else {
              return true
          }
      }).filter((register) => {
          if(this.boxNumber) {
              return register.TRESC_OSTRZEZENIA?.toLowerCase().includes(this.boxNumber.toLowerCase())
          } else {
              return true
          }
      })
      .filter((register) => {
          if(this.locationName) {
              return register.NAZAWA_LOKALU?.toLowerCase().includes(this.locationName.toLowerCase())
          } else {
              return true
          }
      }).filter((reg) => this.isCompleted ? reg.DATA_WYDANIA == "--" : true)
       
        //  return this.closeRegistersLists?.filter(register => this.userSearchQuery ? register.NIP === this.userSearchQuery : true) 
        //  .filter(register => this.boxNumber ? register?.TRESC_OSTRZEZENIA?.includes(this.boxNumber) : true)
    
    
    }
  }
};

</script>

<style scoped>



/* th {
  background-color: lightslategray;
  font-weight: 600;
}

table tr:nth-child(even) {
  background: rgb(223, 215, 215);
} */

.closed-device {
  background-color: rgb(143, 125, 125);

}

.search-form {
  padding: 20 px;
  margin: 30 px;
  
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
  background-color: lightslategrey;


}


</style>
