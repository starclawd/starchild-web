import styled, { css } from 'styled-components'
import Modal from 'components/Modal'
import { useCreateTaskModalToggle, useIsMobile, useModalOpen } from 'store/application/hooks'
import { ApplicationModal } from 'store/application/application.d'
import { ModalSafeAreaWrapper } from 'components/SafeAreaWrapper'
import { Trans } from '@lingui/react/macro'
import { ButtonBorder, ButtonCommon } from 'components/Button'
import InputArea from 'components/InputArea'
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { t } from '@lingui/core/macro'
import Input from 'components/Input'
import Select, { TriggerMethod } from 'components/Select'
import WeeklySelect, { WEEKLY_VALUE } from '../WeeklySelect'
import TimeSelect from '../TimeSelect'
import { IconBase } from 'components/Icons'
import TimezoneSelect from '../TimezoneSelect'
import { TaskDataType } from 'store/setting/setting'
const CreateTaskModalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 580px;
  max-height: calc(100vh - 40px);
  border-radius: 36px;
  background: ${({ theme }) => theme.bgL1};
  backdrop-filter: blur(8px);
`

const CreateTaskModalMobileWrapper = styled(ModalSafeAreaWrapper)`
  display: flex;
  flex-direction: column;
  width: 100%;
  background: ${({ theme }) => theme.bgL1};
  backdrop-filter: blur(8px);
`

const Header = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 20px 20px 8px;
  font-size: 20px;
  font-weight: 500;
  line-height: 28px;
  color: ${({ theme }) => theme.textL1};
  .icon-chat-back {
    position: absolute;
    left: 20px;
    font-size: 28px;
    color: ${({ theme }) => theme.textL1};
    cursor: pointer;
  }
`

const TopContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  height: calc(100% - 138px);
  padding: 20px;
`

const BottomContent = styled.div`
  display: flex;
  gap: 8px;
  padding: 8px 20px 20px;
`

const ButtonCancel = styled(ButtonBorder)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50%;
`

const ButtonConfirm = styled(ButtonCommon)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50%;
`

const ContentItem = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  .input-area {
    height: 120px !important;
    max-height: 120px !important;
    border-radius: 24px;
    border: 1px solid ${({ theme }) => theme.bgT30};
    backdrop-filter: blur(8px);
    padding: 12px 16px;
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    &::placeholder {
      font-size: 14px;
      font-weight: 500;
      line-height: 20px;
    }
  }
`

const ContentTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 36px;
  padding: 8px 16px;
  .content-title-text {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 13px;
    font-weight: 400;
    line-height: 20px;
    color: ${({ theme }) => theme.textL2};
    .icon-required {
      font-size: 8px;
      color: ${({ theme }) => theme.autumn50};
    }
  }
  .content-title-remove {
    font-size: 13px;
    font-weight: 400;
    line-height: 20px;
    cursor: pointer;
    color: ${({ theme }) => theme.brand6};
  }
`

const SelectValue = styled.div<{ $isPlaceHolder: boolean }>`
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: ${({ $isPlaceHolder, theme }) => ($isPlaceHolder ? theme.textL4 : theme.textL2)};
`

const TimeWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
`

enum Schedule {
  EVERY_DAY = 'Every day',
  WEEKLY = 'Weekly',
}

