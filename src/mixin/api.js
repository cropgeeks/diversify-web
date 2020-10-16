export default {
  methods: {
    apiGetVarieties: function (onSuccess) {
      this.unauthAjax({ url: 'variety', success: onSuccess })
    },
    apiGetVarietyData: function (varietyIds, traitIds, onSuccess) {
      this.unauthAjax({ url: 'variety/data', data: { traitIds: traitIds, varietyIds: varietyIds }, success: onSuccess })
    },
    apiGetVarietyDataTraits: function (onSuccess) {
      this.unauthAjax({ url: 'variety/data/trait', success: onSuccess })
    },
    apiGetLocations: function (onSuccess) {
      this.unauthAjax({ url: 'site', success: onSuccess })
    },
    apiGetLocationStats: function (siteId, onSuccess) {
      this.unauthAjax({ url: 'site/' + siteId + '/summary', success: onSuccess })
    },
    apiGetSiteTraitData: function (siteId, traitId, datasetId, onSuccess) {
      this.unauthAjax({ url: 'site/' + siteId + '/data/' + traitId, data: { datasetId: datasetId }, success: onSuccess })
    },
    apiGetTraitPlotData: function (traitIds, onSuccess) {
      this.unauthAjax({ url: 'trait/' + traitIds + '/plot', dataType: 'blob', success: onSuccess })
    },
    apiGetTraitSpeciesData: function (traitIds, onSuccess) {
      this.unauthAjax({ url: 'trait/' + traitIds + '/species', dataType: 'blob', success: onSuccess })
    },
    apiGetTraits: function (onSuccess) {
      this.unauthAjax({ url: 'trait', success: onSuccess })
    },
    apiGetVarietyTraitStats: function (varietyId, onSuccess) {
      this.unauthAjax({ url: `variety/${varietyId}/traitstats`, success: onSuccess })
    }
  }
}
