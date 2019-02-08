<template>
  <v-container class="pa-0">
    <v-layout row wrap>
      <v-flex xs12>
        <form @submit.prevent="find">
          <v-container>
            <v-layout row wrap>
              <v-flex xs0 sm1></v-flex> <!-- отступ -->
              <v-flex xs12 sm8>
        				<v-text-field autofocus clearable label="Поиск по ФИО"
        					v-model="search">
        				</v-text-field>
        			</v-flex>
              <v-flex xs4 sm2>
        				<v-btn type="submit" class="primary" :loading="loading">
                  Найти                  
                </v-btn>
        			</v-flex>
            </v-layout>
          </v-container>
        </form>
      </v-flex>

      <v-flex xs12>
        <persons-list v-if="persons.length" :persons="persons" />
        <p class="text-xs-center" v-if="noResults">Не найдено</p>
      </v-flex>
      
    </v-layout>
  </v-container>
</template>

<script>
import axiosInst from '@/utils/axios-instance'

export default {
  name: 'all-persons',
  data () {
    return {
      persons: [],
      search: '',
      noResults: false
    }
  },
  computed: {
    loading () {return this.$store.state.loading},
  },
  methods: {
    find () {      
      this.noResults = false
      axiosInst.get('/api/person/find/' + this.search.trim())
        .then(resp => {          
          this.persons = resp.data.persons;
          if (!this.persons.length) this.noResults = true
        })
        .catch(error => {this.$store.dispatch('axiosErrorHandle', error)})
    }
  }
}
</script>
