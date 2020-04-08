<template>
  <div>
    <!-- This is where the chart goes -->
    <slot name="chart" ref="chart"/>
  </div>
</template>

<script>
export default {
  props: {
    width: {
      type: Function,
      default: () => 1280
    },
    height: {
      type: Function,
      default: () => 600
    },
    supportsSvgDownload: {
      type: Boolean,
      default: true
    },
    supportsPngDownload: {
      type: Boolean,
      default: true
    },
    filename: {
      type: Function,
      default: null
    },
    sourceFile: {
      type: Function,
      default: () => null
    },
    additionalMenuItems: {
      type: Array,
      default: null
    },
    additionalButtons: {
      type: Array,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    },
    chartType: {
      type: String,
      default: 'plotly'
    }
  },
  components: {
    ResizeObserver
  },
  methods: {
    handleResize: function () {
      if (this.chartType === 'plotly') {
        if (this.$slots.chart[0].elm) {
          this.$plotly.relayout(this.$slots.chart[0].elm, {
            // 'xaxis.autorange': true,
            // 'yaxis.autorange': true
          })
        }
      } else {
        this.$emit('resize')
      }
    },
    downloadSource: function () {
      var request = this.sourceFile()

      request.filename = request.filename + '-' + window.moment(new Date()).format('YYYY-MM-DD-HH-mm-ss')

      if (!request.extension) {
        request.extension = 'txt'
      }

      this.downloadBlob(request)
    },
    getFilename: function (imageType) {
      this.imageType = imageType
      if (this.filename) {
        this.userFilename = this.filename()
      }
      this.$refs.chartModal.show()
    },
    download: function () {
      this.$refs.chartModal.hide()

      if (this.imageType === 'svg') {
        this.downloadSvgsFromContainer(this.$slots.chart[0].elm, this.chartType === 'plotly', this.userFilename + '-' + window.moment(new Date()).format('YYYY-MM-DD-HH-mm-ss'))
      } else if (this.imageType === 'png') {
        this.$plotly.downloadImage(this.$slots.chart[0].elm, { format: 'png', width: this.width(), height: this.height(), filename: this.userFilename + '-' + window.moment(new Date()).format('YYYY-MM-DD-HH-mm-ss') })
      }
    }
  }
}
</script>

<style>

</style>
