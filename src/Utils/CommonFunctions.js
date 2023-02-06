import { LOG } from '../../Utils/debug';
export const jsonTryParse = (value) => {
  if (value) {
    let jsonObject = null

    try {
      jsonObject = JSON.parse(value)
    } catch (error) {
      LOG(2, 'jsonTryParse - JSON Parse Error', error)
    }

    return jsonObject
  }

  return null
}
