<template>
  <div>
    <l-map
      :zoom="zoom"
      class="location-map"
      ref="map">
      <l-tile-layer
        :url="url"
        :attribution="attribution"/>
      <l-marker v-for="l in locations" :key="l.site + l.location" :lat-lng="l.latLng">
        <l-popup class="location-map-popup">
          <p><b>Site: </b> <router-link :to="'/location/' + l.sitename">{{ l.sitename }}</router-link></p>
          <p><b>Partner: </b> {{ l.partnername }}</p>
          <b-button variant="primary" @click="onLocationSelected(l)">Select</b-button>
        </l-popup>
      </l-marker>
    </l-map>
    <b-container v-if="location">
      <h1>{{ location.sitename }} ({{ location.partnername }})</h1>
      <b-row>
        <b-col cols=12 md=4 class="mb-3">
          <b-card bg-variant="dark" text-variant="white">
            <b-row>
              <b-col cols=3>
                <ViewGridIcon class="location-icon"/>
              </b-col>
              <b-col cols=9 class="text-right">
                <div class="category-value">{{ location.plots }}</div>
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
                <div class="category-value">{{ location.rows }}</div>
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
                <div class="category-value">{{ location.columns }}</div>
                <div>Max. columns</div>
              </b-col>
            </b-row>
          </b-card>
        </b-col>
      </b-row>
      <v-client-table v-if="siteStats && siteStats.length > 0" class="table-sm" :data="siteStats" :columns="siteStatsColumns" :options="siteStatsOptions" >
        <template slot="min" slot-scope="props">{{ props.row.min | toFixed }}</template>
        <template slot="avg" slot-scope="props">{{ props.row.avg | toFixed }}</template>
        <template slot="max" slot-scope="props">{{ props.row.max | toFixed }}</template>
        <template slot="stdv" slot-scope="props">{{ props.row.stdv | toFixed }}</template>
        <b-button size=sm
                  variant="primary"
                  slot="select"
                  slot-scope="props"
                  @click="onTraitSelected(props.row)"><MagnifyIcon class="action-icon"/></b-button>
      </v-client-table>

      <div v-if="plotData[0].x.length > 0">
        <h3>{{ trait.traitname }}</h3>
        <VuePlotly :data="plotData" :layout="plotLayout" :options="plotOptions" />
      </div>
    </b-container>
  </div>
</template>

<script>
import L from 'leaflet'
import MagnifyIcon from 'vue-material-design-icons/Magnify.vue'
import ViewGridIcon from 'vue-material-design-icons/ViewGrid.vue'
import ViewSequentialIcon from 'vue-material-design-icons/ViewSequential.vue'
import ViewParallelIcon from 'vue-material-design-icons/ViewParallel.vue'

import VuePlotly from '@statnett/vue-plotly'

export default {
  data: function () {
    return {
      locations: [],
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
        perPage: Number.MAX_SAFE_INTEGER,
        perPageValues: []
      },
      location: null,
      trait: null,
      zoom: 3,
      latLngBounds: L.latLngBounds(),
      url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      plotData: [{
        x: [],
        type: 'histogram',
        xaxis: 'x',
        yaxis: 'y',
        name: ''
      }, {
        x: [],
        type: 'box',
        xaxis: 'x',
        yaxis: 'y2',
        boxpoints: false,
        name: '',
        boxmean: 'sd'
      }],
      plotLayout: {
        xaxis: {
          title: 'Value'
        },
        yaxis: {
          title: 'Count'
        },
        hovermode: 'closest',
        showlegend: false,
        grid: {
          rows: 2,
          columns: 1,
          subplots: [
            ['xy'],
            ['xy2']
          ]
        }
      },
      plotOptions: {
        displaylogo: false
      }
    }
  },
  components: {
    MagnifyIcon,
    VuePlotly,
    ViewGridIcon,
    ViewParallelIcon,
    ViewSequentialIcon
  },
  filters: {
    toFixed: function (v) {
      return v.toFixed(2)
    }
  },
  methods: {
    onLocationSelected: function (l) {
      this.location = l
      var vm = this

      this.apiGetLocationStats(l.id, function (result) {
        vm.siteStats = result
      })
    },
    onTraitSelected: function (trait) {
      this.trait = trait
      var vm = this
      this.apiGetSiteTraitData(this.location.id, trait.traitid, trait.datasetid, function (result) {
        vm.plotData[0].x = result.map(function (d) {
          return +d.value
        })
        vm.plotData[1].x = result.map(function (d) {
          return +d.value
        })
      })
    }
  },
  mounted: function () {
    var vm = this

    this.apiGetLocations(function (result) {
      result = result.filter(function (l) {
        return l.latitude && l.longitude
      })
      result.forEach(function (l) {
        l.latLng = L.latLng(l.latitude, l.longitude)
      })
      vm.locations = result

      vm.locations.forEach(function (l) {
        vm.latLngBounds.extend(l.latLng)
      })

      if (vm.locations.length === 1) {
        vm.$refs.map.setCenter(vm.locations[0].latLng)
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
