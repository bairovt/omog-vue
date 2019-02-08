<template>
  <v-list>
    <template v-for="p in persons">
      <v-list-tile avatar :key="p.title" :to="`/tree/${p._key}`">
        <v-list-tile-avatar v-if="p.pic">
          <img :src="`/upload/${p._key}/${p.pic}`">
        </v-list-tile-avatar>
        <v-list-tile-content>
          <v-list-tile-title>{{p.surname}} {{p.name}} {{p.midname}}</v-list-tile-title>
          <v-list-tile-sub-title>добавил(а) {{p.addedBy | keyFromId}}</v-list-tile-sub-title>
          <v-list-tile-sub-title>{{p.info}}</v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-divider></v-divider>
    </template>
  </v-list>
</template>

<script>
import { keyFromId } from "@/filters";

export default {
  props: ["persons"],
  filters: {
    keyFromId
  }
};
</script>
