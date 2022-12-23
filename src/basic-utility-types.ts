import React, { PropsWithChildren } from 'react'

export type AnyObject = Record<string, any>

export type AnyArray = Array<any>

export type Callback = () => void

export type FC<T = unknown> = React.FC<PropsWithChildren<T>>

export type NotUndefinded<T> = T extends undefined ? never : T

export type RequiredBy<T, K extends keyof T> = Omit<T, K> &
  Required<{
    [P in K]: NotUndefinded<T[P]>
  }>

export type NonNullableProperties<T, K extends keyof T = keyof T> = {
  [P in keyof T]: P extends K ? NonNullable<T[P]> : T[P]
}

export type Merge<A, B> = A | B extends AnyObject
  ? Omit<A, keyof B> & Omit<B, keyof A> & { [K in keyof (A | B)]: Merge<A[K], B[K]> }
  : B

export type DeepPartial<T> = T extends AnyObject ? { [K in keyof T]?: DeepPartial<T[K]> } : T

export type Properties<T> = T[keyof T]

export type OverwriteProperties<T, P> = Record<keyof T, P>
