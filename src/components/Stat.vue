<template>
  <v-container>
    <v-layout row wrap>
      <v-flex class="xs12">
        <h1><small>Статистика</small></h1>
      </v-flex>
      <v-flex class="xs12" v-if="stat">
        <p>Пользователей: {{stat.userCount}}</p>
        <p>Персон: {{stat.personCount}}</p>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axiosInst from '@/utils/axios-instance'

export default {
  name: 'Rods',
  data () {
    return {
      stat: null,
    }
  },
  computed: {
  },
  methods: {
    loadData () {
      axiosInst.get(`/api/stat`)
        .then(resp => {
          this.stat = resp.data.stat;
        }).catch(error => {this.$store.dispatch('axiosErrorHandle', error)});
    },
  },
  created () {
    this.loadData()
  },
}
</script>

<style scoped>
h1 {
  text-align: center
}
</style>
