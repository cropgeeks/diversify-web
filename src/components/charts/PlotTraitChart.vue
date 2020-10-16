<template>
  <div v-if="data && data.length > 0">
    <b-button @click="$emit('clear')">Clear</b-button>
    <div v-for="cd in chartData" :key="`plot-level-chart-${cd.trait.traitId}`">
      <h3>{{ cd.trait.traitname }} - <small>{{ cd.site.name }} - {{ cd.trait.year }}</small></h3>

      <div :ref="`plot-data-${cd.trait.traitId}`" />
    </div>
  </div>
</template>

<script>
import Vue from 'vue'

export default {
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    data: function (newValue, oldValue) {
      this.chartData = {}
      newValue.forEach(n => {
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

        Vue.set(this.chartData, n[0].traitId, {
          trait: {
            year: n[0].year,
            traitname: n[0].traitname,
            traitId: n[0].traitId
          },
          site: {
            id: n[0].siteid,
            name: n[0].partnername
          },
          data: data
        })

        const id = n[0].traitId
        this.$nextTick(() => {
          this.$plotly.purge(this.$refs[`plot-data-${id}`][0])
          this.$plotly.plot(this.$refs[`plot-data-${id}`][0], this.chartData[id].data, this.plotLayout, this.plotOptions)
        })
      })
    }
  },
  data: function () {
    return {
      chartData: {},
      plotLayout: {
        xaxis: {
          title: 'Value'
        },
        hovermode: 'closest',
        boxmode: 'group'
      },
      plotOptions: {
        responsive: true,
        displaylogo: false
      }
    }
  }
}
</script>

<style>

</style>
