import styled, { css } from 'styled-components'
import { ModalSafeAreaWrapper } from 'components/SafeAreaWrapper'
import { ANI_DURATION } from 'constants/index'

export const ShareWrapper = styled.div<{ imgLength?: number }>`
  display: flex;
  flex-direction: column;
  width: 704px;
  padding: 8px 32px 0;
  ${({ imgLength }) =>
    imgLength && imgLength > 1 &&
    css`
      width: 800px;
      padding: 8px 81px 0;
    `
  }
  .referral-id-wrapper {
    margin-top: 10px;
    .referral-id-item {
      height: 40px;
    }
  }
`

export const ShareMobileWrapper = styled(ModalSafeAreaWrapper)<{ imgLength?: number }>`
  display: flex;
  flex-direction: column;
  width: 100%;
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  font-weight: 800;
  font-size: 16px;
  line-height: 20px;
  height: 48px;
  margin-bottom: 8px;
  flex-shrink: 0;
  ${({ theme }) =>
    theme.isMobile && css`
      height: 50px;
      padding: 0 14px;
    `
  }
`

export const PortalWrapper = styled.div<{ length: number }>`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  z-index: 100;
  width: 100vw;
  height: calc(100% - 134px - constant(safe-area-inset-bottom));
  height: calc(100% - 134px - env(safe-area-inset-bottom));
  padding: 60px 0 0;
  overflow: hidden;
  .icon-toggle {
    display: none;
  }
  ${({ length }) =>
    length === 1 &&
    css`
      padding: 20px 0 20px;
    `
  }
`

export const ImgWrapper = styled.div<{ imgLength: number }>`
  position: relative;
  width: 100%;
  /* ${({ imgLength }) =>
    imgLength > 1 &&
    css`
      padding: 0 48px;
    `
  } */
  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: 100%;
    `
  }
`

export const ImgList = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  border-radius: 16px;
  overflow: hidden;
  img {
    flex-shrink: 0;
    width: 100%;
    height: 100%;
    transition: ${ANI_DURATION}s;
  }
`

export const OperatorWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 112px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      height: 60px;
    `
  }
`

export const Item = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: auto;
  height: 64px;
  cursor: pointer;
  .title {
    font-weight: 600;
    font-size: 12px;
    line-height: 16px;
    transition: all ${ANI_DURATION}s;
  }

  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: 50%;
      .icon {
        width: 36px;
        height: 36px;
      }
    `
  }
`

export const ItemIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-bottom: 8px;
  i {
    transition: all ${ANI_DURATION}s;
    font-size: 24px;
  }
`

export const LeftIcon = styled.div`
  position: absolute;
  top: 180px;
  left: -56px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  i {
    font-size: 12px;
  }
`

export const RightIcon = styled(LeftIcon)`
  left: unset;
  right: -56px;
  transform: rotate(180deg);
`

export const ImageMobileWrapper = styled.div`
  width: 100%;
  height: 100%;
`

export const ImgItem = styled.div`
  width: 100%;
  height: 100%;
  flex-shrink: 0;
  border-radius: 16px;
  overflow: hidden;
  transition: all ${ANI_DURATION}s;
` 