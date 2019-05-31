<template>
  <div>
    <v-client-table class="table-sm" :data="traits" :columns="traitColumns" :options="traitOptions" ref="table">
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
      traits: [],
      allMarked: false,
      traitColumns: ['traitname', 'traitcode', 'unit', 'plots', 'datapoints', 'select'],
      traitOptions: {
        headings: {
          traitname: 'Trait',
          traitcode: 'Code',
          unit: 'Unit',
          plots: '# Plots',
          datapoints: '# Datapoints',
          select: ''
        },
        sortable: ['traitname', 'traitcode', 'unit', 'plots', 'datapoints'],
        filterable: ['traitname', 'traitcode', 'unit', 'plots', 'datapoints'],
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
      this.traits.filter(function (c) {
        return c.id === row.id
      })[0].selected = select

      this.$emit('on-trait-selected', row, select)
    }
  },
  mounted: function () {
    var vm = this

    this.apiGetVarietyDataTraits(function (result) {
      result.forEach(function (c) {
        c.selected = false
      })
      vm.traits = result
    })
  }
}
</script>

<style>

</style>
