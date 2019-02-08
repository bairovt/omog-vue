<template>
  <v-card>
    <v-card-title>
      Соединение персон
    </v-card-title>
    <v-card-text>
      <p>
        <strong>{{person.surname}} {{person.name}} {{person.midname}}</strong>
      </p>
      является (указать):
      <v-radio-group v-model="reltype" row>
        <v-radio label="родителем" value="parent" color="primary" required></v-radio>
        <v-radio label="ребенком" value="child" color="primary"></v-radio>
      </v-radio-group>
      <v-checkbox label="приемный/отданный" v-model="adopted" color="primary"></v-checkbox>
      для: <br />
      <strong v-if="personForRel">{{personForRel.surname}} {{personForRel.name}} {{personForRel.midname}}</strong>
      <v-btn @click.stop="resetPersonForRel">сбросить</v-btn>
    </v-card-text>

    <v-card-actions>
      <v-btn @click.stop="relate" class="primary"
      :disabled="loading || (reltype !== 'parent' && reltype !== 'child')" :loading="loading">
        Установить связь
        <span slot="loader" class="custom-loader">
          <v-icon light>cached</v-icon>
        </span>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn @click.stop="reltype=null; $store.state.relateDialog=false">Отмена</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import axiosInst from '@/utils/axios-instance'
import {translate} from '@/filters'

export default {
  name: 'RelateDialog',
  data () {
    return {
	    reltype: null,
      adopted: false
    }
  },
  computed: {
    person () {return this.$store.state.person},
    personForRel () {return this.$store.state.personForRel},
    loading () {return this.$store.state.loading},
    rules () {return this.$store.state.rules}
  },
  methods: {
    relate () {
      axiosInst.post('/api/child/set_relation', {
        start_key: this.person._key,
        end_key: this.personForRel._key,
	      reltype: this.reltype,
        adopted: this.adopted
      })
	      .then(resp => {
          this.$store.commit('setPersonForRel', null)
          this.$store.state.relateDialog = false	        
	        this.$emit('related')
	      })
	      .catch(error => {this.$store.dispatch('axiosErrorHandle', error)})
		},
    resetPersonForRel () {
      this.reltype=null
      this.$store.commit('setPersonForRel', null)
      this.$store.state.relateDialog = false
    }
  },
  filters: {
    translate
  }
}
</script>
