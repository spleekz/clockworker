import { observer } from 'mobx-react-lite'
import React, { CSSProperties, useEffect } from 'react'
import styled from 'styled-components'

import { Callback, FC, RequiredBy } from 'basic-utility-types'
import { XLg } from 'react-bootstrap-icons'

import { useStore } from 'stores/root-store/context'

import { PortalToBody } from 'components/utility/portal-to-body'

export type PopupTemplateProps = {
  width: string
  height: string
  styles: RequiredBy<CSSProperties, 'backgroundColor'>
  title?: string
  withCloseButton: boolean
  isOpened: boolean
  fnForClosing?: Callback
  afterClose?: Callback
}

export const Popup: FC<PopupTemplateProps> = observer(
  ({
    width,
    height,
    styles,
    title,
    withCloseButton,
    isOpened,
    fnForClosing,
    afterClose,
    children,
  }) => {
    const { appStore } = useStore()

    useEffect(() => {
      if (isOpened) {
        appStore.increaseOpenedPopupsCount()
      }

      return () => {
        //Закрытие попапа
        if (isOpened === true) {
          afterClose?.()
          appStore.decreaseOpenedPopupsCount()
        }
      }
    }, [isOpened])

    if (!isOpened) {
      return null
    }

    return (
      <PortalToBody>
        <PopupContainer>
          <PopupBlock width={width} height={height} style={styles}>
            {(withCloseButton || title) && (
              <PopupHeading>
                {title && <PopupTitle>{title}</PopupTitle>}
                {withCloseButton && (
                  <ClosePopupButton onClick={fnForClosing}>
                    <XLg size={32} />
                  </ClosePopupButton>
                )}
              </PopupHeading>
            )}
            <PopupBody>{children}</PopupBody>
          </PopupBlock>
        </PopupContainer>
      </PortalToBody>
    )
  },
)

const PopupContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #00000083;
`
const PopupBlock = styled.div<{ width: string; height: string; color?: string }>`
  display: flex;
  flex-direction: column;
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  position: relative;
  padding: 20px;
  border-radius: 16px;
  background-color: #ffffff;
  box-shadow: 0px 0px 25px 8px rgba(34, 60, 80, 0.2);
`
const PopupHeading = styled.div`
  min-height: 32px;
  position: relative;
  margin-bottom: 15px;
`
const PopupTitle = styled.h2`
  font-size: 36px;
  text-align: center;
`
const ClosePopupButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  background-color: transparent;
`
const PopupBody = styled.div`
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
`
