<template>
  <v-container fluid class="pa-0">
    <v-layout row wrap>
      <v-flex xs12 class="text-xs-center">
        <v-progress-circular v-if="loading" indeterminate :size="32" color="primary"></v-progress-circular>
      </v-flex>
      <v-flex class="xs12">
        <div id="rod_graph"></div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
// todo: wrong person key -> 404 message
import axiosInst from "@/utils/axios-instance";
import { keyFromId } from "@/filters";
import router from "@/router";
// import { visOptions, menColor, womenColor } from "@/options/vis-opts";
const visOptions = {
  locale: "ru",
  nodes: {
    shape: "ellipse",
    brokenImage: "/upload/image.jpeg",
    font: {
      strokeWidth: 5
    },
    borderWidth: 1
    // borderWidthSelected: 5
  },
  edges: {
    smooth: true,
    arrows: {
      to: true
    }
  },

  interaction: {
    hover: true,
    keyboard: {
      enabled: false, // если включено появляется голубая рамка
      bindToWindow: false // если true не работают кнопки - = х ъ
    },
    selectConnectedEdges: false,
    tooltipDelay: 100 // 300 ms default
  }
};

let network;

export default {
  name: "RodGraph",
  data() {
    return {
      visContainer: "",
      rods: []
    };
  },
  computed: {
    loading() {
      return this.$store.state.loading;
    },

    graphData() {
      const graphData = { nodes: [], edges: [] };

      // nodesIds, edgesIds - массивы для проверки уникальности nodes и edges в graphData.

      const nodesIds = [];
      const edgesIds = [];

      this.rods.map(item => {
        if (nodesIds.indexOf(item.rod._id) === -1) {
          // добавляем без повторов
          graphData.nodes.push({
            id: item.rod._id,
            label: item.rod.name
          });
          nodesIds.push(item.rod._id);
        }
        if (item.edge && edgesIds.indexOf(item.edge._id) === -1) {
          // добавляем без повторов
          graphData.edges.push({
            id: item.edge._id,
            from: item.edge._from,
            to: item.edge._to
            // addedBy: item.edge.addedBy,
          });
          edgesIds.push(item.edge._id);
        }
      });
      return graphData;
    },

    visData() {
      return this.graphData;
    }
  },

  methods: {
    fetchGraph() {
      axiosInst
        .get(`/api/rod/graph`)
        .then(resp => {
          this.rods = resp.data.rods;
          this.renderGraph();
        })
        .catch(error => {
          this.$store.dispatch("axiosErrorHandle", error);
        });
    },

    renderGraph() {
      // initialize vis network!
      // let start = Date.now()

      network = new vis.Network(
        document.getElementById("rod_graph"),
        // this.visData
        this.graphData,
        visOptions
      );
      network.on("selectNode", props => {
        let nodeId = props.nodes[0]; // edge's _from, _to in form of 'Persons/BairovTumenG'
        let rod_key = nodeId.split("/")[1]; // node.id -> person._key (Persons/BairovTumenG -> BairovTumenG);
        router.push("/rod/" + rod_key); // id: Persons/BairovTumenG
      });
    }
  },
  created() {
    this.fetchGraph();
  },
  filters: {
    keyFromId
  }
};
</script>

<style scoped>
#rod_graph {
  height: 800px;
  border: 1px solid lightgray;
}
.progress-circular {
  margin: 1rem;
}
</style>
