export const BASE_RECOMMENDATION_URL = 'https://api.reelgood.com/v1/roulette/netflix?'
export const BASE_IMAGE_URL = 'https://img.reelgood.com/content/show'
export const IMAGE_POSTFIX = 'poster-780.jpg'

export const BASE_OPTIONS = {
  nocache: true,
  kind: 0,
  minimumScore: 0,
  sources: [
    'amazon_prime',
    'fx_tveverywhere',
    'hbo',
    'netflix',
    'showtime',
    'starz'
  ],
  free: true
}

export const MAX_SCORE = 9
