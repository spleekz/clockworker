import { AnyObject } from 'basic-utility-types'

import { isObject } from './objects'

const areSameArrays = (array1: Array<any>, array2: Array<any>): boolean => {
  const length1 = array1.length
  const length2 = array2.length

  if (length1 === length2) {
    return array1.every((el, index) => areSame(el, array2[index]))
  }

  return false
}

const areSameObjects = (object1: AnyObject, object2: AnyObject): boolean => {
  const length1 = Object.keys(object1).length
  const length2 = Object.keys(object2).length

  if (length1 === length2) {
    return Object.keys(object1).every((key) => areSame(object1[key], object2[key]))
  }

  return false
}

export const areSame = (value1: any, value2: any): boolean => {
  if (typeof value1 === typeof value2) {
    if (isObject(value1) && isObject(value2)) {
      return areSameObjects(value1, value2)
    } else if (Array.isArray(value1) && Array.isArray(value2)) {
      return areSameArrays(value1, value2)
    } else {
      return value1 === value2
    }
  }

  return false
}
