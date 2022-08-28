import React, { PropsWithChildren } from 'react'

export type AnyObject = Record<string, any>

export type AnyArray = Array<any>

export type Callback = () => void

export type FC<T = AnyObject> = React.FC<PropsWithChildren<T>>

export type NotUndefinded<Type> = Type extends undefined ? never : Type

export type RequiredBy<Type, Key extends keyof Type> = Omit<Type, Key> &
  Required<{
    [P in Key]: NotUndefinded<Type[Key]>
  }>
