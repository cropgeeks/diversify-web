<template>
  <div>
    <l-map
      :zoom="zoom"
      class="location-map"
      ref="map">
      <l-tile-layer
        :url="url"
        :attribution="attribution"/>
      <l-marker v-for="l in locationsWithGps" :key="l.sitename + l.othername + l.createdOn" :lat-lng="l.latLng">
        <l-popup class="location-map-popup">
          <!-- <p><b>Site: </b> <router-link :to="'/location/' + l.sitename">{{ l.sitename }}</router-link></p> -->
          <p><b>Site: </b> {{ l.sitename }}</p>
          <p><b>Partner: </b> {{ l.partnername }}</p>
          <b-button variant="primary" @click="onLocationSelected(l)">Select</b-button>
        </l-popup>
      </l-marker>
    </l-map>
    <b-container>
      <div v-if="locationsWithoutGps && locationsWithoutGps.length > 0">
        <h2>Locations without GPS coordinates</h2>
        <ul>
          <li v-for="l in locationsWithoutGps" :key="l.sitename + l.othername">
            <a href="#" @click="onLocationSelected(l, $event)">{{ l.sitename }}</a>
          </li>
        </ul>
      </div>
      <div v-if="location">
        <h1>{{ location.sitename }} ({{ location.partnername }})</h1>
        <b-row>
          <b-col cols=12 md=4 class="mb-3">
            <b-card bg-variant="dark" text-variant="white">
              <b-row>
                <b-col cols=3>
                  <ViewGridIcon class="location-icon"/>
                </b-col>
                <b-col cols=9 class="text-right">
                  <div class="category-value">{{ location.plots ? location.plots : 'N/A' }}</div>
                  <div>Plots</div>
                </b-col>
              </b-row>
            </b-card>
          </b-col>
          <b-col cols=12 md=4 class="mb-3">
            <b-card bg-variant="dark" text-variant="white">
              <b-row>
                <b-col cols=3>
                  <ViewSequentialIcon class="location-icon"/>
                </b-col>
                <b-col cols=9 class="text-right">
                  <div class="category-value">{{ location.rows ? location.rows : 'N/A' }}</div>
                  <div>Max. rows</div>
                </b-col>
              </b-row>
            </b-card>
          </b-col>
          <b-col cols=12 md=4 class="mb-3">
            <b-card bg-variant="dark" text-variant="white">
              <b-row>
                <b-col cols=3>
                  <ViewParallelIcon class="location-icon"/>
                </b-col>
                <b-col cols=9 class="text-right">
                  <div class="category-value">{{ location.columns ? location.columns : 'N/A' }}</div>
                  <div>Max. columns</div>
                </b-col>
              </b-row>
            </b-card>
          </b-col>
        </b-row>
        <div v-if="siteStats && siteStats.length > 0">
          <v-client-table class="table-sm" :data="siteStats" :columns="siteStatsColumns" :options="siteStatsOptions" >
            <template slot="min" slot-scope="props">{{ props.row.min | toFixed }}</template>
            <template slot="avg" slot-scope="props">{{ props.row.avg | toFixed }}</template>
            <template slot="max" slot-scope="props">{{ props.row.max | toFixed }}</template>
            <template slot="stdv" slot-scope="props">{{ props.row.stdv | toFixed }}</template>
            <b-button size=sm
                      slot="select"
                      slot-scope="props"
                      :variant="isSelected(props.row) ? 'danger' : 'success'"
                      @click="onTraitSelected(props.row)">
              <MinusIcon class="action-icon" v-if="isSelected(props.row)" />
              <PlusIcon class="action-icon" v-else />
            </b-button>
          </v-client-table>

          <PlotTraitChart :data="plotData" v-on:clear="clearCharts"/>
        </div>
      </div>
    </b-container>
  </div>
</template>

<script>
import L from 'leaflet'
// import MagnifyIcon from 'vue-material-design-icons/Magnify.vue'
import PlusIcon from 'vue-material-design-icons/Plus'
import MinusIcon from 'vue-material-design-icons/Minus'
import ViewGridIcon from 'vue-material-design-icons/ViewGrid.vue'
import ViewSequentialIcon from 'vue-material-design-icons/ViewSequential.vue'
import ViewParallelIcon from 'vue-material-design-icons/ViewParallel.vue'
import PlotTraitChart from '@/components/charts/PlotTraitChart'

