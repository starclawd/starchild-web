import { memo, useCallback, useEffect } from 'react'
import Modal from 'components/Modal'
import { useDeployment } from 'store/createstrategy/hooks/useDeployment'
import { useDeployModalToggle, useModalOpen } from 'store/application/hooks'
import { ApplicationModal } from 'store/application/application.d'
import DeployForm from './components/DeployForm'
import DeploySteps from './components/DeploySteps'
import useParsedQueryString from 'hooks/useParsedQueryString'

export default memo(function DeployModal() {
  const { strategyId } = useParsedQueryString()
  const { deployModalStatus, setModalStatus, startPolling, stopPolling, checkDeployStatus } = useDeployment(
    strategyId || '',
  )
  const deployModalOpen = useModalOpen(ApplicationModal.DEPLOY_MODAL)
  const toggleDeployModal = useDeployModalToggle()

  // 监听 modal 打开状态，控制轮询
  useEffect(() => {
    if (deployModalOpen && strategyId) {
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
  }, [deployModalOpen, strategyId, checkDeployStatus, startPolling, stopPolling])

  // 处理关闭模态框
  const handleClose = useCallback(() => {
    stopPolling() // 确保在关闭时停止轮询
    toggleDeployModal()
  }, [stopPolling, toggleDeployModal])

  // 处理开始部署
  const handleStartDeploy = useCallback(() => {
    setModalStatus('deploying')
  }, [setModalStatus])

  // 处理取消
  const handleCancel = useCallback(() => {
    stopPolling() // 确保在取消时停止轮询
    toggleDeployModal()
  }, [stopPolling, toggleDeployModal])

  return (
    <Modal isOpen={deployModalOpen} onDismiss={handleClose} hideClose={false} useDismiss={true}>
      {deployModalStatus === 'form' ? (
        <DeployForm onDeploy={handleStartDeploy} onCancel={handleCancel} />
      ) : (
        <DeploySteps onClose={handleClose} strategyId={strategyId || ''} />
      )}
    </Modal>
  )
})
