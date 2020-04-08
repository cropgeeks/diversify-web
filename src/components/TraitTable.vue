<template>
  <div>
    <b-input v-model="filter" placeholder="Filter" />

    <b-table striped hover responsive outlined show-empty small :items="traits" :fields="fields" :filter="filter" :per-page="10" :current-page="currentPage">
      <template v-slot:cell(selected)="data">
        <b-button v-if="data.item.selected"
                size="sm"
                variant="danger"
                @click="select(data.item, false)"><MinusBoxIcon :width="5" :height="5" /></b-button>
        <b-button v-else
                  size="sm"
                  variant="success"
                  @click="select(data.item, true)"><PlusBoxIcon :width="5" :height="5" /></b-button>
      </template>
    </b-table>

    <b-pagination
      v-model="currentPage"
      :total-rows="traits.length"
      :per-page="10" />
  </div>
</template>

<script>
import MinusBoxIcon from 'vue-material-design-icons/MinusBox.vue'
import PlusBoxIcon from 'vue-material-design-icons/PlusBox.vue'

export default {
  data: function () {
    return {
      filter: null,
      currentPage: 1,
      traits: [],
      selected: [],
      fields: [{
        key: 'traitname',
        label: 'Trait name',
        sortable: true
      }, {
        key: 'traitcode',
        label: 'Trait code',
        sortable: true
      }, {
        key: 'unit',
        label: 'Unit',
        sortable: true
      }, {
        key: 'speciesDataPoints',
        label: 'Species data points',
        sortable: true
      }, {
        key: 'plotDataPoints',
        label: 'Plot data points',
        sortable: true
      }, {
        key: 'selected',
        label: '',
        sortable: false
      }]
    }
  },
  components: {
    MinusBoxIcon,
    PlusBoxIcon
  },
  methods: {
    select: function (row, select) {
      this.traits.filter(function (t) {
        return t.id === row.id
      })[0].selected = select

      this.selected = this.traits.filter(function (t) {
        return t.selected
      })

      this.$emit('traits-selected', this.selected)
    }
  },
  mounted: function () {
    this.apiGetTraits(result => {
      result.forEach(c => { c.selected = false })
      this.traits = result
    })
  }
}
</script>

<style>

</style>
