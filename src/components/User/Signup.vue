<template>
	<v-container>
		<v-layout row v-if="error">
			<v-flex xs12 sm6 offset-sm3>
				<app-alert @dismissed="onDismissed" :text="error.message"></app-alert>
			</v-flex>
		</v-layout>
		<v-layout row>
			<v-flex xs12 sm6 offset-sm3>
				<form @submit.prevent="onSignup">
					<v-text-field
						name="email"
						label="Mail"
						id="email"
						type="email"
						v-model="email"
						required>
					</v-text-field>
					<v-text-field
						name="password"
						label="Password"
						id="password"
						type="password"
						v-model="password"
						required>
					</v-text-field>
					<v-text-field
						name="passwordConfirm"
						label="Password confirm"
						id="passwordConfirm"
						type="password"
						v-model="passwordConfirm"
						:rules="[comparePassRule]">
					</v-text-field>
					<v-btn type="submit"
					       class="primary"
					       :disabled="loading"
					       :loading="loading"
					>
						Sign up
						<span slot="loader" class="custom-loader">
			        <v-icon light>cached</v-icon>
			      </span>
					</v-btn>
				</form>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script>
	export default {
	  data () {
	    return {
	      email: '',
		    password: '',
		    passwordConfirm: ''
	    }
	  },
		computed: {
      formIsValid () {
        return this.email && this.password && this.comparePassRule === true
      },
			comparePassRule () {
	      return this.password !== this.passwordConfirm ? 'Пароли не совпадают' : true
			},
			user () {
			  return this.$store.getters.user
			},
			error () {
        return this.$store.getters.error
			},
      loading () {
        return this.$store.getters.loading
      }
		},
		watch: {
			user (value) {
			  if (value !== null && value !== undefined) {
          this.$router.push('/')
			  }
			}
		},
		methods: {
      onSignup () {        
				this.$store.dispatch('signUserUp', {email: this.email, password: this.password})
      },
			onDismissed () {
				this.$store.commit('clearError')
			}
		}
	}
</script>
