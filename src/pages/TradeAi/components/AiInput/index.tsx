import styled, { css } from 'styled-components'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { useCloseStream, useFileList, useInputValue, useIsFocus, useIsRenderingData, useIsShowDefaultUi, useSendAiContent } from 'store/tradeai/hooks'
import { IconBase } from 'components/Icons'
import { useTheme } from 'store/themecache/hooks'
import InputArea from 'components/InputArea'
import { vm } from 'pages/helper'
import { BorderAllSide1PxBox } from 'styles/borderStyled'
import Shortcuts from '../Shortcuts'
import FileShow from './components/FileShow'
import VoiceRecord from './components/VoiceRecord'
import VoiceItem from '../ContentItem/components/VoiceItem'
import { useIsMobile } from 'store/application/hooks'
import TypeSelect from './components/TypeSelect'
import { ANI_DURATION } from 'constants/index'

const AiInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  ${({ theme }) => !theme.isMobile && css`
    padding: 12px 12px 0px;
  `}
`

const AiInputOutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  ${({ theme }) => theme.isMobile && css`
    padding: 0 ${vm(12)};
  `}
`

const AiInputContentWrapper = styled(BorderAllSide1PxBox)<{ $value: string, $isHandleRecording: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 8px 8px;
  background: ${({ theme }) => theme.bgL1};
  backdrop-filter: blur(8px);
  ${({ theme, $isHandleRecording }) => theme.isMobile && css`
    flex-direction: row;
    align-items: flex-end;
    gap: 0;
    padding: ${vm(16)} ${vm(110)} ${vm(16)} ${vm(16)};
    min-height: ${vm(60)};
    #waveform {
      width: ${vm(164)};
      height: ${vm(24)};
    }
    ${$isHandleRecording && css`
      padding: 0;
    `}
  `}
`

const RecordingWrapper = styled.div`
  align-items: center;
  width: 100%;
  height: 60px;
  ${({ theme }) => theme.isMobile && css`
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
      font-size: .16rem;
      font-weight: 500;
      line-height: .24rem;
      color: ${({ theme }) => theme.jade10};
    }
  `}
`

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  flex-shrink: 1;
  ${({ theme }) => !theme.isMobile && css`
    width: 100%;
    padding: 0 8px;
    gap: 8px;
    flex-direction: row;
    align-items: flex-end;
  `}
`

const Handle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 10px;
  ${({ theme }) => theme.isMobile && css`
    justify-content: flex-start;
    width: auto;
    position: absolute;
    bottom: ${vm(8)};
    right: ${vm(8)};
    gap: ${vm(8)};
    width: auto;
  `}
`

const ChatFileButton = styled(BorderAllSide1PxBox)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background-color: transparent;
  .icon-chat-upload {
    font-size: 18px;
    color: ${({ theme }) => theme.textL2};
  }
  ${({ theme }) => theme.isMobile && css`
    width: ${vm(44)};
    height: ${vm(44)};
    .icon-chat-upload {
      font-size: ${vm(18)};
    }
  `}
`

const SendButton = styled(ChatFileButton)<{ $value: boolean }>`
  .icon-chat-send {
    font-size: 18px;
  }
  background-color: ${({ theme }) => theme.jade10};
  cursor: pointer;
  transition: all ${ANI_DURATION}s;
  ${({ theme }) => theme.isMobile && css`
    .icon-chat-send {
      font-size: ${vm(18)};
    }
  `}
  ${({ $value }) => !$value && css`
    background-color: transparent;
    .icon-chat-send {
      color: ${({ theme }) => theme.textL4};
    }
  `}
`

const FileUpload = styled.input`
  display: none;
  position: absolute;
`

export default memo(function AiInput() {
  const theme = useTheme()
  const isMobile = useIsMobile()
  const isShowDefaultUi = useIsShowDefaultUi()
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const sendAiContent = useSendAiContent()
  const [isFocus, setIsFocus] = useIsFocus()
  const closeStream = useCloseStream()
  const inputContentWrapperRef = useRef<HTMLDivElement>(null)
  const [isRenderingData, setIsRenderingData] = useIsRenderingData()
  const [isHandleRecording, setIsHandleRecording] = useState(false)
  const [value, setValue] = useInputValue()
  const [voiceUrl, setVoiceUrl] = useState('')
  
  const [isRecording, setIsRecording] = useState(false)
  const [fileList, setFileList] = useFileList()
  const [audioDuration, setAudioDuration] = useState(0)
  const [resultVoiceImg, setResultVoiceImg] = useState('')
  const onFocus = useCallback(() => {
    setIsFocus(true)
  }, [setIsFocus])
  const onBlur = useCallback(() => {
    setTimeout(() => {
      setIsFocus(false)
    }, 200)
  }, [setIsFocus])
  const requestStream = useCallback(async() => {
    sendAiContent({
      value,
      inputRef,
    })
  }, [value, sendAiContent])
  const handleImageChange = useCallback((e: any) => {
    const files = [...e.target.files]
    // const validFiles = files.filter(
    //   (file) => file.type.startsWith('image/') && file.type !== 'image/gif'
    // )
    if (files.length !== files.length) {
      // promptInfo(PromptInfoType.ERROR, <Trans>GIF images are not allowed.</Trans>)
    }
    const list = [
      ...fileList,
      ...files,
    ]
    setFileList(list)
    
    // 重置文件输入框的值，这样可以再次选择同一个文件
    e.target.value = ''
  }, [fileList, setFileList])
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
  useEffect(() => {
    if (isShowDefaultUi) {
      setIsFocus(true)
    }
  }, [isShowDefaultUi, setIsFocus])
  return <AiInputWrapper
    onTouchStart={e => e.stopPropagation()}
    onTouchMove={e => e.stopPropagation()}
    onTouchEnd={e => e.stopPropagation()}
  >
    <Shortcuts />
    <AiInputOutWrapper>
      <AiInputContentWrapper
        $value={value}
        $isHandleRecording={isHandleRecording}
        $borderColor={(value || (isFocus && !isMobile)) ? theme.jade10 : theme.bgT30}
        $borderRadius={isMobile ? 36 : 24}
        ref={inputContentWrapperRef as any}
      >
        <RecordingWrapper style={{ display: isHandleRecording ? 'flex' : 'none' }}>
          <canvas id="waveform" width="492" height="72" style={{ background: 'transparent', display: isRecording ? 'block' : 'none' }} />
          {isHandleRecording && !isRecording && voiceUrl && <VoiceItem
            isAiInput={true}
            voiceUrl={voiceUrl}
            resultVoiceImg={resultVoiceImg}
            deleteVoice={deleteVoice}
          />}
          {!(isHandleRecording && !isRecording && voiceUrl) && <span>{formatDuration(audioDuration)}</span>}
        </RecordingWrapper>
        {
          !isHandleRecording && 
            <InputWrapper>
              <InputArea
                autoFocus={isShowDefaultUi}
                value={value}
                setValue={setValue}
                onFocus={onFocus}
                onBlur={onBlur}
                placeholder={isRecording ? 'Recording' : 'Type your message...'}
                enterConfirmCallback={requestStream}
              />
              <FileShow />
              {!isMobile && <TypeSelect />}
            </InputWrapper>
        }
        <Handle>
          <span></span>
          {/* {!isHandleRecording && <ChatFileButton
            $borderRadius="50%"
            $borderColor={theme.bgT30}
            onClick={uploadImg}
          >
            <IconBase className="icon-chat-upload" />
          </ChatFileButton>} */}
          {
            (value || (isHandleRecording && !isRecording) || !isMobile)
              ? <SendButton
                $borderRadius="50%"
                $hideBorder={true}
                $value={!!value}
                onClick={isRenderingData ? stopLoadingMessage : requestStream}
              >
                <IconBase className="icon-chat-send" />
              </SendButton>
              : null
              // <VoiceRecord
              //   isRecording={isRecording}
              //   isHandleRecording={isHandleRecording}
              //   setVoiceUrl={setVoiceUrl}
              //   setIsRecording={setIsRecording}
              //   setResultVoiceImg={setResultVoiceImg}
              //   setAudioDuration={setAudioDuration}
              //   setIsHandleRecording={setIsHandleRecording}
              // />
          }
        </Handle>
        <FileUpload
          multiple
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={fileInputRef as any}
        />
      </AiInputContentWrapper>
    </AiInputOutWrapper>
  </AiInputWrapper>
})
