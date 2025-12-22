import { memo, useCallback, useEffect } from 'react'
import Modal from 'components/Modal'
import Pending from 'components/Pending'
import { useDeployment } from 'store/createstrategy/hooks/useDeployment'
import { useCurrentRouter, useDeployModalToggle, useModalOpen, useDeployStrategyId } from 'store/application/hooks'
import { ApplicationModal } from 'store/application/application.d'
import { STRATEGY_STATUS } from 'store/createstrategy/createstrategy.d'
import DeployForm from './components/DeployForm'
import DeploySteps from './components/DeploySteps'
import DeploySuccess from './components/DeploySuccess'
import DeployFailed from './components/DeployFailed'
import { ROUTER } from 'pages/router'

export default memo(function DeployModal() {
  const strategyId = useDeployStrategyId()
  const {
    deployModalStatus,
    strategyStatus,
    checkDeployStatusLoading,
    setModalStatus,
    startPolling,
    stopPolling,
    checkDeployStatus,
    enterLiveDeploying,
    executeStep3,
  } = useDeployment(strategyId || '')
  const deployModalOpen = useModalOpen(ApplicationModal.DEPLOY_MODAL)
  const toggleDeployModal = useDeployModalToggle()
  const [currentRouter, setCurrentRouter] = useCurrentRouter()

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
      const success = await enterLiveDeploying(strategyId)
      // 成功后切换到部署状态
      if (success) setModalStatus('deploying')
    } catch (error) {
      console.error('进入实盘部署状态失败:', error)
    }
  }, [enterLiveDeploying, strategyId, setModalStatus])

  // 处理取消
  const handleCancel = useCallback(() => {
    stopPolling() // 确保在取消时停止轮询
    toggleDeployModal()
  }, [stopPolling, toggleDeployModal])

  // 处理查看 vault
  const handleViewVault = useCallback(() => {
    handleCancel()
    setCurrentRouter(`${ROUTER.VAULT_DETAIL}?strategyId=${strategyId}`)
  }, [strategyId, setCurrentRouter, handleCancel])

  // 处理重新提交（重新执行第三步）
  const handleResubmit = useCallback(() => {
    if (strategyId) {
      setModalStatus('deploying')
      executeStep3(strategyId)
    }
  }, [strategyId, setModalStatus, executeStep3])

  return (
    <Modal isOpen={deployModalOpen} onDismiss={handleClose} hideClose={false} useDismiss={true}>
      {checkDeployStatusLoading ? (
        <Pending isNotButtonLoading />
      ) : deployModalStatus === 'form' ? (
        <DeployForm onDeploy={handleStartDeploy} onCancel={handleCancel} />
      ) : deployModalStatus === 'success' ? (
        <DeploySuccess onClose={handleClose} onViewVault={handleViewVault} />
      ) : deployModalStatus === 'failed' ? (
        <DeployFailed onClose={handleClose} onResubmit={handleResubmit} />
      ) : (
        <DeploySteps onClose={handleClose} />
      )}
    </Modal>
  )
})
