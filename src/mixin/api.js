import store from '../store'

export default {
  methods: {
    apiGetVarieties: function (onSuccess) {
      this.unauthAjax({ url: this.getBaseUrl() + 'variety', success: onSuccess })
    },
    apiGetVarietyData: function (varietyIds, traitIds, onSuccess) {
      this.unauthAjax({ url: this.getBaseUrl() + 'variety/data', data: { traitIds: traitIds, varietyIds: varietyIds }, success: onSuccess })
    },
    apiGetVarietyDataTraits: function (onSuccess) {
      this.unauthAjax({ url: this.getBaseUrl() + 'variety/data/trait', success: onSuccess })
    },
    apiGetLocations: function (onSuccess) {
      this.unauthAjax({ url: this.getBaseUrl() + 'site', success: onSuccess })
    },
    apiGetLocationStats: function (siteId, onSuccess) {
      this.unauthAjax({ url: this.getBaseUrl() + 'site/' + siteId + '/summary', success: onSuccess })
    },
    apiGetSiteTraitData: function (siteId, traitId, datasetId, onSuccess) {
      this.unauthAjax({ url: this.getBaseUrl() + 'site/' + siteId + '/data/' + traitId, data: { datasetId: datasetId }, success: onSuccess })
    },
    apiGetTraitPlotData: function (traitIds, onSuccess) {
      this.unauthAjax({ url: this.getBaseUrl() + 'trait/' + traitIds + '/plot', dataType: 'blob', success: onSuccess })
    },
    apiGetTraitSpeciesData: function (traitIds, onSuccess) {
      this.unauthAjax({ url: this.getBaseUrl() + 'trait/' + traitIds + '/species', dataType: 'blob', success: onSuccess })
    },
    apiGetTraits: function (onSuccess) {
      this.unauthAjax({ url: this.getBaseUrl() + 'trait', success: onSuccess })
    },
    getBaseUrl () {
      return store.getters.baseUrl
    }
  }
}
