<template>
  <div>
    <div id="matrix-chart" ref="matrixChart" />
  </div>
</template>

<script>
import { plotlyScatterMatrix } from '@/plugins/charts/plotly-scatter-matrix.js'

export default {
  props: {
    dataFile: {
      type: Blob,
      default: () => null
    },
    colorBy: {
      type: String,
      default: null
    },
    idColumn: {
      type: String,
      default: null
    },
    nameColumn: {
      type: String,
      default: null
    }
  },
  data: function () {
    const id = 'chart-' + this.uuidv4()

    return {
      id: id
    }
  },
  watch: {
    dataFile: function (newValue, oldValue) {
      this.redraw()
    },
    colorBy: function (newValue, oldValue) {
      this.redraw()
    }
  },
  methods: {
    redraw: function () {
      this.$plotly.purge(this.$refs.matrixChart)

      var reader = new FileReader()
      reader.onload = () => {
        var data = this.$plotly.d3.tsv.parse(reader.result)

        this.$plotly.d3.select(this.$refs.matrixChart)
          .datum(data)
          .call(plotlyScatterMatrix()
            .colorBy(this.colorBy)
            .idColumn(this.idColumn)
            .nameColumn(this.nameColumn)
            .columnsToIgnore(['crops', 'plotcode', 'sitename', 'partnername', 'dataset', 'year', 'varietyname', 'cropcommonname'])
            .colors(this.colors)
            .onPointClicked(p => {
              console.log(p)
            })
            .onPointsSelected(ps => {
              console.log(ps)
            }))
      }
      reader.readAsText(this.dataFile)
    }
  }
}
</script>

<style scoped>
</style>
