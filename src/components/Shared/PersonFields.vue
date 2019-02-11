<template>
  <div>
    <p>Ө ө Ү ү Һ һ</p>

    <v-text-field
      name="name"
      label="Имя"
      type="text"
      :autofocus="true"
      v-model="person.name"
      :rules="[rules.required]"
      required
    ></v-text-field>

    <v-text-field name="surname" label="Фамилия" type="text" v-model="person.surname"></v-text-field>

    <v-text-field name="midname" label="Отчество" type="text" v-model="person.midname"></v-text-field>

    <v-text-field
      v-if="person.gender === 0"
      name="maidenName"
      label="Девичья фамилия"
      type="text"
      v-model="person.maidenName"
    ></v-text-field>

    <v-autocomplete
      :items="rods"
      v-model="person.rod"
      label="Род"
      item-text="name"
      item-value="_id"
      menu-props="auto"
      chips
      clearable
    ></v-autocomplete>

    <v-btn small @click.prevent="lifetime = !lifetime">Годы жизни</v-btn>
    <v-container class="pa-0" v-if="lifetime">
      <v-layout>
        <v-flex xs5 sm3>
          <v-text-field label="год рожд-я" v-model="person.born" mask="####"></v-text-field>
        </v-flex>
        <v-flex xs1 sm2></v-flex>
        <v-flex xs5 sm3>
          <!--todo: не влезает по длине-->
          <v-text-field label="год ухода из жизни" v-model="person.died" mask="####"></v-text-field>
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
    ></v-textarea>
  </div>
</template>

<script>
export default {
  data() {
    return {
      lifetime: false
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
      // todo: refactor select to fetch rods from server by typing
      const flatRods = [];
      for (let rod of this.$store.state.rods) {
        flatRods.push({
          name: rod.name,
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
      // return this.$store.state.rods;
    },
    rules() {
      return this.$store.state.rules;
    }
  }
};
</script>
