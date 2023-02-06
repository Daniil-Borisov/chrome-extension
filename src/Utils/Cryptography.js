/* eslint-disable no-bitwise */
import { LOG } from '../../Utils/debug';

const salt = '~!@#$%^&*()_+QWERTYUIOP{}ASDFGHJKL:ZXCVBNM<>?'
export default class Cryptography {
  static EncryptString(text) {
    const textToChars = (currentText) => currentText.split('').map((c) => c.charCodeAt(0))
    const byteHex = (n) => `0${Number(n).toString(16)}`.substr(-2)
    const applySaltToChar = (code) => textToChars(salt).reduce((a, b) => a ^ b, code)

    const encryptedString = text
      .split('')
      .map(textToChars)
      .map(applySaltToChar)
      .map(byteHex)
      .join('')

    return encryptedString;
  }

  static DecryptString(text) {
    let decryptedString = ''
    try {
      const textToChars = (currentText) => currentText.split('').map((c) => c.charCodeAt(0))
      const applySaltToChar = (code) => textToChars(salt).reduce((a, b) => a ^ b, code)
      decryptedString = text
        .match(/.{1,2}/g)
        .map((hex) => parseInt(hex, 16))
        .map(applySaltToChar)
        .map((charCode) => String.fromCharCode(charCode))
        .join('')
    } catch (error) {
      LOG(4, 'DecryptString - err', error)
    }

    return decryptedString
  }
}
