import styled, { css } from 'styled-components'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { useAudioTransferText, useCloseStream, useFileList, useInputValue, useIsFocus, useIsLoadingData, useIsRenderingData, useSendAiContent } from 'store/tradeai/hooks'
import { IconBase } from 'components/Icons'
import CloseWrapper from 'components/Close'
import { Trans } from '@lingui/react/macro'
import { useTheme } from 'store/theme/hooks'
import InputArea from 'components/InputArea'
import { vm } from 'pages/helper'
import { ANI_DURATION } from 'constants/index'
import { BorderBox } from 'styles/theme'
import Shortcuts from '../Shortcuts'

const AiInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const AiInputOutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 ${vm(12)};
`

const AiInputContentWrapper = styled(BorderBox)<{ $value: string }>`
  position: relative;
  display: flex;
  align-items: flex-end;
  padding: 14px;
  transition: all ${ANI_DURATION}s;
  ${({ theme }) => theme.isMobile && css`
    padding: ${vm(16)} ${vm(110)} ${vm(16)} ${vm(16)};
    min-height: ${vm(60)};
    background: ${({ theme }) => theme.bgL1};
    backdrop-filter: blur(8px);
  `}
`

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  flex-shrink: 1;
`
const PlaceholderWrapper = styled.div`
  position: absolute;
  bottom: 1px;
  font-weight: 600;
  font-size: 14px;
  line-height: 24px;
  white-space: nowrap;
  color: ${({ theme }) => theme.textL4};
  ${({ theme }) => theme.isMobile && css`
    font-size: 0.16rem;
    line-height: 0.24rem;
    bottom: ${vm(1)};
  `}
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

const Handle = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  position: absolute;
  bottom: ${vm(8)};
  right: ${vm(8)};
  .line {
    width: 1px;
    height: 16px;
    background-color: ${({ theme }) => theme.line1};
  }
  .model-select-value {
    cursor: pointer;
  }
  ${({ theme }) => theme.isMobile && css`
    gap: ${vm(8)};
  `}
`

const ChatFileButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ theme }) => theme.isMobile && css`
    width: ${vm(44)};
    height: ${vm(44)};
    border-radius: 50%;
    background-color: transparent;
    border: 1px solid ${({ theme }) => theme.bgT30};
    .icon-chat-file {
      font-size: ${vm(18)};
      color: ${({ theme }) => theme.textL2};
    }
  `}
`

const ChatVoiceButton = styled(ChatFileButton)<{ $isRecording: boolean }>`
  transition: all ${ANI_DURATION}s;
  ${({ theme, $isRecording }) => theme.isMobile && css`
    .icon-chat-voice {
      font-size: ${vm(18)};
      color: ${({ theme }) => theme.textL2};
    }
    ${$isRecording && css`
      border: none;
      background-color: ${({ theme }) => theme.jade10};
      .icon-chat-voice {
        color: #000000;
      }
    `}
  `}
`

const SendButton = styled(ChatFileButton)`
  cursor: pointer;
  ${({ theme }) => theme.isMobile && css`
    border: none;
    background-color: ${({ theme }) => theme.jade10};
    .icon-chat-send {
      font-size: ${vm(18)};
    }
  `}
`

const FileUpload = styled.input`
  display: none;
  position: absolute;
