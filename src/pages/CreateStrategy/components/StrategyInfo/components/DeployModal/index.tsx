import { memo, useCallback } from 'react'
import Modal from 'components/Modal'
import { useDeployment } from 'store/createstrategy/hooks/useDeployment'
import { useDeployModalToggle, useModalOpen } from 'store/application/hooks'
import { ApplicationModal } from 'store/application/application.d'
import DeployForm from './components/DeployForm'
import DeploySteps from './components/DeploySteps'

export default memo(function DeployModal() {
  const { deployModalStatus, setModalStatus } = useDeployment()
  const deployModalOpen = useModalOpen(ApplicationModal.DEPLOY_MODAL)
  const toggleDeployModal = useDeployModalToggle()
  const strategyId = 'mock-strategy-id-111' // FIXME: 获取策略ID

  // 处理关闭模态框
  const handleClose = useCallback(() => {
    toggleDeployModal()
  }, [toggleDeployModal])

  // 处理开始部署
  const handleStartDeploy = useCallback(() => {
    setModalStatus('deploying')
  }, [setModalStatus])

  // 处理取消
  const handleCancel = useCallback(() => {
    toggleDeployModal()
  }, [toggleDeployModal])

  return (
    <Modal isOpen={deployModalOpen} onDismiss={handleClose} hideClose={false} useDismiss={true}>
      {deployModalStatus === 'form' ? (
        <DeployForm onDeploy={handleStartDeploy} onCancel={handleCancel} />
      ) : (
        <DeploySteps onClose={handleClose} strategyId={strategyId} />
      )}
    </Modal>
  )
})
