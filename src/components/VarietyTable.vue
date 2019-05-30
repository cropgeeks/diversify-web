<template>
  <div>
    <v-client-table class="table-sm" :data="varieties" :columns="varietyColumns" :options="varietyOptions" ref="table">
      <span class="font-italic" slot="croplatinname" slot-scope="props">{{ props.row.croplatinname }}
      </span>
      <b-button v-if="props.row.selected"
                size=sm
                variant="danger"
                slot="select"
                slot-scope="props"
                @click="select(props.row, false)"><MinusBoxIcon :width="5" :height="5" /></b-button>
      <b-button v-else
                size=sm
                variant="success"
                slot="select"
                slot-scope="props"
                @click="select(props.row, true)"><PlusBoxIcon /></b-button>
    </v-client-table>
  </div>
</template>

<script>
import MinusBoxIcon from 'vue-material-design-icons/MinusBox.vue'
import PlusBoxIcon from 'vue-material-design-icons/PlusBox.vue'

export default {
  data: function () {
    return {
      varieties: [],
      allMarked: false,
      varietyColumns: ['varietyname', 'cropcommonname', 'croplatinname', 'plantpartnername', 'plots', 'datapoints', 'select'],
      varietyOptions: {
        headings: {
          varietyname: 'Variety',
          cropcommonname: 'Species common name',
          croplatinname: 'Species latin name',
          plantpartnername: 'Plant partner',
          plots: '# Plots',
          datapoints: '# Datapoints',
          select: ''
        },
        sortable: ['varietyname', 'cropcommonname', 'croplatinname', 'plantpartnername', 'plots', 'datapoints'],
        filterable: ['varietyname', 'cropcommonname', 'croplatinname', 'plantpartnername', 'plots', 'datapoints'],
        perPage: Number.MAX_SAFE_INTEGER,
        perPageValues: []
      }
    }
  },
  components: {
    MinusBoxIcon,
    PlusBoxIcon
  },
  methods: {
    select: function (row, select) {
      this.varieties.filter(function (c) {
        return c.varietyname === row.varietyname && c.cropcommonname === row.cropcommonname && c.croplatinname === row.croplatinname && c.plantpartnername === row.plantpartnername
      })[0].selected = select
    }
  },
  mounted: function () {
    var vm = this

    this.apiGetVarieties(function (result) {
      result.forEach(function (c) {
        c.selected = false
      })
      vm.varieties = result
    })
  }
}
</script>

<style>

</style>
