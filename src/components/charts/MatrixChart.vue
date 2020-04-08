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
            .colorBy('year')
            .columnsToIgnore(['crops', 'plotcode', 'sitename', 'dataset', 'year', 'varietyname', 'cropcommonname'])
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
