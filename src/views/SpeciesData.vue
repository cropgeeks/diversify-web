<template>
  <b-container>
    <h1>Species data</h1>

    <h2 class="mt-3">Varieties</h2>
    <VarietyTable @on-variety-selected="onVarietySelected"/>

    <h2 class="mt-3">Traits</h2>
    <VarietyDataTraitTable @on-traits-selected="onTraitsSelected"/>

    <template v-if="selectedVarieties && selectedVarieties.length > 0">
      <h3>Selected varieties</h3>
      <b-badge v-for="variety in selectedVarieties" :key="'variety-' + variety.id" class="mr-1">{{ variety.varietyname }}</b-badge>
    </template>
    <template v-if="selectedTraits && selectedTraits.length > 0">
      <h3>Selected traits</h3>
      <b-badge v-for="trait in selectedTraits" :key="'trait-' + trait.id" class="mr-1">{{ trait.traitname }}</b-badge>
    </template>

    <h2>Plot</h2>
    <b-button :disabled="!canPlot"
              variant="primary"
              class="mb-3"
              :title="canPlot ? 'Plot' : 'Please select at least one trait and variety.'"
              @click="onPlotClicked">Plot</b-button>

    <template v-if="plotData">
      <div v-for="trait in selectedTraits" :key="'chart-' + trait.id">
        <h2>{{ trait.traitname }}</h2>
        <VuePlotly :data="plotData[trait.traitname]" :layout="plotLayout" :options="plotOptions" v-if="plotData[trait.traitname]" />
        <p class="text-muted" v-else>No data for this selection.</p>
      </div>
    </template>
  </b-container>
</template>

<script>
import Vue from 'vue'
import VarietyTable from '../components/VarietyTable.vue'
import VarietyDataTraitTable from '../components/VarietyDataTraitTable.vue'

import VuePlotly from '@statnett/vue-plotly'

export default {
  data: function () {
    return {
      selectedVarieties: [],
      selectedTraits: [],
      plotData: null,
      plotLayout: {
        boxmode: 'group',
        height: 400,
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
    VarietyDataTraitTable,
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

      this.apiGetVarietyData(varietyIds, traitIds, result => {
        var traits = this.$_.uniqBy(result, 'traitname').map(function (t) { return t.traitname })

        var data = []
        for (var t = 0; t < traits.length; t++) {
          var varieties = this.$_(result).filter(['traitname', traits[t]]).uniqBy('varietyname').value().map(function (v) { return { varietyname: v.varietyname, cropname: v.cropname } })

          data[traits[t]] = []
          for (var v = 0; v < varieties.length; v++) {
            const varietyName = varieties[v].varietyname

            let color

            if (varietyName in this.speciesTraitChartColors) {
              color = this.speciesTraitChartColors[varietyName]
            } else {
              color = this.colors[Object.keys(this.speciesTraitChartColors).length % this.colors.length]
              Vue.set(this.speciesTraitChartColors, varietyName, color)
            }

            data[traits[t]].push({
              x: this.$_.filter(result, { varietyname: varietyName, traitname: traits[t] }).map(function (n) { return n.sitename }),
              xaxis: 'xaxis',
              yaxis: 'yaxis',
              name: varietyName + ' (' + varieties[v].cropname + ')',
              type: 'box',
              marker: { color: color },
              boxpoints: false,
              y: this.$_.filter(result, { varietyname: varietyName, traitname: traits[t] }).map(function (n) { return n.value })
            })
          }
        }
        this.plotLayout.height = 500
        this.plotData = data
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
  },
  mounted: function () {
    this.speciesTraitChartColors = {}
  }
}
</script>

<style>

</style>
