<template>
  <div>
    <b-input v-model="filter" placeholder="Filter" />

    <b-table striped hover :items="traits" :fields="fields" :filter="filter" :per-page="10" :current-page="currentPage" />

    <b-pagination
      v-model="currentPage"
      :total-rows="traits.length"
      :per-page="10" />
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      filter: null,
      currentPage: 1,
      traits: [],
      fields: [{
        key: 'traitname',
        label: 'Trait name',
        sortable: true
      }, {
        key: 'traitcode',
        label: 'Trait code',
        sortable: true
      }, {
        key: 'speciesDataPoints',
        label: 'Species data points',
        sortable: true
      }, {
        key: 'plotDataPoints',
        label: 'Plot data points',
        sortable: true
      }]
    }
  },
  mounted: function () {
    this.apiGetTraits(result => {
      this.traits = result
    })
  }
}
</script>

<style>

</style>
