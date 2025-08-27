import styled, { css } from 'styled-components'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  useAiResponseContentList,
  useCloseStream,
  useFileList,
  useInputValue,
  useIsFocus,
  useIsLoadingData,
  useIsRenderingData,
  useSendAiContent,
  useTempAiContentData,
} from 'store/chat/hooks'
import { IconBase } from 'components/Icons'
import { useTheme } from 'store/themecache/hooks'
import InputArea from 'components/InputArea'
import { vm } from 'pages/helper'
import { BorderAllSide1PxBox } from 'styles/borderStyled'
// import Shortcuts from '../Shortcuts'
import FileShow from './components/FileShow'
// import VoiceRecord from './components/VoiceRecord'
import VoiceItem from '../ContentItem/components/VoiceItem'
import { useIsMobile } from 'store/application/hooks'
import TypeSelect from './components/TypeSelect'
import { ANI_DURATION } from 'constants/index'
import { Trans } from '@lingui/react/macro'
import Recommendations from './components/Recommendations'
import Robot from './components/Robot'

const AiInputWrapper = styled.div<{ $isFromMyAgent: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 28px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(28)};
    `}
  ${({ $isFromMyAgent }) =>
    $isFromMyAgent &&
    css`
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
    `}
`

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'PowerGrotesk';
  font-size: 84px;
  font-style: normal;
  font-weight: 200;
  line-height: 1;
  text-transform: uppercase;
  color: ${({ theme }) => theme.white};
`

const AiInputOutWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const AiInputContentWrapper = styled.div<{ $value: string; $isHandleRecording: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  padding: 12px;
  background: ${({ theme }) => theme.black700};
  backdrop-filter: blur(8px);
  border-radius: 24px;
  ${({ theme, $isHandleRecording }) =>
    theme.isMobile &&
    css`
      gap: ${vm(20)};
      padding: ${vm(12)};
      border-radius: ${vm(24)} ${vm(24)} 0 0;
      #waveform {
        width: ${vm(164)};
        height: ${vm(24)};
      }
      ${$isHandleRecording &&
      css`
        padding: 0;
      `}
    `}
`

const ClickWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
`

const RecordingWrapper = styled.div`
  position: relative;
  align-items: center;
  width: 100%;
  height: 60px;
  z-index: 2;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      height: ${vm(60)};
      padding: ${vm(8)};
      padding-left: ${vm(16)};
      gap: ${vm(20)};
      .voice-img {
        width: ${vm(44)};
        height: ${vm(44)};
      }
      .result-voice-img {
        width: ${vm(164)};
        height: ${vm(32)};
      }
      span {
        font-size: 0.16rem;
        font-weight: 500;
        line-height: 0.24rem;
        color: ${({ theme }) => theme.jade10};
      }
    `}
`

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  min-height: 40px;
  flex-grow: 1;
  flex-shrink: 1;
  z-index: 2;
  ${({ theme }) =>
    !theme.isMobile &&
    css`
      width: 100%;
      padding: 0 8px;
      gap: 8px;
    `}
`

const Handle = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 40px;
  gap: 10px;
  z-index: 2;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(10)};
    `}
`

const ChatFileButton = styled(BorderAllSide1PxBox)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  background-color: transparent;
  .icon-chat-upload {
    font-size: 18px;
    color: ${({ theme }) => theme.textL2};
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: ${vm(40)};
      height: ${vm(40)};
      .icon-chat-upload {
        font-size: ${vm(18)};
      }
    `}
