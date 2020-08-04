<template>
  <v-container fluid class="pa-0">
    <v-layout row wrap>
      <v-flex xs12 class="text-xs-center">
        <v-progress-circular v-if="loading" indeterminate :size="32" color="primary"></v-progress-circular>
      </v-flex>
      <v-flex class="xs12">
        <div id="rod_tree"></div>
      </v-flex>
    </v-layout>

    <!-- set relation dialog -->
    <v-dialog v-model="relateDialog" max-width="500px">
      <relate-dialog-new v-on:related="fetchTree"></relate-dialog-new>
    </v-dialog>

    <!-- when clicked on edge -->
    <v-dialog v-model="edgeDialog" persistent max-width="500px">
      <v-card v-if="edge">
        <v-card-title>{{edge.id}} added by {{edge.addedBy | keyFromId}}</v-card-title>
        <v-card-text class="pt-0 pb-0">
          Связь: {{edge.from | keyFromId}} -> {{edge.to | keyFromId}}
          <br>
          <br>
        </v-card-text>
        <v-card-actions>
          <v-btn @click.stop="deleteChildEdge" :loading="loading">удалить</v-btn>
          <v-spacer></v-spacer>
          <v-btn class="primary" small flat @click.native.stop="closeEdgeDialog">Закрыть</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
// todo: wrong person key -> 404 message
import axiosInst from "@/utils/axios-instance";
import { predokRelation, potomokRelation, fullName, keyFromId } from "@/filters";
import router from "@/router";
import { visOptions, menColor, womenColor } from "@/options/vis-opts";

let network;

