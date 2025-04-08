/**
 * PC端图片展示组件
 * 基于styled-components实现的PC端图片展示
 * 用于在PC端展示分享图片列表，支持左右切换
 */

import { Dispatch, SetStateAction, useCallback } from 'react'
import { IconBase } from 'components/Icons'
import { ImgWrapper, ImgList, ImgItem, LeftIcon, RightIcon } from '../styles'
import { ImgListType } from 'store/application/application.d'

/**
 * PC端图片展示组件属性接口
 */
interface ImageWrapperProps {
  imgList: ImgListType[]           // 图片列表数据
  imgIndex: number                 // 当前展示的图片索引
  imgLength: number               // 图片列表总长度
  setImgIndex: Dispatch<SetStateAction<any>>    // 设置当前展示图片索引的函数
}

/**
 * PC端图片展示组件
 * 将图片列表以横向滑动的形式展示，支持左右按钮切换
 */
export default function ImageWrapperCom({
  imgList,
  imgIndex,
  imgLength,
  setImgIndex,
}: ImageWrapperProps) {
  /**
   * 图片切换处理函数
   * 当点击左右切换按钮时触发，更新当前展示的图片索引
   */
  const changeIndex = useCallback((index: number) => {
    return () => {
      if (index < 0 || index > imgLength - 1) return
      setImgIndex(index)
    }
  }, [imgLength, setImgIndex])

  return (
    <ImgWrapper imgLength={imgLength}>
      {/* 左侧切换按钮，仅在多图时显示 */}
      {imgLength > 1 && <LeftIcon className="icon-toggle" disabled={imgIndex === 0} onClick={changeIndex(imgIndex - 1)}>
        <IconBase className="icon-back-arrow" />
      </LeftIcon>}
      <ImgList id="downloadWrapper">
        {imgList.map((data) => {
          const { key, customerItem } = data
          return <ImgItem key={key} style={{ transform: `translateX(-${imgIndex * 638}px)`}}>
            {customerItem}
          </ImgItem>
        })}
      </ImgList>
      {/* 右侧切换按钮，仅在多图时显示 */}
      {imgLength > 1 && <RightIcon className="icon-toggle" disabled={imgIndex === imgLength - 1} onClick={changeIndex(imgIndex + 1)}>
        <IconBase className="icon-back-arrow" />
      </RightIcon>}
    </ImgWrapper>
  )
} 