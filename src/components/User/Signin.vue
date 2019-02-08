<template>
	<v-container>
		<v-layout row v-if="error">
			<v-flex xs12 sm6 offset-sm3>
				<app-alert></app-alert>
			</v-flex>
		</v-layout>

		<v-layout row>
			<v-flex xs12 sm6 offset-sm3>
				<h2 class="mb-4">Вход</h2>
				<form @submit.prevent="signUserIn">
					<v-text-field
							name="email"
							label="e-mail"
							id="email"
							type="email"
							v-model="email"
							required>
					</v-text-field>
					<v-text-field
							name="password"
							label="пароль"
							id="password"
							type="password"
							v-model="password"
							required>
					</v-text-field>
					<v-btn type="submit" class="primary" :loading="loading"
					>
						Войти
						<!-- <span slot="loader" class="custom-loader">
			        <v-icon light>cached</v-icon>
			      </span> -->
					</v-btn>
				</form>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script>
import axiosInst from '@/utils/axios-instance'
import jwtDecode from 'jwt-decode'

export default {
  data () {
    return {
      email: '',
      password: ''
    }
  },
  computed: {
    error () {return this.$store.state.error},
    loading () {return this.$store.state.loading},
		// formIsValid () {
    //   return this.email && this.password
    // },
  },
  methods: {
		signUserIn () {			
      axiosInst.post('/api/user/signin', {email: this.email, password: this.password})
        .then(resp => {
					this.$store.commit('clearError')
          const {authToken, person_key} = resp.data;
          window.localStorage.setItem('authToken', authToken);
          this.$store.commit('setUser', jwtDecode(authToken)); // user object
					// запуск подгрузки родов после авторизации user
					this.$store.dispatch('loadAllRods') //todo? дожидаться ли окончания загрузки родов
          this.$router.push('/tree/' + person_key);
        })
        .catch(error => {this.$store.dispatch('axiosErrorHandle', error)})
    }
  }
}
</script>
