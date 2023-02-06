import axios from 'axios'
import { BaseURL } from './Constants/EnvConstants'

export default axios.create({
  baseURL: BaseURL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})
