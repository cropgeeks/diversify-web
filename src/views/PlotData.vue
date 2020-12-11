<template>
  <div>
    <l-map
      :zoom="zoom"
      class="location-map"
      ref="map">
      <l-tile-layer
        :url="url"
        :attribution="attribution"/>
      <l-marker v-for="(l, index) in locationsWithGps" :key="`map-marker-${index}`" :lat-lng="l.latLng">
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
          <li v-for="(l, index) in locationsWithoutGps" :key="`list-item-${index}`">
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
          <PlotTraitTable :selectedTraits="selectedTraits" :locationId="location ? location.id : null" @traits-selected="onTraitSelected" />
          <PlotTraitChart :plotData="plotData" v-on:clear="clearCharts"/>
        </div>
      </div>
    </b-container>
  </div>
</template>

<script>
import L from 'leaflet'
import ViewGridIcon from 'vue-material-design-icons/ViewGrid.vue'
import ViewSequentialIcon from 'vue-material-design-icons/ViewSequential.vue'
import ViewParallelIcon from 'vue-material-design-icons/ViewParallel.vue'
import PlotTraitChart from '@/components/charts/PlotTraitChart'
import PlotTraitTable from '@/components/PlotTraitTable'

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
    ViewGridIcon,
    ViewParallelIcon,
    ViewSequentialIcon,
    PlotTraitChart,
    PlotTraitTable
  },
  filters: {
    toFixed: function (v) {
      return v.toFixed(2)
    }
  },
  methods: {
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
      this.plotTraitChartColors = {}
    },
    onTraitSelected: function (trait) {
      if (this.selectedTraits.indexOf(this.location.id + '-' + trait.traitid) === -1) {
        this.selectedTraits.push(this.location.id + '-' + trait.traitid)

        this.apiGetSiteTraitData(this.location.id, trait.traitid, trait.datasetid, result => this.plotData.push(result))
      } else {
        this.selectedTraits = this.selectedTraits.filter(t => t !== (this.location.id + '-' + trait.traitid))
        this.plotData = this.plotData.filter(d => d[0].traitId !== trait.traitid || d[0].siteid !== this.location.id)
      }
    }
  },
  mounted: function () {
    this.apiGetLocations(result => {
      var withGps = result.filter(l => {
        return l.latitude && l.longitude
      })
      this.locationsWithoutGps = result.filter(l => {
        return !l.latitude || !l.longitude
      })
      withGps.forEach(l => {
        l.latLng = L.latLng(l.latitude, l.longitude)
      })
      this.locationsWithGps = withGps

      this.locationsWithGps.forEach(l => {
        this.latLngBounds.extend(l.latLng)
      })

      if (this.locationsWithGps.length === 1) {
        this.$refs.map.setCenter(this.locationsWithGps[0].latLng)
        // this.$refs.map.setZoom(10)
        this.zoom = 10
      } else {
        this.$refs.map.fitBounds(this.latLngBounds.pad(0.1))
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
