<template>
  <v-container>
    <v-layout row>
      <v-flex v-if="person._key" xs12 sm6 offset-sm3>
        <h1 style="font-size: medium">Добавить <strong>{{reltype | translate('v')}}</strong> для:</h1>
        <p style="font-size: large"><strong>{{person.surname}} {{person.name}} {{person.midname}}</strong></p>
        <v-form ref="addPersonForm" v-model="valid">
          <v-checkbox :label="labelAdopted" v-model="relation.adopted" color="primary"></v-checkbox>

          <person-fields :person="newPerson"></person-fields>

          <v-btn @click.stop="submitAddPerson" class="primary"
					       :disabled="loading" :loading="loading"
          >
						Добавить {{reltype | translate('v')}}
					</v-btn>
        </v-form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axiosInst from '@/utils/axios-instance'
import {translate} from '@/filters'

export default {
  name: 'addPerson',
  props: ['reltype'],
  data () {
    return {
      newPerson: {
        gender: ['mother', 'daughter'].includes(this.reltype) ? 0 : 1
      },
      relation: {
        adopted: false
      },
      test: undefined,
      valid: true
    }
  },
  computed: {
    person () {return this.$store.state.person},
    loading () {return this.$store.state.loading},
    rules () {return this.$store.state.rules},
    labelAdopted () {
      switch (this.reltype) {
        case 'father': return 'приемный отец/отчим';
        case 'mother': return 'приемная мать/мачеха';
        case 'son': return 'приемный сын/пасынок';
        case 'daughter': return 'приемная дочь/падчерица';
      }
    }
  },
  methods: {
    submitAddPerson () {
      if (this.$refs.addPersonForm.validate()) {
        axiosInst.post(`/api/person/${this.person._key}/add/${this.reltype}`, {
          personData: this.newPerson,
          relation: this.relation
        })
        .then(resp => {
          // this.$router.push('/tree/' + resp.data.newPersonKey);
          this.$router.push('/tree/' + this.person._key);
        })
        .catch(error => {this.$store.dispatch('axiosErrorHandle', error)})
      }
		}
  },
	filters: {
    translate
	}
}
</script>
