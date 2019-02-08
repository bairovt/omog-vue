<template>
	<v-alert v-if="error" type="error" dismissible @input="onClose" :value="true">
		{{ error.text }}
	</v-alert>
</template>

<script>
	export default {
	  computed: {
			error () {return this.$store.state.error}
		},
		methods: {
			onClose () {
				this.$store.commit('clearError')
			}
		}
	}

</script>
