<template>
  <div>
    <div class="mb-3">
			<!-- @mousedown.prevent чтобы предотвратить потерю фокуса с поля ввода спецсимвола -->
      <v-btn
        v-for="char in specialChars"
        :key="char"
        small
        class="special-char-btn"
        @mousedown.prevent="insertCharacter(char)"
        :disabled="!focusedElement"
      >
        {{ char }}
      </v-btn>
    </div>

    <v-text-field
      name="name"
      label="Имя"
      type="text"
      :autofocus="true"
      v-model="person.name"
      :rules="[rules.required]"
      required
      @focus="handleFocus"
      ref="name"
    ></v-text-field>

    <v-text-field
      name="surname"
      label="Фамилия"
      type="text"
      v-model="person.surname"
      @focus="handleFocus"
      ref="surname"
    ></v-text-field>

    <v-text-field
      name="midname"
      label="Отчество"
      type="text"
      v-model="person.midname"
      @focus="handleFocus"
      ref="midname"
    ></v-text-field>

    <v-text-field
      v-if="person.gender === 0"
      name="maidenName"
      label="Девичья фамилия"
      type="text"
      v-model="person.maidenName"
      @focus="handleFocus"
      ref="maidenName"
    ></v-text-field>

    <v-autocomplete
      :items="rods"
      v-model="person.rod"
      label="Род"
      item-text="name"
      item-value="_id"
      menu-props="auto"
      chips
      dense
      clearable
    ></v-autocomplete>

    <v-btn small @click.prevent="lifetime = !lifetime">Годы жизни</v-btn>
    <v-container class="pa-0" v-if="lifetime">
      <v-layout>
        <v-flex xs5 sm3>
          <v-text-field
            label="год рожд-я"
            v-model="person.born"
            mask="####"
          ></v-text-field>
        </v-flex>
        <v-flex xs1 sm2></v-flex>
        <v-flex xs5 sm3>
          <v-text-field
            label="год ухода из жизни"
            v-model="person.died"
            mask="####"
          ></v-text-field>
        </v-flex>
      </v-layout>
    </v-container>

    <v-textarea
      v-if="info"
      id="info"
      name="info"
      label="Информация"
      type="text"
      v-model="person.info"
      @focus="handleFocus"
      ref="info"
    ></v-textarea>
  </div>
</template>

<script>
export default {
  data() {
    return {
      lifetime: false,
      specialChars: ['Ө', 'ө', 'Ү', 'ү', 'Һ', 'һ'],
      focusedElement: null,
      allowedFields: ['name', 'surname', 'midname', 'maidenName', 'info'],
    };
  },
  props: {
    person: {
      type: Object
    },
    info: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    rods() {
      const flatRods = [];
      for (let rod of this.$store.state.rods) {
        flatRods.push({
          name: rod.name,
          _key: rod._key,
          _id: rod._id
        });
        for (let subrod of rod.subrods) {
          flatRods.push({
            name: subrod.name,
            _id: subrod._id
          });
        }
      }
      return flatRods;
    },
    rules() {
      return this.$store.state.rules;
    }
  },
  methods: {
    handleFocus(event) {
      this.focusedElement = event.target;
    },
    insertCharacter(char) {
      if (!this.focusedElement) return;

			const element = this.focusedElement;
      const start = element.selectionStart;
      const end = element.selectionEnd;

			// Get the field name from the element's name attribute
      const fieldName = element.name;

      // Get the current value
			let value = this.person[fieldName] || '';

			// Create the new value with the character inserted at the cursor position
			const newValue = value.substring(0, start) + char + value.substring(end);

			// Update the model
			this.$set(this.person, fieldName, newValue);

      // Set the cursor position after the inserted character
			this.$nextTick(() => {
        element.setSelectionRange(start + 1, start + 1);
        element.focus();
      });
    }
  },
  mounted() {
    // Добавляем глобальный обработчик фокуса
    document.addEventListener('focusin', (e) => {
      if (this.allowedFields.includes(e.target.name)) {
        this.focusedElement = e.target;
      } else {
				this.focusedElement = null;
			}
    });
  },
  beforeDestroy() {
    // Удаляем глобальный обработчик
    document.removeEventListener('focusin', this.handleFocus);
  }
};
</script>

<style scoped>
.special-char-btn {
  min-width: 24px !important;
  width: 25px !important;
  padding: 0 !important;
}
</style>