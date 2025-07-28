/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prefer-regex-literals */
import { useEffect, useRef } from 'react'

export function usePrevious(value: any) {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })

  return ref.current
}

export const useMount = (func: any | undefined) => useEffect(() => func(), [])

export function isFacebookApp() {
  const ua = navigator.userAgent || navigator.vendor

  return ua.indexOf('FBAN') > -1 || ua.indexOf('FBAV') > -1
}

export function isMobileBrowser() {
  const toMatch = [/Android/i, /iPhone/i, /BlackBerry/i, /Windows Phone/i]

  return toMatch.some(toMatchItem => {
    return navigator.userAgent.match(toMatchItem)
  })
}

export async function toBase64(file: any) {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

export function toUpperCaseSentence(words = '') {
  try {
    const finalSentence = words.toLowerCase().replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase())

    return finalSentence
  } catch (e) {
    return ''
  }
}

export function toTitleCaseSentence(words = '') {
  try {
    const finalSentence = words.replace(/^_*(.)|_+(.)/g, (_, c, d) => (c ? c.toUpperCase() : ' ' + d.toUpperCase()))

    return finalSentence.toUpperCase()
  } catch (error) {
    return ''
  }
}

export function isWhiteSpace(value: string) {
  const reWhiteSpace = new RegExp(/^\s+$/)
  if (reWhiteSpace.test(value)) {
    return true
  }

  return false
}

export function tuncateText(text = '', max = 20) {
  if (text.length > max) {
    return text.substring(0, max) + '...'
  } else {
    return text
  }
}

//= parseOperator("0889014745");
export function parseOperator(phone: string) {
  const OperatorPrefix: any = {
    telkomsel: ['0812', '0813', '0821', '0822', '0852', '0853', '0823', '0851'],
    indosat: ['0814', '0815', '0816', '0855', '0856', '0857', '0858'],
    tri: ['0895', '0896', '0897', '0898', '0899'],
    smartfren: ['0881', '0882', '0883', '0884', '0885', '0886', '0887', '0888', '0889'],
    xl: ['0817', '0818', '0819', '0859', '0877', '0878'],
    axis: ['0838', '0831', '0832', '0833'],
    bolt: ['0999', '0998']
  }

  if (phone.length > 13)
    return {
      operator: null
    }

  for (const name in OperatorPrefix) {
    const _operator = OperatorPrefix[name]

    for (const index in _operator) {
      if (phone.startsWith(_operator[index]))
        return {
          operator: name,
          prefix: _operator[index],
          phone: phone
        }
    }
  }

  return {
    operator: null
  }
}

export function ShowNumberPhoneSplit(phone: string) {
  return phone.slice(0, 3).concat(' ').concat(phone.slice(3, 7)).concat(' ').concat(phone.slice(7, 12))
}

/**
 * cookie helper methods
 */

export const getCookieFromServer = (key: string, req: any) => {
  if (!req.headers.cookie) {
    return undefined
  }
  const rawCookie = req.headers.cookie.split(';').find((c: any) => c.trim().startsWith(`${key}=`))
  if (!rawCookie) {
    return undefined
  }

  return rawCookie.split('=')[1]
}

export const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8

    return v.toString(16)
  })
}