export default {
  data: function () {
    return {
      locationsWithGps: [],
      locationsWithoutGps: [],
      siteStats: [],
      siteStatsColumns: [ 'traitname', 'traitcode', 'unit', 'year', 'datasetname', 'min', 'avg', 'max', 'stdv', 'select' ],
      siteStatsOptions: {
        headings: {
          traitname: 'Trait name',
          traitcode: 'Trait code',
          unit: 'Unit',
          year: 'Year',
          datasetname: 'Dataset',
          min: 'Minimum',
          avg: 'Average',
          max: 'Maximum',
          stdv: 'Standard deviation',
          select: ''
        },
        columnsClasses: {
          min: 'text-right',
          avg: 'text-right',
          max: 'text-right',
          stdv: 'text-right'
        },
        sortable: [ 'traitname', 'traitcode', 'unit', 'datasetname', 'year', 'min', 'avg', 'max', 'stdv' ],
        filterable: [ 'traitname', 'traitcode', 'unit', 'datasetname', 'year', 'min', 'avg', 'max', 'stdv' ],
        perPage: 10,
        perPageValues: [10, 25, 50, 100],
        pagination: {
          nav: 'scroll'
        }
      },
      location: null,
      zoom: 3,
      latLngBounds: L.latLngBounds(),
      url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      plotData: [],
      selectedTraits: []
    }
  },
  components: {
    PlusIcon,
    MinusIcon,
    ViewGridIcon,
    ViewParallelIcon,
    ViewSequentialIcon,
    PlotTraitChart
  },
  filters: {
    toFixed: function (v) {
      return v.toFixed(2)
    }
  },
  methods: {
    isSelected: function (trait) {
      return this.selectedTraits.indexOf(this.location.id + '-' + trait.traitid) !== -1
    },
    onLocationSelected: function (l, event) {
      if (event) {
        event.preventDefault()
        event.stopPropagation()
      }

      this.location = l

      this.apiGetLocationStats(l.id, result => {
        this.siteStats = result
      })
    },
    clearCharts: function () {
      this.plotData = []
      this.selectedTraits = []
    },
    onTraitSelected: function (trait) {
      if (this.selectedTraits.indexOf(this.location.id + '-' + trait.traitid) === -1) {
        this.selectedTraits.push(this.location.id + '-' + trait.traitid)

        this.apiGetSiteTraitData(this.location.id, trait.traitid, trait.datasetid, result => {
          this.plotData.push(result)
        })
      } else {
        this.selectedTraits = this.selectedTraits.filter(t => t !== (this.location.id + '-' + trait.traitid))
        this.plotData = this.plotData.filter(d => d[0].traitId !== trait.traitid || d[0].siteid !== this.location.id)
      }
    }
  },
  mounted: function () {
    var vm = this

    this.apiGetLocations(function (result) {
      var withGps = result.filter(function (l) {
        return l.latitude && l.longitude
      })
      vm.locationsWithoutGps = result.filter(function (l) {
        return !l.latitude || !l.longitude
      })
      withGps.forEach(function (l) {
        l.latLng = L.latLng(l.latitude, l.longitude)
      })
      vm.locationsWithGps = withGps

      vm.locationsWithGps.forEach(function (l) {
        vm.latLngBounds.extend(l.latLng)
      })

      if (vm.locationsWithGps.length === 1) {
        vm.$refs.map.setCenter(vm.locationsWithGps[0].latLng)
        // vm.$refs.map.setZoom(10)
        vm.zoom = 10
      } else {
        vm.$refs.map.fitBounds(vm.latLngBounds.pad(0.1))
      }
    })
  }
}
</script>

<style>
  .location-map {
    height: 500px !important;
  }
  .location-map-popup > p {
    white-space: nowrap;
  }
  .category-value {
    font-size: 2em;
  }
  .location-icon.material-design-icon,
  .location-icon.material-design-icon > .material-design-icon__svg {
    height: 5em;
    width: 5em;
  }
  .action-icon.material-design-icon,
  .action-icon.material-design-icon > .material-design-icon__svg {
    height: 1.5em;
    width: 1.5em;
  }
</style>