export function CreateTaskModal({ currentTaskData }: { currentTaskData: TaskDataType | null }) {
  const isMobile = useIsMobile()
  const [timezoneValue, setTimezoneValue] = useState('Etc/GMT')
  const createTaskModalOpen = useModalOpen(ApplicationModal.CREATE_TASK_MODAL)
  const [name, setName] = useState('')
  const [prompt, setPrompt] = useState('')
  const [schedule, setSchedule] = useState('')
  const [weeklyValue, setWeeklyValue] = useState(WEEKLY_VALUE.MONDAY)
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(0)
  const toggleCreateTaskModal = useCreateTaskModalToggle()
  const changeName = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }, [])
  const changePrompt = useCallback((value: string) => {
    setPrompt(value)
  }, [])
  const changeSchedule = useCallback((value: string) => {
    return () => {
      setSchedule(value)
    }
  }, [])
  const contentList = [
    {
      key: 'Name',
      title: <Trans>Name</Trans>,
      isRequired: true,
      content: name,
      placeholder: t`Please enter a task name.`,
    },
    {
      key: 'Prompt',
      title: <Trans>Prompt</Trans>,
      isRequired: true,
      content: prompt,
      placeholder: t`You can preset the agent with the following characteristics: formal or concise response style, communication in which language,  detailed analysis of the reasons behind price movements, etc.`,
    },
    {
      key: 'Schedule',
      title: <Trans>Schedule</Trans>,
      isRequired: false,
      content: '',
      placeholder: t`Every day / Weekly`,
    },
    ...(schedule
      ? [
          {
            key: 'Time',
            title: <Trans>Time</Trans>,
            isRequired: false,
            content: '',
            placeholder: '',
          },
          {
            key: 'TimeZone',
            title: <Trans>Time Zone</Trans>,
            isRequired: false,
            content: '',
            placeholder: '',
          },
        ]
      : []),
  ]
  const selectMap = useMemo(() => {
    return {
      [Schedule.EVERY_DAY]: <Trans>Every day</Trans>,
      [Schedule.WEEKLY]: <Trans>Weekly</Trans>,
    }
  }, [])
  const selectList = useMemo(() => {
    return [
      {
        key: Schedule.EVERY_DAY,
        value: Schedule.EVERY_DAY,
        text: <Trans>Every day</Trans>,
        clickCallback: changeSchedule(Schedule.EVERY_DAY),
      },
      {
        key: Schedule.WEEKLY,
        value: Schedule.WEEKLY,
        text: <Trans>Weekly</Trans>,
        clickCallback: changeSchedule(Schedule.WEEKLY),
      },
    ]
  }, [changeSchedule])
  useEffect(() => {
    if (currentTaskData) {
      console.log('init task')
    }
  }, [currentTaskData])
  const Wrapper = isMobile ? CreateTaskModalMobileWrapper : CreateTaskModalWrapper
  return (
    <Modal useDismiss isOpen={createTaskModalOpen} onDismiss={toggleCreateTaskModal}>
      <Wrapper>
        <Header>
          <Trans>Create</Trans>
        </Header>
        <TopContent className='scroll-style'>
          {contentList.map((data) => {
            const { key, title, content, placeholder, isRequired } = data
            return (
              <ContentItem key={key}>
                <ContentTitle>
                  <span className='content-title-text'>
                    {title}
                    {isRequired && <IconBase className='icon-required' />}
                  </span>
                  {key === 'Schedule' && (
                    <span onClick={() => setSchedule('')} className='content-title-remove'>
                      <Trans>Remove</Trans>
                    </span>
                  )}
                </ContentTitle>
                {key === 'Name' && <Input placeholder={placeholder} inputValue={name} onChange={changeName} />}
                {key === 'Prompt' && (
                  <InputArea disabledUpdateHeight placeholder={placeholder} value={content} setValue={changePrompt} />
                )}
                {key === 'Schedule' && (
                  <Select
                    usePortal
                    placement='bottom-start'
                    offsetLeft={0}
                    offsetTop={2}
                    triggerMethod={TriggerMethod.CLICK}
                    dataList={selectList}
                    value={schedule}
                  >
                    <SelectValue $isPlaceHolder={!schedule}>
                      {schedule ? selectMap[schedule as keyof typeof selectMap] : placeholder}
                    </SelectValue>
                  </Select>
                )}
                {key === 'Time' && (
                  <TimeWrapper>
                    {schedule === Schedule.WEEKLY && (
                      <WeeklySelect weeklyValue={weeklyValue} setWeeklyValue={setWeeklyValue} />
                    )}
                    <TimeSelect hours={hours} minutes={minutes} setHours={setHours} setMinutes={setMinutes} />
                  </TimeWrapper>
                )}
                {key === 'TimeZone' && (
                  <TimezoneSelect timezoneValue={timezoneValue} setTimezoneValue={setTimezoneValue} />
                )}
              </ContentItem>
            )
          })}
        </TopContent>
        <BottomContent>
          <ButtonCancel onClick={toggleCreateTaskModal}>
            <Trans>Cancel</Trans>
          </ButtonCancel>
          <ButtonConfirm disabled={!name.trim() || !prompt.trim()}>
            <Trans>Confirm</Trans>
          </ButtonConfirm>
        </BottomContent>
      </Wrapper>
    </Modal>
  )
}
