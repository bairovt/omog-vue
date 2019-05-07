<template>
  <v-container>
    <v-layout row wrap>
      <v-flex class="xs12">
        <h2>
          Рода
          <small>
            <router-link :to="`/rod/graph`">структура</router-link>
          </small>
        </h2>
      </v-flex>
      <v-flex class="xs12" v-if="rods.length">
        <!--<h3>-->
        <!--<router-link to="/tree/Khory">Хори</router-link> буряты-->
        <!--&lt;!&ndash; Хори буряты &ndash;&gt;-->
        <!--</h3>-->
        <div v-for="rod in rods" :key="rod._id" class>
          <!-- <router-link :to="`/rod/${rod._key}`">{{ rod.name }} <span class="small">{{ rod.count }}</span></router-link> -->
          <v-btn round :to="`/rod/${rod._key}`">
            {{ rod.name }}
            <!--&nbsp;<small>{{rod.count}}</small>-->
          </v-btn>
          <div class style="margin-left: 10pt">
            <span v-for="subrod in rod.subrods" :key="subrod._id" class>
              <v-btn
                small
                round
                :to="`/rod/${subrod._key}`"
                class="text-capitalize"
              >{{ subrod.name }}</v-btn>
            </span>
          </div>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axiosInst from "@/utils/axios-instance";

export default {
  name: "Rods",
  computed: {
    rods() {
      return this.$store.state.rods;
    }
  }
};
</script>

<style scoped>
h1 {
  text-align: center;
}
</style>
