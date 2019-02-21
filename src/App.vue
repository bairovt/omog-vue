<template>
  <v-app>
    <!-- 
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>Vuetify</span>
        <span class="font-weight-light">MATERIAL DESIGN</span>
      </v-toolbar-title> 
    -->
    <!-- :disable-route-watcher="$vuetify.breakpoint.smAndUp" -->
    <v-navigation-drawer v-if="user" app fixed clipped v-model="drawer" temporary>
      <v-list>
        <v-list-tile v-for="(item, i) in leftBarItems" :key="i" :to="item.url">
          <!-- v-if="!item.allowed || user.hasRoles(item.allowed)" -->
          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile v-if="user.hasRoles(['manager'])" to="/person/create">
          <v-list-tile-action>
            <v-icon>add_circle</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Создать</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile @click.stop="logout">
          <v-list-tile-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Выход</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <right-drawer v-if="user"></right-drawer>

    <v-toolbar v-if="user" app fixed clipped-right clipped-left dense>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>

      <v-toolbar-items>
        <v-btn v-if="user" flat :to="`/tree/${user._key}`">
          <img class="menu-tree-icon" src="/assets/tree-icon.png">
          <span class="hidden-xs-only menu-title text-capitalize">Мой Род</span>
        </v-btn>
      </v-toolbar-items>

      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn flat v-if="user" to="/person/find" class="hidden-xs-only">
          <v-icon>search</v-icon>
          <span class="menu-title text-lowercase">поиск</span>
        </v-btn>
        <v-btn flat v-if="person._key" :to="`/profile/${person._key}`">
          <v-icon>face</v-icon>
          <span class="hidden-xs-only menu-title text-capitalize">{{person.name}}</span>
        </v-btn>
      </v-toolbar-items>
      <v-btn v-if="user" icon @click="rightDrawer = !rightDrawer">
        <img class="sidebar-right-icon" src="/assets/right.png" alt="toggle right bar">
      </v-btn>
    </v-toolbar>

    <v-content>
      <router-view/>
    </v-content>

    <v-footer app class="hidden-xs-only">
      <span>&copy; 2018</span>
    </v-footer>

    <v-dialog v-model="errorDialog" max-width="500">
      <v-card v-if="error">
        <v-card-title>Ошибка {{error.status}}</v-card-title>
        <v-card-text>
          <v-alert type="error" :value="true">{{error.text}}</v-alert>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <!-- <v-btn color="accent" small @click.stop="errorDialog=false">Закрыть</v-btn> -->
          <v-btn color="accent" small @click.stop="errorDialog=false">Закрыть</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      drawer: false,
      leftBarItems: [
        { icon: "supervisor_account", title: "Рода", url: "/rod/all" },
        { icon: "search", title: "Поиск", url: "/person/find" }
      ]
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    person() {
      return this.$store.state.person;
    },
    rightDrawer: {
      get() {
        return this.$store.state.rightDrawer;
      },
      set(newValue) {
        this.$store.commit("setRightDrawer", newValue);
      }
    },
    error() {
      return this.$store.state.error;
    },
    errorDialog: {
      get() {
        return this.$store.getters.errorDialog;
      },
      set(newValue) {
        this.$store.commit("clearError");
      }
    }
  },
  methods: {
    logout() {
      this.$store.dispatch("logout");
    } // todo? обнулять ли значения store.state
  },
  mounted() {
    if (this.$vuetify.breakpoint.smAndUp) {
      this.$store.commit("setRightDrawer", true);
    } // open rightDrawer on wide screens
    // подгрузка родов после обновлении любой страницы, когда user loged in
    if (this.$store.state.user) this.$store.dispatch("loadAllRods"); //todo? переместить в другое место
  }
};
</script>

<style>
.sidebar-right-icon {
  height: 20px;
}
.menu-tree-icon {
  height: 38px;
}
.menu-title {
  margin-left: 5px;
}
</style>
