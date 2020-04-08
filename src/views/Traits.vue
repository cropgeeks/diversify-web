<template>
  <b-container>
    <h1>Traits</h1>
    <TraitTable v-on:traits-selected="traits => { selectedTraits = traits }"/>
    <template v-if="selectedTraits && selectedTraits.length > 0">
      <h3>Selected traits</h3>
      <b-badge v-for="(trait, index) in selectedTraits" :key="'plot-trait-' + index" class="mr-1">{{ trait.traitname }}</b-badge>
    </template>

    <h2>Plot</h2>
    <b-button :disabled="!canPlot"
              variant="primary"
              class="mb-3"
              :title="canPlot ? 'Plot' : 'Please select at least two trait.'"
              @click="onPlotClicked">Plot</b-button>

    <MatrixChart :dataFile="plotDataFile" />
    <MatrixChart :dataFile="speciesDataFile" />
  </b-container>
</template>

<script>
import MatrixChart from '@/components/charts/MatrixChart'
import TraitTable from '@/components/TraitTable'

export default {
  data: function () {
    return {
      plotDataFile: null,
      speciesDataFile: null,
      selectedTraits: null
    }
  },
  components: {
    MatrixChart,
    TraitTable
  },
  computed: {
    canPlot: function () {
      return this.selectedTraits && this.selectedTraits.length > 1
    }
  },
  methods: {
    onPlotClicked: function () {
      const traitIds = this.selectedTraits.map(t => t.id).join(',')

      this.apiGetTraitPlotData(traitIds, result => {
        this.plotDataFile = result
      })
      this.apiGetTraitSpeciesData(traitIds, result => {
        this.speciesDataFile = result
      })
    }
  }
}
</script>

<style>

</style>