`

export default memo(function AiInput() {
  const theme = useTheme()
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
    const canvas = document.getElementById('waveform') as HTMLCanvasElement
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    if (ctx) {
      const WIDTH = canvas.width;
      const HEIGHT = canvas.height;

      const BAR_WIDTH = 2;
      const GAP = 4;
      const BAR_STEP = BAR_WIDTH + GAP;
      const BAR_COUNT = Math.floor(WIDTH / BAR_STEP);
      // 设置最小和最大高度，增加对比度
      const MIN_HEIGHT = 2;
      const MAX_HEIGHT = 22; // 增加最大高度，使波形更明显

      // 限制已录制bar的最大比例为2/3
      const MAX_RECORDED_RATIO = 1;
      const MAX_RECORDED_BARS = Math.floor(BAR_COUNT * MAX_RECORDED_RATIO);
      
      // 初始化波形数据
      let waveformData = new Array(BAR_COUNT).fill(MIN_HEIGHT);
      // 已录制bar固定为2/3的比例
      const recordedBars = MAX_RECORDED_BARS;
      
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256; // 增加FFT大小，提高频率分辨率
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      
      // 用于控制波形移动速度的计数器
      let frameCounter = 0;
      // 每隔多少帧更新一次波形，数值越大移动越慢
      const frameUpdateRate = 8; // 增大帧率，大幅减慢移动速度
      
      // 记录前几帧的音量，用于创造趋势变化
      const volumeHistory = new Array(5).fill(0);

      function draw() {
        requestAnimationFrame(draw);
        
        analyser.getByteFrequencyData(dataArray);

        // 分析不同频率范围，创造更多变化
        const bassRange = dataArray.slice(0, 8);
        const midRange = dataArray.slice(8, 24);
        const highRange = dataArray.slice(24, 40);
        
        const bassAvg = bassRange.reduce((a, b) => a + b, 0) / bassRange.length;
        const midAvg = midRange.reduce((a, b) => a + b, 0) / midRange.length;
        const highAvg = highRange.reduce((a, b) => a + b, 0) / highRange.length;
        
        // 增加低频的权重，使波形对人声更敏感
        const weightedAvg = (bassAvg * 0.6) + (midAvg * 0.3) + (highAvg * 0.1);
        
        // 更新历史音量队列
        volumeHistory.unshift(weightedAvg);
        volumeHistory.pop();
        
        // 只在特定帧更新波形，减慢移动速度
        frameCounter++;
        if (frameCounter >= frameUpdateRate) {
          frameCounter = 0;
          
          // 计算音量趋势
          const trendFactor = volumeHistory[0] > volumeHistory[4] ? 1.2 : 0.9;
          
          // 增加随机因子，使波形更有跌宕起伏
          const randomFactor = 0.7 + (Math.random() * 0.6);
          
          // 周期性变化，增加波形律动感
          const pulseFactor = 1 + 0.3 * Math.sin(Date.now() / 300);
          
          // 整合所有因子
          let barHeight = MIN_HEIGHT + (weightedAvg / 255) * (MAX_HEIGHT - MIN_HEIGHT) * randomFactor * trendFactor * pulseFactor;
          
          // 突发性波峰，模拟语音的突然变化
          if (Math.random() > 0.8) {
            barHeight *= 1.4 + Math.random() * 0.3;
          }
          
          // 限制高度
          barHeight = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, barHeight));
          
          // 插入数据队列 - 从后面添加，实现从右往左移动
          waveformData.push(barHeight);
          if (waveformData.length > BAR_COUNT) {
            waveformData.shift();
          }
        }

        ctx.clearRect(0, 0, WIDTH, HEIGHT);

        for (let i = 0; i < BAR_COUNT; i++) {
          // 从左往右绘制
          const x = i * BAR_STEP;
          
          // 判断是否为已录制区域，已录制区域始终在左侧
          const isRecordedArea = i < recordedBars;
          
          if (isRecordedArea) {
            // 已录制的bar使用白色，显示在左侧
            ctx.fillStyle = '#eeeeee';
            const h = waveformData[i];
            const y = (HEIGHT - h) / 2;
            
            const radius = 1;
            const r = Math.min(radius, h / 2, BAR_WIDTH / 2);
            ctx.beginPath();
            ctx.moveTo(x, y + r);
            ctx.arcTo(x, y, x + BAR_WIDTH, y, r);
            ctx.arcTo(x + BAR_WIDTH, y, x + BAR_WIDTH, y + h, r);
            ctx.arcTo(x + BAR_WIDTH, y + h, x, y + h, r);
            ctx.arcTo(x, y + h, x, y, r);
            ctx.closePath();
            ctx.fill();
          } else {
            // 未录制的bar使用暗灰色，显示在右侧
            ctx.fillStyle = '#444444';
            const initialHeight = MIN_HEIGHT;
            const initialY = (HEIGHT - initialHeight) / 2;
            
            const radius = 1;
            const r = Math.min(radius, initialHeight / 2, BAR_WIDTH / 2);
            ctx.beginPath();
            ctx.moveTo(x, initialY + r);
            ctx.arcTo(x, initialY, x + BAR_WIDTH, initialY, r);
            ctx.arcTo(x + BAR_WIDTH, initialY, x + BAR_WIDTH, initialY + initialHeight, r);
            ctx.arcTo(x + BAR_WIDTH, initialY + initialHeight, x, initialY + initialHeight, r);
            ctx.arcTo(x, initialY + initialHeight, x, initialY, r);
            ctx.closePath();
            ctx.fill();
          }
        }
      }

      draw();
    }
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
  return <AiInputWrapper>
    <Shortcuts />
    <AiInputOutWrapper>
      <AiInputContentWrapper
        $borderTop
        $borderBottom
        $borderLeft
        $borderRight
        $value={value}
        $borderColor={value ? theme.jade10 : theme.bgT30}
        $borderRadius={36}
        ref={inputContentWrapperRef as any}
      >
        <canvas id="waveform" width="164" height="32" style={{ background: 'transparent', display: isRecording ? 'block' : 'none' }} />
        {
          !isRecording && 
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
                  : isLoading ? <Trans>Thinking...</Trans> : <Trans>Type your message...</Trans>}
              </PlaceholderWrapper>}
            </InputWrapper>

        }
        <Handle>
          <ChatFileButton onClick={uploadImg}>
            <IconBase className="icon-chat-file" />
          </ChatFileButton>
          {
            value
              ? <SendButton onClick={(isLoading || isRenderingData) ? stopLoadingMessage : requestStream}>
                <IconBase className="icon-chat-send" />
              </SendButton>
              : <ChatVoiceButton $isRecording={isRecording} onClick={isRecording ? stopRecording : startRecording}>
                <IconBase className="icon-chat-voice" />
              </ChatVoiceButton>
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
