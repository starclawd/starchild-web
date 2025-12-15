import { memo, useCallback, useEffect } from 'react'
import Modal from 'components/Modal'
import Pending from 'components/Pending'
import { useDeployment } from 'store/createstrategy/hooks/useDeployment'
import { useDeployModalToggle, useModalOpen } from 'store/application/hooks'
import { ApplicationModal } from 'store/application/application.d'
import { STRATEGY_STATUS } from 'store/createstrategy/createstrategy.d'
import DeployForm from './components/DeployForm'
import DeploySteps from './components/DeploySteps'
import useParsedQueryString from 'hooks/useParsedQueryString'

export default memo(function DeployModal() {
  const {
    strategyId,
    deployModalStatus,
    strategyStatus,
    checkDeployStatusLoading,
    setModalStatus,
    startPolling,
    stopPolling,
    checkDeployStatus,
    enterLiveDeploying,
  } = useDeployment()
  const deployModalOpen = useModalOpen(ApplicationModal.DEPLOY_MODAL)
  const toggleDeployModal = useDeployModalToggle()

  // 监听 modal 打开状态，控制轮询和设置modal状态
  useEffect(() => {
    if (strategyId) {
      // 根据策略状态设置modal状态
      if (strategyStatus === STRATEGY_STATUS.DRAFT_READY) {
        setModalStatus('form')
      } else if (strategyStatus === STRATEGY_STATUS.DEPLOYING) {
        setModalStatus('deploying')
      }

      // modal 打开时：立即查询状态并启动轮询
      checkDeployStatus(strategyId)
      startPolling()
    } else {
      // modal 关闭时：停止轮询
      stopPolling()
    }

    // 清理函数：确保在组件卸载时停止轮询
    return () => {
      stopPolling()
    }
  }, [strategyId, strategyStatus, setModalStatus, checkDeployStatus, startPolling, stopPolling])

  // 处理关闭模态框
  const handleClose = useCallback(() => {
    stopPolling() // 确保在关闭时停止轮询
    toggleDeployModal()
  }, [stopPolling, toggleDeployModal])

  // 处理开始部署
  const handleStartDeploy = useCallback(async () => {
    if (!strategyId) {
      return
    }

    try {
      // 先调用 enterLiveDeploying API
      await enterLiveDeploying(strategyId)
      // 成功后切换到部署状态
      setModalStatus('deploying')
    } catch (error) {
      console.error('进入实盘部署状态失败:', error)
      // 这里可以添加错误提示
    }
  }, [enterLiveDeploying, strategyId, setModalStatus])

  // 处理取消
  const handleCancel = useCallback(() => {
    stopPolling() // 确保在取消时停止轮询
    toggleDeployModal()
  }, [stopPolling, toggleDeployModal])

  return (
    <Modal isOpen={deployModalOpen} onDismiss={handleClose} hideClose={false} useDismiss={true}>
      {checkDeployStatusLoading ? (
        <Pending />
      ) : deployModalStatus === 'form' ? (
        <DeployForm onDeploy={handleStartDeploy} onCancel={handleCancel} />
      ) : (
        <DeploySteps onClose={handleClose} />
      )}
    </Modal>
  )
})
