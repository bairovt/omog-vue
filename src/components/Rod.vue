<template>
  <v-container>
    <v-layout row>
      <v-flex xs12>
        <h2>{{rod.name}}</h2>
        <h3>{{rod.about}}</h3>
        <persons-list :persons="persons" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axiosInst from '@/utils/axios-instance'

export default {
  name: 'rods',
  props: ['_key'],
  data () {
    return {
      rod: {},
      persons: []
    }
  },
  methods: {
    loadData () {
      axiosInst.get(`/api/rod/${this._key}/persons`)
        .then(resp => {
          this.rod = resp.data.rod;
          this.persons = resp.data.persons;
        })
        .catch(error => {this.$store.dispatch('axiosErrorHandle', error)})
    }
  },
  created () {
    this.loadData()
  },
  watch: {
    '$route': 'loadData'
  }
}
</script>
