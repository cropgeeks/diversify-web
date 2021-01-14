<template>
  <div>
    <b-input v-model="filter" placeholder="Filter" class="border-bottom-0 table-filter" />

    <b-table striped hover responsive outlined show-empty small class="mb-0"
             :items="traits"
             :fields="fields"
             :filter="filter"
             :per-page="10"
             head-variant="dark"
             :current-page="currentPage"
             :sort-by.sync="sortBy"
             @filtered="onFiltered">
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
      :total-rows="totalRows"
      :per-page="10" />
  </div>
</template>

<script>
import MinusBoxIcon from 'vue-material-design-icons/MinusBox.vue'
import PlusBoxIcon from 'vue-material-design-icons/PlusBox.vue'

export default {
  props: {
    granularity: {
      type: String,
      default: null
    }
  },
  data: function () {
    let fields = [{
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
    }]

    if (this.granularity === null || this.granularity === 'species') {
      fields.push({
        key: 'speciesDataPoints',
        label: 'Species data points',
        sortable: true
      })
    }
    if (this.granularity === null || this.granularity === 'plot') {
      fields.push({
        key: 'plotDataPoints',
        label: 'Plot data points',
        sortable: true
      })
    }

    fields.push({
      key: 'selected',
      label: '',
      sortable: false
    })

    return {
      filter: null,
      currentPage: 1,
      totalRows: 0,
      traits: [],
      selected: [],
      sortBy: 'traitname',
      fields: fields
    }
  },
  components: {
    MinusBoxIcon,
    PlusBoxIcon
  },
  methods: {
    onFiltered: function (filteredItems) {
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
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
      this.totalRows = result.length
    })
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
