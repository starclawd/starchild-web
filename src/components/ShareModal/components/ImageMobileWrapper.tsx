/**
 * 移动端图片展示组件
 * 基于Carousel组件实现的移动端图片轮播展示
 * 用于在移动端展示分享图片列表
 */

import { Dispatch, SetStateAction, useCallback } from 'react'
import Carousel from 'components/Carousel'
import { ImgListType } from 'store/application/application.d'
import { ImageMobileWrapper } from '../styles'

/**
 * 移动端图片展示组件属性接口
 */
interface ImageMobileWrapperProps {
  imgList: ImgListType[]           // 图片列表数据
  setImgIndex: Dispatch<SetStateAction<any>>    // 设置当前展示图片索引的函数
}

/**
 * 移动端图片展示组件
 * 将图片列表以轮播的形式展示，支持滑动切换
 */
export default function ImageMobileWrapperCom({
  imgList,
  setImgIndex,
}: ImageMobileWrapperProps) {
  /**
   * 图片切换回调函数
   * 当轮播切换时触发，更新当前展示的图片索引
   */
  const onChange = useCallback((index: number) => {
    setImgIndex(index)
  }, [setImgIndex])

  return <ImageMobileWrapper>
    <Carousel dataList={imgList} onChange={onChange} />
  </ImageMobileWrapper>
} 