<template>
  <div v-if="data && data.length > 0">
    <b-button @click="$emit('clear')">Clear</b-button>
    <div v-for="(chartData, index) in chartData" :key="`plot-level-chart-${index}`">
      <h3>{{ chartData.trait.traitname }} - <small>{{ chartData.site.name }} - {{ chartData.trait.year }}</small></h3>
      <VuePlotly :data="chartData.data" :layout="plotLayout" :options="plotOptions" />
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import VuePlotly from '@statnett/vue-plotly'

export default {
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    data: function (newValue, oldValue) {
      this.chartData = newValue.map(n => {
        var crops = this.$_.uniqBy(n, 'crops').map(function (t) { return t.crops })

        var data = []
        for (var i in crops) {
          const cropName = crops[i]
          let color

          if (cropName in this.plotTraitChartColors) {
            color = this.plotTraitChartColors[cropName]
          } else {
            color = this.colors[Object.keys(this.plotTraitChartColors).length % this.colors.length]
            Vue.set(this.plotTraitChartColors, cropName, color)
          }

          data.push({
            x: this.$_.filter(n, ['crops', cropName]).map(function (n) { return +n.value }),
            y: this.$_.filter(n, ['crops', cropName]).map(function (n) { return '' }),
            type: 'box',
            xaxis: 'x',
            marker: { color: color },
            boxpoints: false,
            orientation: 'h',
            name: cropName,
            boxmean: 'sd'
          })
        }

        return {
          trait: {
            year: n[0].year,
            traitname: n[0].traitname
          },
          site: {
            id: n[0].siteid,
            name: n[0].sitename
          },
          data: data
        }
      })
    }
  },
  data: function () {
    return {
      chartData: [],
      plotLayout: {
        xaxis: {
          title: 'Value'
        },
        hovermode: 'closest',
        boxmode: 'group'
      },
      plotOptions: {
        displaylogo: false
      }
    }
  },
  components: {
    VuePlotly
  }
}
</script>

<style>

</style>