export default {
  name: "Tree",
  data() {
    return {
      visContainer: "",
      edgeDialog: false,
      edge: null,
      tree: {
        predki: null,
        potomki: null,
        siblings: null
      },
      commonAncestorPath: null
    };
  },
  computed: {
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
    },
    loading() {
      return this.$store.state.loading;
    },
    relateDialog: {
      get() {
        return this.$store.state.relateDialog;
      },
      set(newValue) {
        this.$store.state.relateDialog = newValue;
      }
    },
    treeData() {
      const treeData = { nodes: [], edges: [] };
      if (
        !this.person._key ||
        this.tree.predki === null ||
        this.tree.potomki === null
      ) {
        return treeData;
      }

      // nodesIds, edgesIds - массивы для проверки уникальности nodes и edges в treeData.
      // Для избежания ошибок дублирования vis в случае откл. uniqueVertices: "global" на сервере
      // когда идет кровосмешение
      // Error: Cannot add item: item with id Persons/50799218 already exists
      // Error: Cannot add item: item with id child/50799770 already exists
      const nodesIds = [];
      const edgesIds = [];

      this.tree.partners.map(item => {
        if (nodesIds.indexOf(item.person._id) === -1) {
          // добавляем без повторов
          treeData.nodes.push({
            id: item.person._id,
            // label: fullName(item.person),
            label: item.person.name,
            title: fullName(item.person),
            shape: item.person.pic ? "circularImage" : "icon",
            image: item.person.pic
              ? "/upload/" + item.person._key + "/" + item.person.pic
              : undefined,
            group: item.person.gender
          });
          nodesIds.push(item.person._id);
        }
        if (edgesIds.indexOf(item.edge._id) === -1) {
          // добавляем без повторов
          treeData.edges.push({
            id: item.edge._id,
            from: item.edge._from,
            to: item.edge._to,
            addedBy: item.edge.addedBy,
            adopted: item.edge.adopted,
            color: {
              // adopted arrow color
              color: item.edge.adopted ? "#18bc9c" : undefined,
              highlight: item.edge.adopted ? "#18bc9c" : undefined,
              hover: item.edge.adopted ? "#18bc9c" : undefined
            }
          });
          edgesIds.push(item.edge._id);
        }
      });

      this.tree.predki.map(item => {
        if (nodesIds.indexOf(item.person._id) === -1) {
          // добавляем без повторов
          treeData.nodes.push({
            id: item.person._id,
            // label: fullName(item.person),
            label: item.person.name,
            title: fullName(item.person) + ", " + predokRelation(item),
            shape: item.person.pic ? "circularImage" : "icon",
            image: item.person.pic
              ? "/upload/" + item.person._key + "/" + item.person.pic
              : undefined,
            group: item.person.gender
          });
          nodesIds.push(item.person._id);
        }
        if (edgesIds.indexOf(item.edge._id) === -1) {
          // добавляем без повторов
          treeData.edges.push({
            id: item.edge._id,
            from: item.edge._from,
            to: item.edge._to,
            addedBy: item.edge.addedBy,
            adopted: item.edge.adopted,
            color: {
              // adopted arrow color
              color: item.edge.adopted ? "#18bc9c" : undefined,
              highlight: item.edge.adopted ? "#18bc9c" : undefined,
              hover: item.edge.adopted ? "#18bc9c" : undefined
            }
          });
          edgesIds.push(item.edge._id);
        }
      });
      // a person
      treeData.nodes.push({
        id: this.person._id,
        // label: fullName(this.person),
        label: this.person.name,
        title: fullName(this.person),
        shape: this.person.pic ? "circularImage" : "icon",
        image: this.person.pic
          ? "/upload/" + this.person._key + "/" + this.person.pic
          : undefined,
        icon: {
          face: "FontAwesome",
          code: "\uf2be",
          size: 50,
          color: this.person.gender === 0 ? womenColor : menColor
        },
        color: { border: this.person.gender === 0 ? womenColor : menColor }, // arrows color
        borderWidth: 5
        // group: this.person.gender, // bug: why group settings are prior over the node's?
      });
      nodesIds.push(this.person._id);

      this.tree.siblings.map(item => {
        if (nodesIds.indexOf(item.person._id) === -1) {
          // добавляем без повторов
          treeData.nodes.push({
            id: item.person._id,
            // label: fullName(item.person),
            label: item.person.name,
            title:
              fullName(item.person) +
              ", " +
              (item.person.gender === 1 ? "брат" : "сестра"),
            shape: item.person.pic ? "circularImage" : "icon",
            image: item.person.pic
              ? "/upload/" + item.person._key + "/" + item.person.pic
              : undefined,
            group: item.person.gender
          });
          nodesIds.push(item.person._id);
        }
        if (edgesIds.indexOf(item.edge._id) === -1) {
          // добавляем без повторов
          treeData.edges.push({
            id: item.edge._id,
            from: item.edge._from,
            to: item.edge._to,
            addedBy: item.edge.addedBy,
            adopted: item.edge.adopted,
            color: {
              // adopted arrow color
              color: item.edge.adopted ? "#18bc9c" : undefined,
              highlight: item.edge.adopted ? "#18bc9c" : undefined,
              hover: item.edge.adopted ? "#18bc9c" : undefined
            }
          });
          edgesIds.push(item.edge._id);
        }
      });

      this.tree.potomki.map(item => {
        if (nodesIds.indexOf(item.person._id) === -1) {
          // добавляем в treeData.nodes если person._id еще не добавлен
          treeData.nodes.push({
            id: item.person._id,
            // label: fullName(item.person),
            label: item.person.name,
            title: fullName(item.person) + ", " + potomokRelation(item),
            shape: item.person.pic ? "circularImage" : "icon",
            image: item.person.pic
              ? "/upload/" + item.person._key + "/" + item.person.pic
              : undefined,
            group: item.person.gender
          });
          nodesIds.push(item.person._id);
        }
        if (edgesIds.indexOf(item.edge._id) === -1) {
          // добавляем без повторов
          treeData.edges.push({
            id: item.edge._id,
            from: item.edge._from,
            to: item.edge._to,
            addedBy: item.edge.addedBy,
            adopted: item.edge.adopted,
            color: {
              // adopted arrow color
              color: item.edge.adopted ? "#18bc9c" : undefined,
              highlight: item.edge.adopted ? "#18bc9c" : undefined,
              hover: item.edge.adopted ? "#18bc9c" : undefined
            }
          });
          edgesIds.push(item.edge._id);
        }
      });
      return treeData;
    },
    pathData() {
      const pathData = { nodes: [], edges: [] };
      if (!this.person._key || this.commonAncestorPath === null) {
        return pathData;
      }
      const nodesIds = [];
      const edgesIds = [];

      if (this.commonAncestorPath) {
        this.commonAncestorPath.nodes.map(person => {
          if (nodesIds.indexOf(person._id) === -1) {
            // добавляем без повторов
            pathData.nodes.push({
              id: person._id,
              label: fullName(person),
              // title: fullName(person) + ', ' + predokRelation(item),
              shape: person.pic ? "circularImage" : "icon",
              image: person.pic
                ? "/upload/" + person._key + "/" + person.pic
                : undefined,
              group: person.gender
            });
            nodesIds.push(person._id);
          }
        });
        this.commonAncestorPath.edges.map(edge => {
          if (edgesIds.indexOf(edge._id) === -1) {
            // добавляем без повторов
            pathData.edges.push({
              id: edge._id,
              from: edge._from,
              to: edge._to,
              addedBy: edge.addedBy,
              adopted: edge.adopted,
              color: {
                // adopted arrow color
                color: edge.adopted ? "#18bc9c" : undefined,
                highlight: edge.adopted ? "#18bc9c" : undefined,
                hover: edge.adopted ? "#18bc9c" : undefined
              }
            });
            edgesIds.push(edge._id);
          }
        });
        return pathData;
      }
    },
    visData() {
      switch (this.treeView) {
        case "path":
          return this.pathData;
        default:
          return this.treeData;
      }
    }
  },
  watch: {
    $route: "fetchTree",
    treeView: "switchView",
    visData: "renderTree"
  },
  methods: {
    switchView() {
      switch (this.treeView) {
        case "path":
          return this.fetchCommonAncestorPath();
        case "tree":
          return this.renderTree();
        default:
          return this.renderTree();
      }
    },
    fetchTree() {
      this.treeView = "tree";
      this.commonAncestorPath = null;
      axiosInst
        .get(`/api/person/${this.$route.params.key}/tree`)
        .then(resp => {
          this.$store.commit("setPerson", resp.data.profile);
          this.tree = resp.data.tree;
        })
        .catch(error => {
          this.$store.dispatch("axiosErrorHandle", error);
        });
    },
    fetchCommonAncestorPath() {
      axiosInst
        .get(
          `/api/person/${this.$route.params.key}/common_ancestor_path/${
            this.person.commonAncestorKey
          }`
        )
        .then(resp => {
          this.commonAncestorPath = resp.data.path;
        })
        .catch(error => {
          dispatch("axiosErrorHandle", error);
        });
    },
    renderTree() {
      // initialize vis network!
      // let start = Date.now()
      // отключение физики при большом количестве потомков для ускорения отрисовки
      // if (this.tree.potomki && this.tree.potomki.length > 100) {
      visOptions.physics.enabled = this.visData.nodes.length <= 150;
      network = new vis.Network(
        document.getElementById("rod_tree"),
        this.visData,
        visOptions
      );
      network.on("selectNode", props => {
        let nodeId = props.nodes[0]; // edge's _from, _to in form of 'Persons/BairovTumenG'
        let person_key = nodeId.split("/")[1]; // node.id -> person._key (Persons/BairovTumenG -> BairovTumenG);
        router.push("/tree/" + person_key); // id: Persons/BairovTumenG
      });
      network.on("selectEdge", props => {
        let edgeId = props.edges[0];
        this.edge = network.body.data.edges._data[edgeId];
        this.edgeDialog = true;
      });
      // network.once("afterDrawing", function () {
      //   console.log('render time: ' + (Date.now() - start)) // log render time
      // })
    },
    closeEdgeDialog() {
      network.unselectAll();
      this.edgeDialog = false;
    },
    deleteChildEdge() {
      axiosInst
        .delete(`/api/child/${keyFromId(this.edge.id)}`)
        .then(resp => {
          network.deleteSelected();
          router.push("/tree/" + resp.data.parent_key);
          this.closeEdgeDialog();
        })
        .catch(error => {
          this.$store.dispatch("axiosErrorHandle", error);
        });
    }
  },
  created() {
    this.fetchTree();
  },
  filters: {
    predokRelation,
    potomokRelation,
    keyFromId
  }
};
</script>

<style scoped>
#rod_tree {
  height: 800px;
  border: 1px solid lightgray;
}
.progress-circular {
  margin: 1rem;
}
</style>