`

const SendButton = styled(ChatFileButton)<{ $value: boolean }>`
  background-color: ${({ theme }) => theme.brand200};
  cursor: pointer;
  transition: all ${ANI_DURATION}s;
  .icon-chat-back {
    font-size: 20px;
    transform: rotate(90deg);
    color: ${({ theme }) => theme.textL1};
    transition: all ${ANI_DURATION}s;
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      .icon-chat-back {
        font-size: ${vm(20)};
      }
    `}
  ${({ $value }) =>
    !$value &&
    css`
      background-color: ${({ theme }) => theme.text10};
      .icon-chat-back {
        color: ${({ theme }) => theme.textL3};
      }
    `}
`

const FileUpload = styled.input`
  display: none;
  position: absolute;
`

export default memo(function AiInput({ isFromMyAgent = false }: { isFromMyAgent?: boolean }) {
  const theme = useTheme()
  const isMobile = useIsMobile()
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const sendAiContent = useSendAiContent()
  const [isFocus, setIsFocus] = useIsFocus()
  const closeStream = useCloseStream()
  const inputContentWrapperRef = useRef<HTMLDivElement>(null)
  const [isLoadingData] = useIsLoadingData()
  const [isRenderingData, setIsRenderingData] = useIsRenderingData()
  const [isHandleRecording, setIsHandleRecording] = useState(false)
  const [value, setValue] = useInputValue()
  const [voiceUrl, setVoiceUrl] = useState('')
  const [aiResponseContentList] = useAiResponseContentList()
  const tempAiContentData = useTempAiContentData()

  const [isRecording, setIsRecording] = useState(false)
  const [fileList, setFileList] = useFileList()
  const [audioDuration, setAudioDuration] = useState(0)
  const [resultVoiceImg, setResultVoiceImg] = useState('')
  const isEmpty = useMemo(() => {
    return aiResponseContentList.length === 0 && !tempAiContentData.id
  }, [aiResponseContentList, tempAiContentData])
  const onFocus = useCallback(() => {
    setIsFocus(true)
  }, [setIsFocus])
  const onBlur = useCallback(() => {
    setTimeout(() => {
      setIsFocus(false)
    }, 200)
  }, [setIsFocus])
  const requestStream = useCallback(async () => {
    if (!value || isLoadingData) {
      return
    }
    sendAiContent({
      value,
    })
  }, [value, sendAiContent, isLoadingData])
  const handleImageChange = useCallback(
    (e: any) => {
      const files = [...e.target.files]
      // const validFiles = files.filter(
      //   (file) => file.type.startsWith('image/') && file.type !== 'image/gif'
      // )
      if (files.length !== files.length) {
        // promptInfo(PromptInfoType.ERROR, <Trans>GIF images are not allowed.</Trans>)
      }
      const list = [...fileList, ...files]
      setFileList(list)

      // 重置文件输入框的值，这样可以再次选择同一个文件
      e.target.value = ''
    },
    [fileList, setFileList],
  )
  const uploadImg = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const formatDuration = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }, [])

  const stopLoadingMessage = useCallback(() => {
    if (isRenderingData) {
      closeStream()
      setIsRenderingData(false)
      window.abortController?.abort()
    }
  }, [isRenderingData, setIsRenderingData, closeStream])
  const deleteVoice = useCallback(() => {
    setVoiceUrl('')
    setResultVoiceImg('')
    setAudioDuration(0)
    setIsRecording(false)
    setIsHandleRecording(false)
    setAudioDuration(0)
  }, [])
  useEffect(() => {
    return () => {
      setFileList([])
      setValue('')
      setIsFocus(false)
    }
  }, [setIsFocus, setValue, setFileList, setIsRenderingData])
  const handleWrapperClick = useCallback(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <AiInputWrapper
      $isFromMyAgent={isFromMyAgent}
      onTouchStart={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
      onTouchEnd={(e) => e.stopPropagation()}
    >
      {isEmpty && !isFromMyAgent && (
        <LogoWrapper>
          <Trans>starchild</Trans>
        </LogoWrapper>
      )}
      <AiInputOutWrapper>
        <AiInputContentWrapper
          $value={value}
          $isHandleRecording={isHandleRecording}
          ref={inputContentWrapperRef as any}
        >
          <ClickWrapper onClick={handleWrapperClick}></ClickWrapper>
          <RecordingWrapper style={{ display: isHandleRecording ? 'flex' : 'none' }}>
            <canvas
              id='waveform'
              width='492'
              height='72'
              style={{ background: 'transparent', display: isRecording ? 'block' : 'none' }}
            />
            {isHandleRecording && !isRecording && voiceUrl && (
              <VoiceItem
                isAiInput={true}
                voiceUrl={voiceUrl}
                resultVoiceImg={resultVoiceImg}
                deleteVoice={deleteVoice}
              />
            )}
            {!(isHandleRecording && !isRecording && voiceUrl) && <span>{formatDuration(audioDuration)}</span>}
          </RecordingWrapper>
          {!isHandleRecording && (
            <InputWrapper>
              <InputArea
                autoFocus={false}
                value={value}
                ref={inputRef as any}
                setValue={setValue}
                onFocus={onFocus}
                onBlur={onBlur}
                disabled={isLoadingData}
                placeholder={isRecording ? 'Recording' : 'Type your message...'}
                enterConfirmCallback={requestStream}
              />
              <FileShow />
            </InputWrapper>
          )}
          <Handle>
            {isEmpty ? <Robot isFocus={isFocus || !!value} /> : <TypeSelect />}
            {/* {!isHandleRecording && <ChatFileButton
            $borderRadius={22}
            $borderColor={theme.bgT30}
            onClick={uploadImg}
          >
            <IconBase className="icon-chat-upload" />
          </ChatFileButton>} */}
            <SendButton
              $borderRadius={22}
              $hideBorder={true}
              $value={!!value}
              onClick={isRenderingData ? stopLoadingMessage : requestStream}
            >
              <IconBase className='icon-chat-back' />
            </SendButton>
            {/* <VoiceRecord
                isRecording={isRecording}
                isHandleRecording={isHandleRecording}
                setVoiceUrl={setVoiceUrl}
                setIsRecording={setIsRecording}
                setResultVoiceImg={setResultVoiceImg}
                setAudioDuration={setAudioDuration}
                setIsHandleRecording={setIsHandleRecording}
              /> */}
          </Handle>
          <FileUpload multiple type='file' accept='image/*' onChange={handleImageChange} ref={fileInputRef as any} />
        </AiInputContentWrapper>
      </AiInputOutWrapper>
      {isEmpty && !isFromMyAgent && <Recommendations />}
    </AiInputWrapper>
  )
})
