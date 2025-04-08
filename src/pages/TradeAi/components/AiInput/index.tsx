
import styled, { css } from 'styled-components'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useAudioTransferText, useCloseStream, useFileList, useInputValue, useIsFocus, useIsLoadingData, useIsRenderingData, useSendAiContent } from 'store/tradeai/hooks'
import { IconAiMessageSend, IconImgUpload } from 'components/Icons'
import CloseWrapper from 'components/Close'
import { Trans } from '@lingui/react/macro'
import { t } from "@lingui/core/macro"
import { useIsDarkMode, useTheme } from 'store/theme/hooks'
import AiLoading from '../AiLoading'
import InputArea from 'components/InputArea'
import { TRADE_AI_TYPE } from 'store/tradeai/tradeai.d'

const AiInputWrapper = styled.div<{ tradeAiTypeProp: TRADE_AI_TYPE }>`
  display: flex;
  flex-direction: column;
  ${({ tradeAiTypeProp, theme }) =>
    tradeAiTypeProp === TRADE_AI_TYPE.ORDER_TYPE &&
    css`
      padding: 0 12px;
    `
  }
`

const AiInputContentWrapper = styled.div<{ tradeAiTypeProp: TRADE_AI_TYPE }>`
  position: relative;
  display: flex;
  align-items: flex-end;
  gap: 10px;
  padding: 14px;
  border-radius: 12px;
  background-color: ${({ theme, tradeAiTypeProp }) => (tradeAiTypeProp !== TRADE_AI_TYPE.PAGE_TYPE)? theme.bg7 : theme.bg3};
  ${({ tradeAiTypeProp, theme }) =>
    tradeAiTypeProp === TRADE_AI_TYPE.CHAT_TYPE &&
    css`
      background-color: ${theme.bg1};
      box-shadow: ${theme.selectShadow};
    `
  }
  ${({ theme }) => theme.isMobile && css`
    background-color: ${theme.bg7};
  `}
`

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  flex-shrink: 1;
  gap: 14px;
`
const PlaceholderWrapper = styled.div`
  position: absolute;
  bottom: -1px;
  left: 4px;
  font-weight: 600;
  font-size: 14px;
  line-height: 24px;
  white-space: nowrap;
  color: ${({ theme }) => theme.text4};
`
const ImgList = styled.div`
  display: flex;
  width: 100%;
  height: auto;
  padding-top: 10px;
  gap: 8px;
`

const ImgItem = styled.div`
  position: relative;
  display: flex;
  flex-shrink: 0;
  .fake-close-wrapper {
    width: 20px;
    height: 20px;
    top: -10px;
    right: -10px;
    .close-wrapper {
      width: 20px;
      height: 20px;
      .icon-close {
        font-size: 10px;
      }
    }
  }
  img {
    width: 56px;
    height: 56px;
    border-radius: 8px;
  }
`

const SendButton = styled.div<{ disabled: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  cursor: pointer;
  background-color: ${({ theme }) => theme.line4};
  ${({ disabled }) =>
    disabled &&
    css`
      cursor: not-allowed;
    `
  }
`

const SendLoadingButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.green};
  span {
    width: 8px;
    height: 8px;
    border-radius: 2px;
    background-color: ${({ theme }) => theme.darkMode ? theme.line1 : theme.bg1};
  }
`

const Handle = styled.div<{ tradeAiTypeProp: TRADE_AI_TYPE }>`
  display: flex;
  align-items: center;
  gap: 10px;
  .line {
    width: 1px;
    height: 16px;
    background-color: ${({ theme }) => theme.line1};
  }
  .model-select-value {
    cursor: pointer;
  }
  ${({ tradeAiTypeProp }) =>
    tradeAiTypeProp === TRADE_AI_TYPE.ORDER_TYPE &&
    css`
      gap: 5px;
    `
  }
`

const FileUpload = styled.input`
  display: none;
  position: absolute;
`

const Shortcuts = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
`

const ShortcutItem = styled.div`
  border-radius: 8px;
`


