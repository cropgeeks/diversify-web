<template>
  <b-container>
    <h1>Species data</h1>

    <h2 class="mt-3">Varieties</h2>
    <VarietyTable @variety-selected="onVarietySelected"/>

    <h2 class="mt-3">Traits</h2>
    <TraitTable granularity="species" v-on:traits-selected="traits => { selectedTraits = traits }"/>

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

    <template v-if="plotData && Object.keys(plotData).length > 0">
      <div v-for="trait in selectedTraits" :key="'chart-' + trait.id">
        <h2>{{ trait.traitname }}</h2>
        <div :ref="`species-data-plot-${trait.id}`" v-if="plotData[trait.id]" />
        <p class="text-muted" v-else>No data for this selection.</p>
      </div>
    </template>
  </b-container>
</template>

<script>
import Vue from 'vue'
import VarietyTable from '../components/VarietyTable.vue'
import TraitTable from '../components/TraitTable.vue'

export default {
  data: function () {
    return {
      selectedVarieties: [],
      selectedTraits: [],
      plotData: {},
      plotLayout: {
        boxmode: 'group',
        height: 500,
        yaxis: {
          title: 'Value'
        },
        legend: {
          orientation: 'h'
        }
      },
      plotOptions: {
        displaylogo: false
      }
    }
  },
  components: {
    VarietyTable,
    TraitTable
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
        Object.keys(this.plotData)
          .filter(t => this.$refs[`species-data-plot-${t}`])
          .forEach(t => this.$plotly.purge(this.$refs[`species-data-plot-${t}`][0]))

        const traits = this.$_.uniqBy(result, 'traitname').map(function (t) { return { id: t.traitid, name: t.traitname } })

        this.plotData = {}
        for (var t = 0; t < traits.length; t++) {
          var varieties = this.$_(result).filter(['traitname', traits[t].name]).uniqBy('varietyname').value().map(function (v) { return { varietyname: v.varietyname, cropname: v.cropname } })

          let localPlotLayout = JSON.parse(JSON.stringify(this.plotLayout))
          let localData = []
          for (var v = 0; v < varieties.length; v++) {
            const varietyName = varieties[v].varietyname

            let color

            if (varietyName in this.speciesTraitChartColors) {
              color = this.speciesTraitChartColors[varietyName]
            } else {
              color = this.colors[Object.keys(this.speciesTraitChartColors).length % this.colors.length]
              Vue.set(this.speciesTraitChartColors, varietyName, color)
            }

            const ys = this.$_.filter(result, { varietyname: varietyName, traitname: traits[t].name }).map(function (n) { return n.value })
            const isDates = ys.filter(y => y !== undefined && y !== null && y.split('-').length === 3 && !isNaN(Date.parse(y))).length > 0

            if (isDates) {
              localPlotLayout.yaxis.type = 'date'
              localPlotLayout.yaxis.tickFormat = '%Y-%m-%d'
            }

            localData.push({
              x: this.$_.filter(result, { varietyname: varietyName, traitname: traits[t].name }).map(function (n) { return n.partnername }),
              xaxis: 'xaxis',
              yaxis: 'yaxis',
              name: varietyName + ' (' + varieties[v].cropname + ')',
              type: 'box',
              marker: { color: color },
              boxpoints: false,
              y: ys
            })
          }

          Vue.set(this.plotData, traits[t].id, localData)

          const id = traits[t].id
          this.$nextTick(() => this.$plotly.plot(this.$refs[`species-data-plot-${id}`][0], this.plotData[id], localPlotLayout, this.plotOptions))
        }
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
    }
  },
  mounted: function () {
    this.speciesTraitChartColors = {}
  }
}
</script>

<style>

</style>
