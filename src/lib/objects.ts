import { AnyObject, Merge } from 'basic-utility-types'

export const isObject = (value: any): boolean => {
  return typeof value === 'object' && !Array.isArray(value) && value !== null
}

export const merge = <T1 extends AnyObject, T2 extends AnyObject>(
  object1: T1,
  object2: T2,
): Merge<T1, T2> => {
  const merged = object1

  const mergeObjects = (target: AnyObject, source: AnyObject): void => {
    Object.keys(source).forEach((key) => {
      if (target[key] === undefined) {
        target[key] = source[key]
      } else {
        if (isObject(target[key]) && isObject(source[key])) {
          mergeObjects(target[key], source[key])
        } else {
          target[key] = source[key]
        }
      }
    })
  }

  mergeObjects(merged, object2)

  return merged as Merge<T1, T2>
}
