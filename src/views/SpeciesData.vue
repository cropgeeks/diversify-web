<template>
  <b-container>
    <h1>Species data</h1>

    <h2 class="mt-3">Varieties</h2>
    <VarietyTable @on-variety-selected="onVarietySelected"/>

    <h2 class="mt-3">Traits</h2>
    <TraitTable @on-traits-selected="onTraitsSelected"/>

    <template v-if="selectedVarieties && selectedVarieties.length > 0">
      <h3>Selected varieties</h3>
      <b-badge v-for="variety in selectedVarieties" :key="variety.id" class="mr-1">{{ variety.varietyname }}</b-badge>
    </template>
    <template v-if="selectedTraits && selectedTraits.length > 0">
      <h3>Selected traits</h3>
      <b-badge v-for="trait in selectedTraits" :key="trait.id" class="mr-1">{{ trait.traitname }}</b-badge>
    </template>

    <h2>Plot</h2>
    <b-button :disabled="!canPlot"
              :title="canPlot ? 'Plot' : 'Please select at least one trait and variety.'"
              @click="onPlotClicked">Plot</b-button>

    <VuePlotly v-if="plotData && plotData.length > 0" :data="plotData" :layout="plotLayout" :options="plotOptions" ref="chart" />
  </b-container>
</template>

<script>
import VarietyTable from '../components/VarietyTable.vue'
import TraitTable from '../components/TraitTable.vue'

import VuePlotly from '@statnett/vue-plotly'

export default {
  data: function () {
    return {
      selectedVarieties: [],
      selectedTraits: [],
      plotData: [],
      plotLayout: {
        boxmode: 'group',
        grid: {
          rows: 1,
          columns: 1,
          pattern: 'independent'
        },
        yaxis: {
          title: 'Value'
        }
      },
      plotOptions: {
        displaylogo: false
      }
    }
  },
  components: {
    VarietyTable,
    TraitTable,
    VuePlotly
  },
  computed: {
    canPlot () {
      return this.selectedTraits.length > 0 && this.selectedVarieties.length > 0
    }
  },
  methods: {
    onPlotClicked: function () {
      var varietyIds = this.selectedVarieties.map(function (v) {
        return v.id
      }).join(',')
      var traitIds = this.selectedTraits.map(function (t) {
        return t.id
      }).join(',')

      var vm = this
      this.apiGetVarietyData(varietyIds, traitIds, function (result) {
        var traits = vm.$_.uniqBy(result, 'traitname').map(function (t) { return t.traitname })

        var data = []
        for (var t = 0; t < traits.length; t++) {
          var varieties = vm.$_(result).filter(['traitname', traits[t]]).uniqBy('varietyname').value().map(function (v) { return { varietyname: v.varietyname, cropname: v.cropname } })

          for (var v = 0; v < varieties.length; v++) {
            var xaxis = t > 0 ? ('x' + (t + 1)) : 'x'
            var yaxis = t > 0 ? ('y' + (t + 1)) : 'y'
            // var yaxisName = t > 0 ? ('yaxis' + (t + 1)) : 'yaxis'
            data.push({
              x: vm.$_.filter(result, { varietyname: varieties[v].varietyname, traitname: traits[0] }).map(function (n) { return n.sitename }),
              xaxis: xaxis,
              yaxis: yaxis,
              name: varieties[v].varietyname + ' (' + varieties[v].cropname + ')',
              type: 'box',
              boxpoints: false,
              y: vm.$_.filter(result, { varietyname: varieties[v].varietyname, traitname: traits[0] }).map(function (n) { return n.value })
            })
            // vm.plotLayout[yaxisName] = {
            //   title: traits[t]
            // }
          }
        }

        vm.plotLayout.grid.rows = traits.length
        vm.plotLayout.height = traits.length * 500
        vm.plotData = data
        // vm.plotLayout.yaxis.title = traits[0]
      })
    },
    onVarietySelected: function (variety, selected) {
      if (selected) {
        this.selectedVarieties.push(variety)
      } else {
        this.selectedVarieties = this.selectedVarieties.filter(function (n) {
          return n.id !== variety.id
        })
      }
    },
    onTraitsSelected: function (traits) {
      this.selectedTraits = traits
    }
  }
}
</script>

<style>

</style>