export default memo(function AiInput({
  tradeAiTypeProp,
}: {
  tradeAiTypeProp: TRADE_AI_TYPE
}) {
  const theme = useTheme()
  const isDark = useIsDarkMode()
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const sendAiContent = useSendAiContent()
  const [, setIsFocus] = useIsFocus()
  const closeStream = useCloseStream()
  const inputContentWrapperRef = useRef<HTMLDivElement>(null)
  const [isRenderingData, setIsRenderingData] = useIsRenderingData()
  const [audioVolume, setAudioVolume] = useState(0)
  const [value, setValue] = useInputValue()
  const triggerAudioTranscriptions = useAudioTransferText()
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [isLoading, setIsLoading] = useIsLoadingData()
  const [fileList, setFileList] = useFileList()
  const shortcutsList = useMemo(() => {
    return [
      {
        key: t`Place an order for me`,
        callback: () => {
          sendAiContent({
            value: t`Place an order for me`,
          })
        },
      },
      {
        key: t`Generate an idea`,
        callback: () => {
          sendAiContent({
            value: t`Generate an idea`,
          })
        },
      },
    ]
  }, [sendAiContent])
  
  const onFocus = useCallback(() => {
    setIsFocus(true)
  }, [setIsFocus])
  const onBlur = useCallback(() => {
    setTimeout(() => {
      setIsFocus(false)
    }, 200)
  }, [setIsFocus])
  const deleteImg = useCallback((deleteIndex: number) => {
    return () => {
      const list = fileList.filter((data, index) => index !== deleteIndex)
      setFileList(list)
    }
  }, [fileList, setFileList])
  const requestStream = useCallback(async() => {
    sendAiContent({
      value,
      inputRef,
    })
  }, [value, sendAiContent])
  const handleImageChange = useCallback((e: any) => {
    const files = [...e.target.files]
    const validFiles = files.filter(
      (file) => file.type.startsWith('image/') && file.type !== 'image/gif'
    )
    if (validFiles.length !== files.length) {
      // promptInfo(PromptInfoType.ERROR, <Trans>GIF images are not allowed.</Trans>)
    }
    const list = [
      ...fileList,
      ...validFiles,
    ]
    setFileList(list)
  }, [fileList, setFileList])
  const uploadImg = useCallback(() => {
    fileInputRef.current?.click()
  }, [])
  const stopRecording = useCallback(() => {
    mediaRecorder?.stop()
    setIsRecording(false)
    setAudioVolume(0)
  }, [mediaRecorder])
  const uploadAudio = useCallback(async (audioBlob: Blob) => {
    try {
      setIsLoading(true)
      const data = await triggerAudioTranscriptions(audioBlob)
      if (data.isSuccess) {
        const text = data.data.text
        setValue(text)
      }
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      // promptInfo(PromptInfoType.ERROR, handleError(error).message)
    }
  }, [setIsLoading, setValue, triggerAudioTranscriptions])
  const monitorVolume = useCallback((stream: MediaStream) => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    // 创建 AnalyserNode 来分析音频数据
    const analyser = audioContext.createAnalyser()
    analyser.fftSize = 2048 // 设置 FFT 大小，控制频率域分辨率
    const source = audioContext.createMediaStreamSource(stream) // 将媒体流作为音频源
    source.connect(analyser)
    // 创建数据数组用于存储音频数据
    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    const getVolume = () => {
      analyser.getByteTimeDomainData(dataArray) // 获取实时音频数据

      // 计算当前音量大小
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        const value = dataArray[i] / 128 - 1 // 将数据归一化到 [-1, 1]
        sum += value * value // 计算平方和
      }
      const rms = Math.sqrt(sum / dataArray.length) // 均方根值
      const volume = Math.min(rms, 1) // 计算音量，限制在 0-1 之间

      setAudioVolume(volume) // 更新音量大小

      // 循环调用，保持实时更新
      requestAnimationFrame(getVolume)
    }
    getVolume()
  }, [])
  const startRecording = useCallback(async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia && !isLoading && !isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const recorder = new MediaRecorder(stream)
        setMediaRecorder(recorder)
        recorder.start()
        setIsRecording(true)
        const chunks: Blob[] = []
        recorder.ondataavailable = (event) => {
          chunks.push(event.data)
        }
        recorder.onstop = () => {
          const audioBlob = new Blob(chunks, { type: 'audio/wav' })
          // const audioURL = window.URL.createObjectURL(audioBlob)
          // console.log('audioURL', audioURL)
          uploadAudio(audioBlob)  // 上传音频并转成文字
          stream.getTracks().forEach(track => track.stop())
        }
        monitorVolume(stream)
      } catch (error) {
        // promptInfo(PromptInfoType.ERROR, handleError(error).message)
      }
    } else {
      // promptInfo(PromptInfoType.ERROR, <Trans>Your browser does not support audio recording.</Trans>)
    }
  }, [isLoading, isRecording, monitorVolume, uploadAudio])
  const stopLoadingMessage = useCallback(() => {
    if (isRenderingData || isLoading) {
      closeStream()
      setIsRenderingData(false)
      setIsLoading(false)
      stopRecording()
      window.abortController?.abort()
    }
  }, [isLoading, isRenderingData, setIsRenderingData, setIsLoading, stopRecording, closeStream])

  useEffect(() => {
    return () => {
      setFileList([])
      setValue('')
      setIsFocus(false)
      // setIsLoading(false)
      // setIsRenderingData(false)
    }
  }, [setIsFocus, setValue, setIsLoading, setFileList, setIsRenderingData])
  return <AiInputWrapper tradeAiTypeProp={tradeAiTypeProp}>
    <Shortcuts>
      {shortcutsList.map((shortcut) => (
        <ShortcutItem key={shortcut.key} onClick={shortcut.callback}>
          {shortcut.key}
        </ShortcutItem>
      ))}
    </Shortcuts>
    <AiInputContentWrapper 
      ref={inputContentWrapperRef as any} 
      tradeAiTypeProp={tradeAiTypeProp}
    >
      <AiLoading
        audioVolume={audioVolume}
        isLoading={isLoading}
        isRecording={isRecording}
        onClick={isRecording ? stopRecording : startRecording}
      />
      <InputWrapper>
        {fileList.length > 0 && <ImgList className="scroll-style">
          {fileList.map((file, index) => {
            const { lastModified } = file
            const src = URL.createObjectURL(file)
            return <ImgItem key={String(lastModified)}>
              <CloseWrapper onClick={deleteImg(index)} />
              <img src={src} alt="" />
            </ImgItem>
          })}
        </ImgList>}
        <InputArea
          value={value}
          setValue={setValue}
          disabled={isLoading || isRecording}
          onFocus={onFocus}
          onBlur={onBlur}
          enterConfirmCallback={requestStream}
        />
        {!value && <PlaceholderWrapper>
          {isRecording
            ? <Trans>Recording</Trans>
            : isLoading ? <Trans>Thinking...</Trans> : <Trans>Ask AI anything...</Trans>}
        </PlaceholderWrapper>}
      </InputWrapper>
      <Handle tradeAiTypeProp={tradeAiTypeProp}>
        <IconImgUpload onClick={uploadImg} />
        <span className="line"></span>
        <SendButton 
          disabled={(!value && !isRenderingData && !isLoading)} 
          onClick={(isLoading || isRenderingData) ? stopLoadingMessage : requestStream}
        >
          {
            (isLoading || isRenderingData)
              ? <SendLoadingButton><span></span></SendLoadingButton>
              : <IconAiMessageSend 
                  color1={value ? theme.green : theme.line4} 
                  color2={isDark ? theme.line1 : theme.commonWhite} 
                />
          }
        </SendButton>
      </Handle>
      <FileUpload
        multiple
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        ref={fileInputRef as any}
      />
    </AiInputContentWrapper>
  </AiInputWrapper>
})
