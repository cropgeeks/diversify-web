import axios from 'axios'

export default {
  data: function () {
    return {
      colors: ['#910080', '#ff7c00', '#5ec418', '#00a0f1', '#c5e000', '#ff007a', '#222183', '#c83831', '#fff600']
    }
  },
  methods: {
    uuidv4: function () {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0
        var v = c === 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
      })
    },
    unauthAjax ({ url = null, method = 'GET', data = null, dataType = 'json', contentType = 'application/json; charset=utf-8', success = null, error = null }) {
      var requestData = null
      var requestParams = null

      // Stringify the data object for non-GET requests
      if (data !== null || data !== undefined) {
        if (method === 'GET') {
          requestParams = data
        } else {
          requestData = data
        }
      }

      const promise = axios({
        url: url,
        method: method,
        data: requestData,
        params: requestParams,
        crossDomain: true,
        responseType: dataType,
        headers: {
          'Content-Type': contentType
        }
      })

      promise.then(result => {
        if (success) {
          success(result.data)
        }
      })

      promise.catch(err => {
        if (error) {
          error(err.response)
        }
      })
    }
  }
}
