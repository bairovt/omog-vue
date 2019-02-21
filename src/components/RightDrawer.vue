<template>
  <!-- hide-overlay -->
  <v-navigation-drawer
    app
    right
    fixed
    clipped
    v-model="rightDrawer"
    :disable-route-watcher="$vuetify.breakpoint.smAndUp"
  >
    <v-layout column v-if="person._key" class="pa-2">
      <v-flex class="text-xs-center">
        <img
          v-if="person.pic"
          width="200px"
          :src="'/upload/' + person._key + '/' + person.pic"
          alt="pic"
          class="mb-2"
        >
        <div v-else-if="person.editable">
          <v-btn @click.stop="$refs.croppaUpload.openCroppaDialog">Загрузить фото</v-btn>
        </div>
        <div>
          <a
            href
            v-if="person.commonAncestorKey && treeView !== 'path'"
            @click.prevent.stop="treeView = 'path'"
            class
          >родство</a>
          <a
            href
            v-else-if="person.commonAncestorKey && treeView === 'path'"
            @click.prevent.stop="treeView = 'tree'"
            class
          >древо</a>
          <span v-else></span>
        </div>
      </v-flex>
      <v-flex class="mb-2">
        <div>
          <router-link :to="`/profile/${person._key}`" class="name-profile-link">
            <strong>{{person.surname}} {{person.name}} {{person.midname}}</strong>
          </router-link>
        </div>
        <div>
          <span v-if="person.born">{{person.born}}г</span>
          <span v-if="person.died">&nbsp;- {{person.died}}г</span>
        </div>
      </v-flex>

      <v-flex class="mb-2" v-if="person.maidenName">
        <div>дев. фамилия: {{person.maidenName}}</div>
      </v-flex>
      <v-flex v-if="person.rod" class="mb-2">Род:
        <v-btn
          small
          round
          :to="`/rod/${person.rod._key}`"
          class="text-capitalize"
        >{{person.rod.name}}</v-btn>
      </v-flex>

      <v-flex class="mb-2">{{person.info}}</v-flex>

      <!-- <p>{{person.lifestory}}</p> -->
      <v-flex class="mt-2 mb-2">
        <span>Добавил(а):</span>
        <v-btn
          v-if="person.addedBy"
          round
          small
          :to="`/tree/${person.addedBy._key}`"
          class="text-capitalize"
        >
          {{person.addedBy.name}}
          {{person.addedBy.surname}}
        </v-btn>
      </v-flex>
      <v-flex v-if="person.editable">
        <!-- todo: проработать права на добавление -->
        Добавить:
        <br>
        <v-btn small color="accent" :to="`/person/${person._key}/add/father`">отца</v-btn>
        <v-btn small color="accent" :to="`/person/${person._key}/add/mother`">мать</v-btn>
        <v-btn small color="accent" :to="`/person/${person._key}/add/son`">сына</v-btn>
        <v-btn small color="accent" :to="`/person/${person._key}/add/daughter`">дочь</v-btn>
      </v-flex>
      <br>
      <v-flex>Соединение персон:
        <br>
        <v-btn small @click.stop="pickForRel" :disabled="isPersonPickedForRel">
          <span v-if="isPersonPickedForRel">Выбран для соединения</span>
          <span v-else>Выбрать для соединения</span>
        </v-btn>
        <!-- todo: проработать права на указание; v-if="!person.disableRelPropose" -->
        <v-btn
          v-if="!isPersonPickedForRel && personForRel"
          small
          color="warning"
          @click.stop="relateDialog=true"
        >Соединить</v-btn>
      </v-flex>
      <br>
    </v-layout>

    <image-upload-croppa ref="croppaUpload" :person="person"></image-upload-croppa>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: "RightDrawer",
  computed: {
    rightDrawer: {
      get() {
        return this.$store.state.rightDrawer;
      },
      set(newValue) {
        this.$store.state.rightDrawer = newValue;
      }
    },
    relateDialog: {
      get() {
        return this.$store.state.relateDialog;
      },
      set(newValue) {
        this.$store.state.relateDialog = newValue;
      }
    },
    user() {
      return this.$store.state.user;
    },
    person() {
      return this.$store.state.person;
    },
    personForRel() {
      return this.$store.state.personForRel;
    },
    isPersonPickedForRel() {
      const personForRel = this.$store.state.personForRel;
      if (personForRel) {
        return this.person._id === personForRel._id;
      }
      return false;
    },
    treeView: {
      get() {
        return this.$store.state.treeView;
      },
      set(newValue) {
        this.$store.state.treeView = newValue;
      }
    }
  },
  methods: {
    pickForRel() {
      this.$store.commit("setPersonForRel", this.person);
    }
  }
};
</script>

<style>
.name-profile-link {
  text-decoration: none;
}
</style>
