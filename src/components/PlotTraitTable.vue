<template>
  <div>
    <b-input v-model="filter" placeholder="Filter" class="border-bottom-0 table-filter" />

    <b-table striped hover responsive outlined show-empty small class="mb-0"
             :items="siteStats"
             :fields="fields"
             :filter="filter"
             :per-page="10"
             head-variant="dark"
             :current-page="currentPage"
             :sort-by.sync="sortBy"
             @filtered="onFiltered">
      <template v-slot:cell(min)="data">{{ data.item.min | toFixed }}</template>
      <template v-slot:cell(avg)="data">{{ data.item.avg | toFixed }}</template>
      <template v-slot:cell(max)="data">{{ data.item.max | toFixed }}</template>
      <template v-slot:cell(stdv)="data">{{ data.item.stdv | toFixed }}</template>
      <template v-slot:cell(selected)="data">
        <b-button v-if="selectedTraits.indexOf(locationId + '-' + data.item.traitid) !== -1"
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
      :total-rows="totalRows"
      :per-page="10" />
  </div>
</template>

<script>
import MinusBoxIcon from 'vue-material-design-icons/MinusBox.vue'
import PlusBoxIcon from 'vue-material-design-icons/PlusBox.vue'

export default {
  props: {
    locationId: {
      type: Number,
      default: null
    },
    selectedTraits: {
      type: Array,
      default: () => []
    }
  },
  data: function () {
    return {
      filter: null,
      currentPage: 1,
      totalRows: 0,
      siteStats: [],
      sortBy: 'traitname',
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
        key: 'year',
        label: 'Year',
        sortable: true
      }, {
        key: 'datasetname',
        label: 'Dataset',
        sortable: true
      }, {
        key: 'min',
        label: 'Minimum',
        class: 'text-right',
        sortable: true
      }, {
        key: 'avg',
        label: 'Average',
        class: 'text-right',
        sortable: true
      }, {
        key: 'max',
        label: 'Maximum',
        class: 'text-right',
        sortable: true
      }, {
        key: 'stdv',
        label: 'Standard deviation',
        class: 'text-right',
        sortable: true
      }, {
        key: 'selected',
        label: '',
        sortable: false
      }]
    }
  },
  watch: {
    locationId: {
      immediate: true,
      handler: function (newValue) {
        this.apiGetLocationStats(newValue, result => {
          if (result) {
            result.forEach(r => { r.selected = false })
          }
          this.siteStats = result
          this.totalRows = result.length
        })
      }
    }
  },
  components: {
    MinusBoxIcon,
    PlusBoxIcon
  },
  filters: {
    toFixed: function (v) {
      return v.toFixed(2)
    }
  },
  methods: {
    onFiltered: function (filteredItems) {
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    select: function (row, select) {
      this.siteStats.filter(function (t) {
        return t.traitid === row.traitid
      })[0].selected = select

      // this.selected = this.siteStats.filter(function (t) {
      //   return t.selected
      // })

      this.$emit('traits-selected', row)
    }
  }
}
</script>

<style>
.table-filter {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}
.table-pagination .page-link {
  border-top: 0;
}
.table-pagination .page-item:first-child .page-link {
  border-top-left-radius: 0;
}
.table-pagination .page-item:last-child .page-link {
  border-top-right-radius: 0;
}
</style>
