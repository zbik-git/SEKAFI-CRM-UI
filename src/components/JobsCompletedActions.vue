<template>
  <div id="jobs-completed-actions">
    <h1> Przeglądy wykonane [PU-W] </h1>
    <div>yrl{{URLTOKEN}}</div>
    <div>
      <label for="start">Od daty:</label>
      <input type="date" id="start" name="trip-start"
       v-model="tripStart"
       min="2021-07-01" max="2023-12-31"
       >
      <label for="end">Do daty: </label>
      <input type="date" id="end" name="trip-end"
       v-model="tripEnd"
       min="2021-07-01" max="2023-12-31"
       >
    </div>
    <div v-if="response"> <p> response {{ response }} </p> 
    <a :href="response.view_url">FV - podglad </a>
      <button @click="createComment">
        --add FV NUMBER as comment--
      </button>
    </div>
    <div> {{checkedRegisters}} - ilość: <span v-if="checkedRegisters"> {{ checkedRegisters.length }} </span>
    </div>

    <div id="select">
      <select v-model="selected">
        <option v-for="option in filteredUser" v-bind:value="option" v-bind:key="option.client_id">
        {{ option.name.slice(0, 30) }}
        </option>
      </select>
    </div>

    <table class="table-main" >
      <thead class="header">
        <tr>
          <th>NAZWA</th>
          <th>NR_FABRYCZNY</th>
          <th>NR_UNIKAT</th>
          <th>DATA_FISK</th>
          <th>NIP <input type="text" v-model="userSearchQuery"/></th>
          <th>NAZWA_FIRMY</th>
          <th>NAZWA_MIEJSCA <input type="text" v-model="locationName"/></th>
          <th>ADDRESS</th>
          <th>WYKONAL_PRZEGLAD</th>
          <th>USLUGA_WYKONANA</th>
          <th>DATA_WYKONANIA</th>
          <th>KOMENTARZ</th>
          <th>wystaw fv</th>
          <th> wybierz  </th>
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
          <td>{{ register.ADRES }}</td>
          <td>{{ register.WYKONAL_PRZEGLAD }}</td>
          <td>{{ register.USLUGA_WYKONANA }}</td>
          <td>{{ register.DATA_WYKONANIA.slice(0, 10) }}</td>
          <td>{{ register.KOMENTARZ }}</td>
          <td> <button v-on:click="createInvoice()"> ----- FV ----- </button>
                <button v-on:click="getUsers(register.NIP)"> GET USER </button>
          </td>
          <td >
               <!-- <input  type="text" v-model="quantity" style="width: 15px; align-items: center; justify-items: center"/>  -->
               <input type="checkbox" :id="register.NR_UNIKAT" :value="register.NR_UNIKAT" v-model="checkedRegisters" />
          </td>
        </tr>
      </tbody>
      <tfoot class="tfoot"></tfoot>
    </table>
  </div>
</template>

<script>
require('dotenv').config()
import gql from 'graphql-tag'

export default {
  name: "jobs-completed-actions",
  props: {
    finishedJobs: Array,
  },
  data(){
    return{
      userSearchQuery: '',
      locationName: '',
      tripStart: "2021-11-01",
      tripEnd: "2022-12-31",
      response: null,
      users: [],
      filteredUser: [],
      checkedRegisters: [],
      cache: null,
      selected: null,
      quantity: 1
    }
  },
  methods: {

    async createComment() {

      try {
        await this.$apollo.mutate({
          // Query
          mutation: gql`mutation Mutation($fv: String, $noU: [String]) {
            editComments(fv: $fv, noU: $noU) {
              KOMENTARZ
              NR_UNIKAT
            }
          }`,
          // Parameters
          variables: {
            fv: this.response.number,
            noU: this.checkedRegisters
          }
        })

      } catch(e) {
        console.log(e)
      }
    },
    
    createInvoice: async function createInvoice(id) {

      if(confirm("Do you really want to ?")) { 
        const url = process.env.VUE_APP_FAKTUROWNIA_API_URL
        const apiToken = process.env.VUE_APP_FAKTUROWNIA_API_TOKEN
        try {    
          return await fetch(url, {
            body: JSON.stringify({
              api_token: apiToken,
              invoice: {
                kind: "vat", //proforma   vat
                payment_to_kind: 7,
                department_id: 876939,  /// 673231 [1]  876939 [0]
                client_id: this.selected.id,
                seller_person: "Michał Żbik",
                category_id: 96726,
                positions:[{
                  product_id: 100595849, // 37795373  [1]    100595849 [0]
                  quantity: this.checkedRegisters.length,
                  quantity_unit: "szt",
                  description: this.checkedRegisters,
                }]
              }
            }),
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            method: "POST"
          }).then(resp => resp.json()).then(json => this.response = json)
          //return this.response = await resp.json()
        }catch(err){
            console.error(`Error ! ${err}`)
        }finally{ 
          //this.checkedRegisters = []
          alert(`Wystawiono FV ${this.response.view_url}`)         
        }
      }
    },

    getUsers: async function(userNip) {
      
      if(confirm("Do you really want to ?")) {
        this.response = null
        if(this.users.filter(e => e.tax_no === userNip).length > 0){
          this.filteredUser = this.users.filter(e => e.tax_no === userNip)
        }
      }
    },

    paginatedFetch: async function(
      filteredNip = null,
      url = "https://ambergrupa.fakturownia.pl/clients.json?api_token=" + process.env.VUE_APP_FAKTUROWNIA_API_TOKEN,
      page = 1,
      previousResponse = this.users
      ) {
      return fetch(`${url}&page=${page}`) // Append the page number to the base URL
        .then(response => this.users = response.json())
        .then(newResponse => {
          const response = [...previousResponse, ...newResponse]; // Combine the two arrays
          if (newResponse.length !== 0) {
            page++;
            return this.paginatedFetch(filteredNip, url, page, response);
          }
          console.log(response)
          return this.users = response
        });
    }
  },
 
  created() { 
    this.paginatedFetch()
  },
  
  computed: {

    filteredRegisters() {
      if(this.userSearchQuery) {
        return this.finishedJobs?.filter(
        register => this.userSearchQuery ? (register.NIP === this.userSearchQuery && register.DATA_WYKONANIA >= this.tripStart && register.DATA_WYKONANIA <= this.tripEnd ) || register.NIP === this.userSearchQuery2 : register)
      }
      else if(this.locationName){
         return this.finishedJobs?.filter(
           register => (register?.NAZWA_MIEJSCA?.toLowerCase().includes(this.locationName.toLowerCase())) && (register.DATA_WYKONANIA >= this.tripStart && register.DATA_WYKONANIA <= this.tripEnd))
      }
      else{
        return this.finishedJobs?.filter(register => register.DATA_WYKONANIA >= this.tripStart && register.DATA_WYKONANIA <= this.tripEnd)
      }
    }
   }
  }
  
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

#select {
  margin: 25 px;
  padding: 25 px;
}


</style>





