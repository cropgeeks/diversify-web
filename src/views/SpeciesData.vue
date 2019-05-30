<template>
  <b-container>
    <h1>Species data</h1>
    <h2>Varieties</h2>
    <VarietyTable />
    <h2>Traits</h2>
    <TraitTable />
  </b-container>
</template>

<script>
import VarietyTable from '../components/VarietyTable.vue'
import TraitTable from '../components/TraitTable.vue'

export default {
  components: {
    VarietyTable,
    TraitTable
  }
}
</script>

<style>

</style>
