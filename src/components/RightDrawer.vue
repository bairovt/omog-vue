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
      <v-flex v-if="person.rod" class="mb-2">
        Род:
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
      <v-flex v-if="person.editable">
        <v-btn round small @click.stop="openRelateDialog()">
          <span>Cоединение</span>
        </v-btn>
      </v-flex>
      <v-flex>
        <v-btn round small class="text-lowercase">
          <span>Копировать ключ</span>
        </v-btn>
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
    user() {
      return this.$store.state.user;
    },
    person() {
      return this.$store.state.person;
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
    openRelateDialog() {
      this.$store.dispatch(
        "fetchPotentialParentsAndChildren",
        this.person._key
      );
      this.$store.state.relateDialog = true;
    },
    copyKey() {
      this.$store.state.copied_key;
    }
  }
};
</script>

<style>
.name-profile-link {
  text-decoration: none;
}
</style>
