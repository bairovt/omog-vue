<template>
  <v-card>
    <v-card-title>Соединить</v-card-title>
    <v-card-text>
      <p>
        <strong>{{person.surname}} {{person.name}} {{person.midname}}</strong> с:
      </p>
      <v-radio-group mandatory v-model="reltype" row @change="personToRelate = null">
        <v-radio label="родителем" value="parent" color="primary"></v-radio>
        <v-radio label="ребенком" value="child" color="primary"></v-radio>
      </v-radio-group>

      <v-autocomplete
        :disabled="reltype === null"
        :items="reltype === 'parent' ? potential.parents : potential.children"
        v-model="personToRelate"
        label="Выбрать"
        item-text="name"
        item-value="_key"
        menu-props="auto"
        dense
      ></v-autocomplete>
      <v-checkbox label="приемный/отданный" v-model="adopted" color="primary"></v-checkbox>
      <v-checkbox
        v-if="selectedPerson && selectedPerson._id !== person._id"
        :label="`соединить с: ${$options.filters.fullestName(selectedPerson)}`"
        v-model="relateWithSelected"
        color="primary"
      ></v-checkbox>
    </v-card-text>

    <v-card-actions>
      <v-btn
        @click.stop="relate"
        class="primary"
        :disabled="loading || (reltype === null || (personToRelate === null && !relateWithSelected))"
        :loading="loading"
      >
        Соединить
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
import axiosInst from "@/utils/axios-instance";
import { translate, fullestName } from "@/filters";

export default {
  data() {
    return {
      reltype: null, // parent, child
      adopted: false,
      personToRelate: null, // _key
      relateWithSelected: false
    };
  },
  computed: {
    person() {
      return this.$store.state.person;
    },
    selectedPerson() {
      return this.$store.state.selectedPerson;
    },
    potential() {
      return this.$store.state.potential;
    },
    loading() {
      return this.$store.state.loading;
    },
    rules() {
      return this.$store.state.rules;
    }
  },
  methods: {
    relate() {
      let from_key, to_key;
      if (this.relateWithSelected) {
        from_key =
          this.reltype === "child"
            ? this.person._key
            : this.selectedPerson._key;
        to_key =
          this.reltype === "parent"
            ? this.person._key
            : this.selectedPerson._key;
      } else {
        from_key =
          this.reltype === "child" ? this.person._key : this.personToRelate;
        to_key =
          this.reltype === "parent" ? this.person._key : this.personToRelate;
      }
      axiosInst
        .post("/api/child/set_relation", {
          from_key,
          to_key,
          adopted: this.adopted
        })
        .then(resp => {
          this.personToRelate = null;
          this.$store.state.relateDialog = false;
          this.$emit("related");
        })
        .catch(error => {
          this.$store.dispatch("axiosErrorHandle", error);
        });
    }
  },
  filters: {
    translate
  }
};
</script>
