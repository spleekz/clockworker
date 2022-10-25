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

export type NonNullableProperties<T> = { [P in keyof T]: NonNullable<T[P]> }
