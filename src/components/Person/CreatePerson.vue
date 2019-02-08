<template>
  <v-container>
    <v-layout>
      <v-flex xs12 sm6 offset-sm3>
        <h2>Создать персону</h2>
        <br/>        
        <v-form ref="createPersonForm" v-model="valid">
          <v-text-field
  						name="_key" label="key (id)" type="text"
  						v-model="newPerson._key">
          </v-text-field>

          <v-radio-group v-model="newPerson.gender">
            <v-radio label="Мужчина" :value="1" color="primary"></v-radio>
            <v-radio label="Женщина" :value="0" color="primary"></v-radio>
          </v-radio-group>

          <person-fields :person="newPerson"></person-fields>

          <v-switch label="Пользователь" v-model="isUser" color="primary"></v-switch>
    		  <!-- optional user properties -->
    		  <template v-if="isUser">
            <v-text-field
							type="email" name="email" label="e-mail"
							v-model="userData.email" required
              :rules="[rules.required, rules.email]"
						>
  					</v-text-field>
  					<v-text-field
							name="password"
							label="пароль"
              v-model="userData.password"
							type="password"
							required>
  					</v-text-field>
    		  </template>

          <v-btn @click.stop="submitCreatePerson" class="primary" :loading="loading"> <!-- :disabled="!valid" -->            
						Создать персону
					</v-btn>
        </v-form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axiosInst from '@/utils/axios-instance'

export default {
  name: 'createPerson',
  data () {
    return {
      newPerson: {
        gender: 1
      },
	    isUser: false,
      userData: {},
      valid: true
    }
  },
  computed: {
    loading () {return this.$store.state.loading},
    rules () {return this.$store.state.rules}
  },
  methods: {    
    submitCreatePerson: function () {
      if (this.$refs.createPersonForm.validate()) {
        axiosInst.post(`/api/person/create`, {
          personData: this.newPerson,
          isUser: this.isUser,
          userData: this.userData
        }) // config
        .then(resp => {
          this.$router.push('/tree/' + resp.data.newPersonKey)
        })
        .catch(error => {this.$store.dispatch('axiosErrorHandle', error)})
      }
		}
  }
}
</script>
