import NetworkIcon from 'components/NetworkIcon'
import { ANI_DURATION } from 'constants/index'
import { NetworkInfo } from 'store/vaults/vaults'
import styled from 'styled-components'

const SupportNetworkWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  .network-icon {
    transition: all ${ANI_DURATION}s;
    border: 1px solid ${({ theme }) => theme.black700};
  }
`

export default function SupportNetwork({ networks }: { networks: NetworkInfo[] }) {
  return (
    <SupportNetworkWrapper>
      {networks.map((network, index) => (
        <NetworkIcon
          className='network-icon'
          key={network.id}
          networkId={network.id}
          size={12}
          overlapped={true}
          style={{ zIndex: networks.length - index }}
        />
      ))}
    </SupportNetworkWrapper>
  )
}
