<template>
  <b-container>
    <h1>Varieties</h1>
    <VarietyTable @on-variety-selected="onVarietySelected" />
    <div v-for="variety in selectedVarieties" :key="`variety-trait-stats-${variety.id}`" >
      <h2>{{ variety.varietyname }} <small>({{ variety.cropcommonname }})</small></h2>
      <div :ref="`barChart-${variety.id}`" />
    </div>
  </b-container>
</template>

<script>
import Vue from 'vue'

import VarietyTable from '@/components/VarietyTable.vue'

export default {
  data: function () {
    return {
      plotData: {},
      selectedVarieties: []
    }
  },
  components: {
    VarietyTable
  },
  methods: {
    onVarietySelected: function (variety, selected) {
      if (selected) {
        this.selectedVarieties.push(variety)
        this.$nextTick(() => this.plot(variety.id))
      } else {
        this.purge(variety.id)
        delete this.plotData[variety.id]
        this.selectedVarieties = this.selectedVarieties.filter(function (n) {
          return n.id !== variety.id
        })
      }
    },
    purge: function (id) {
      this.$plotly.purge(this.$refs[`barChart-${id}`][0])
    },
    plot: function (id) {
      this.apiGetVarietyTraitStats(id, result => {
        Vue.set(this.plotData, id, result)
        // this.plotData[id] = result

        if (result && result.length > 0) {
          let data = []
          let traits = []
          let varieties = []

          result.forEach(s => {
            if (traits.indexOf(s.traitName) === -1) {
              traits.push(s.traitName)
            }
            if (varieties.indexOf(s.varieties) === -1) {
              varieties.push(s.varieties)
            }
          })

          varieties.forEach((v, i) => {
            data.push({
              y: traits,
              x: result.filter(d => d.varieties === v).map(d => d.averageValue),
              name: v,
              type: 'bar',
              orientation: 'h',
              marker: {
                color: this.colors[i % this.colors.length]
              }
            })
          })

          var layout = {
            margin: { autoexpand: true },
            autosize: true,
            height: traits.length * 100,
            legend: {
              orientation: 'h'
            },
            yaxis: {
              automargin: true,
              autorange: 'reversed'
            }
          }

          var config = {
            displayModeBar: true,
            responsive: true,
            displaylogo: false
          }

          this.$plotly.plot(this.$refs[`barChart-${id}`][0], data, layout, config)
        }
      })
    }
  }
}
</script>
