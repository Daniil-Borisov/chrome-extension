import { GiphyFetch } from '@giphy/js-fetch-api'

const useGiphy = () => {
  const BASE_URL: any = process.env.REACT_APP_GIPHY_API_KEY
  const gf = new GiphyFetch(BASE_URL)

  const fetchGifs: any = async (offset: number) => await gf.trending({ offset, limit: 30 })
  const searchGifs: any = async (searchValue: string) => await gf.search(searchValue, { sort: 'relevant', lang: 'en', limit: 10, type: 'stickers' })

  return [
    fetchGifs,
    searchGifs
  ]
}

export default useGiphy