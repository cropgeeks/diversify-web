import store from '../store'

export default {
  methods: {
    apiGetVarieties: function (onSuccess) {
      this.unauthAjax({ url: this.getBaseUrl() + 'variety', success: onSuccess })
    },
    apiGetVarietyData: function (varietyIds, traitIds, onSuccess) {
      this.unauthAjax({ url: this.getBaseUrl() + 'variety/data?traitIds=' + traitIds + '&varietyIds=' + varietyIds, success: onSuccess })
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
      this.unauthAjax({ url: this.getBaseUrl() + 'site/' + siteId + '/data/' + traitId + '?datasetId=' + datasetId, success: onSuccess })
    },
    getBaseUrl () {
      return store.getters.baseUrl
    }
  }
}