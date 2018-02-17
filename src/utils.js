import * as Constants from './constants'

export function getImageURL (id) {
  return `${Constants.BASE_IMAGE_URL}/${id}/${Constants.IMAGE_POSTFIX}`
}

export function getRecommendationUrl ({activeTab, minimumScore}) {
  let params = ''
  let modifieldFilter = Object.assign({}, Constants.BASE_OPTIONS)
  modifieldFilter.kind = activeTab === Constants.TV_SHOWS ? 1 : 2
  modifieldFilter.minimumScore = minimumScore

  const keys = Object.keys(modifieldFilter)
  keys.forEach((key, index) => {
    params += `${key}=${modifieldFilter[key]}`
    if (index < keys.length - 1) {
      params += '&'
    }
  })
  return Constants.BASE_RECOMMENDATION_URL + params
}