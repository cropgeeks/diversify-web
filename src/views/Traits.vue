<template>
  <b-container>
    <h1>Traits</h1>
    <TraitTable v-on:traits-selected="traits => { selectedTraits = traits }"/>
    <template v-if="selectedTraits && selectedTraits.length > 0">
      <h3>Selected traits</h3>
      <b-badge v-for="(trait, index) in selectedTraits" :key="'plot-trait-' + index" class="mr-1">{{ trait.traitname }}</b-badge>
    </template>

    <hr />
    <b-button :disabled="!canPlot"
              variant="primary"
              class="mb-3"
              :title="canPlot ? 'Plot' : 'Please select at least two trait.'"
              @click="onPlotClicked">Plot</b-button>

    <h2>Plot data</h2>
    <b-form-group label="Color by" label-for="colorByPlot">
      <b-form-select v-model="colorByPlot" :options="colorOptionsPlot" id="colorByPlot" />
    </b-form-group>
    <MatrixChart :dataFile="plotDataFile" :colorBy="colorByPlot" idColumn="plotcode" nameColumn="plotcode" />

    <h2>Species data</h2>
    <b-form-group label="Color by" label-for="colorBySpecies">
      <b-form-select v-model="colorBySpecies" :options="colorOptionsSpecies" id="colorBySpecies" />
    </b-form-group>
    <MatrixChart :dataFile="speciesDataFile" :colorBy="colorBySpecies" nameColumn="varietyname" />
  </b-container>
</template>

<script>
import MatrixChart from '@/components/charts/MatrixChart'
import TraitTable from '@/components/TraitTable'

export default {
  data: function () {
    return {
      colorByPlot: null,
      colorBySpecies: null,
      plotDataFile: null,
      speciesDataFile: null,
      selectedTraits: null,
      colorOptionsPlot: [
        { value: null, text: 'No coloring' },
        { value: 'crops', text: 'Crops' },
        { value: 'partnername', text: 'Site' },
        { value: 'year', text: 'Year' }
      ],
      colorOptionsSpecies: [
        { value: null, text: 'No coloring' },
        { value: 'varietyname', text: 'Variety' },
        { value: 'cropcommonname', text: 'Crop' },
        { value: 'partnername', text: 'Site' },
        { value: 'year', text: 'Year' }
      ]
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
