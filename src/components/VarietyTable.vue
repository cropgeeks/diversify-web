<template>
  <div>
    <b-input v-model="filter" placeholder="Filter" class="border-bottom-0 table-filter" />

    <b-table striped hover responsive outlined show-empty small class="mb-0"
             :items="varieties"
             :fields="fields"
             :filter="filter"
             :per-page="10"
             head-variant="dark"
             :current-page="currentPage"
             :sort-by.sync="sortBy">
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
      class="table-pagination"
      v-model="currentPage"
      :total-rows="varieties.length"
      :per-page="10" />
  </div>
</template>

<script>
import MinusBoxIcon from 'vue-material-design-icons/MinusBox.vue'
import PlusBoxIcon from 'vue-material-design-icons/PlusBox.vue'

export default {
  data: function () {
    return {
      varieties: [],
      fields: [{
        key: 'varietyname',
        label: 'Variety',
        sortable: true
      }, {
        key: 'cropcommonname',
        label: 'Species common name',
        sortable: true
      }, {
        key: 'croplatinname',
        label: 'Species latin name',
        sortable: true
      }, {
        key: 'plantpartnername',
        label: 'Plant partner',
        sortable: true
      }, {
        key: 'plots',
        label: '# Plots',
        sortable: true
      }, {
        key: 'datapoints',
        label: '# Datapoints',
        sortable: true
      }, {
        key: 'selected',
        label: '',
        sortable: false
      }],
      filter: null,
      currentPage: 1,
      selected: [],
      sortBy: 'traitname'
    }
  },
  components: {
    MinusBoxIcon,
    PlusBoxIcon
  },
  methods: {
    select: function (row, select) {
      this.varieties.filter(function (t) {
        return t.id === row.id
      })[0].selected = select

      this.selected = this.varieties.filter(function (t) {
        return t.selected
      })

      this.$emit('variety-selected', row, select)
    }
  },
  mounted: function () {
    this.apiGetVarieties(result => {
      result.forEach(c => { c.selected = false })
      this.varieties = result
    })
  }
}
</script>

<style>

</style>
