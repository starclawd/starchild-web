import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// erc20
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const erc20Abi = [
  {
    constant: true,
    payable: false,
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
  },
  {
    constant: false,
    payable: false,
    type: 'function',
    inputs: [
      { name: '_spender', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    constant: true,
    payable: false,
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    constant: false,
    payable: false,
    type: 'function',
    inputs: [
      { name: '_from', type: 'address' },
      { name: '_to', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    constant: true,
    payable: false,
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    constant: true,
    payable: false,
    type: 'function',
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    constant: true,
    payable: false,
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
  },
  {
    constant: false,
    payable: false,
    type: 'function',
    inputs: [
      { name: '_to', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    constant: true,
    payable: false,
    type: 'function',
    inputs: [
      { name: '_owner', type: 'address' },
      { name: '_spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  { payable: true, type: 'fallback', stateMutability: 'payable' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'owner', type: 'address', indexed: true },
      { name: 'spender', type: 'address', indexed: true },
      { name: 'value', type: 'uint256', indexed: false },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', type: 'address', indexed: true },
      { name: 'to', type: 'address', indexed: true },
      { name: 'value', type: 'uint256', indexed: false },
    ],
    name: 'Transfer',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// orderlyVault
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const orderlyVaultAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  {
    type: 'error',
    inputs: [{ name: 'target', internalType: 'address', type: 'address' }],
    name: 'AddressEmptyCode',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'AddressInsufficientBalance',
  },
  {
    type: 'error',
    inputs: [{ name: 'brokerHash', internalType: 'bytes32', type: 'bytes32' }],
    name: 'BrokerNotAllowed',
  },
  {
    type: 'error',
    inputs: [{ name: 'implementation', internalType: 'address', type: 'address' }],
    name: 'ERC1967InvalidImplementation',
  },
  { type: 'error', inputs: [], name: 'ERC1967NonPayable' },
  { type: 'error', inputs: [], name: 'EnforcedPause' },
  { type: 'error', inputs: [], name: 'ExpectedPause' },
  { type: 'error', inputs: [], name: 'FailedInnerCall' },
  {
    type: 'error',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'InvalidClaimToken',
  },
  { type: 'error', inputs: [], name: 'InvalidCrossChainManager' },
  {
    type: 'error',
    inputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
    name: 'InvalidDepositAmount',
  },
  {
    type: 'error',
    inputs: [{ name: 'payloadType', internalType: 'enum PayloadType', type: 'uint8' }],
    name: 'InvalidDepositType',
  },
  { type: 'error', inputs: [], name: 'InvalidInitialization' },
  { type: 'error', inputs: [], name: 'InvalidOwnerOrAdmin' },
  {
    type: 'error',
    inputs: [{ name: 'payloadType', internalType: 'enum PayloadType', type: 'uint8' }],
    name: 'InvalidPayloadType',
  },
  { type: 'error', inputs: [], name: 'InvalidRoleType' },
  { type: 'error', inputs: [], name: 'InvalidStrategy' },
  {
    type: 'error',
    inputs: [{ name: 'payloadType', internalType: 'enum PayloadType', type: 'uint8' }],
    name: 'InvalidWithdrawType',
  },
  {
    type: 'error',
    inputs: [{ name: 'strategyProviderId', internalType: 'bytes32', type: 'bytes32' }],
    name: 'NotAllowedStrategyProvider',
  },
  { type: 'error', inputs: [], name: 'NotEnoughCCFee' },
  {
    type: 'error',
    inputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
    name: 'NotEnoughUnclaimedAssets',
  },
  { type: 'error', inputs: [], name: 'NotInitializing' },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
  {
    type: 'error',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'TokenNotAllowed',
  },
  { type: 'error', inputs: [], name: 'UUPSUnauthorizedCallContext' },
  {
    type: 'error',
    inputs: [{ name: 'slot', internalType: 'bytes32', type: 'bytes32' }],
    name: 'UUPSUnsupportedProxiableUUID',
  },
  { type: 'error', inputs: [], name: 'VaultClosed' },
  { type: 'error', inputs: [], name: 'ZeroAmount' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'admin',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'AdminSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'brokerHash',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false,
      },
      { name: 'isAllowed', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'AllowedBrokerSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'strategy',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      { name: 'isAllowed', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'AllowedStrategySet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      { name: 'isAllowed', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'AllowedTokenSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'periodId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'vaultId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false,
      },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'DepositFromStrategy',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'periodId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'vaultId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false,
      },
      {
        name: 'receiver',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'dexNonce',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
    ],
    name: 'DepositToStrategy',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'version',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'payloadType',
        internalType: 'enum PayloadType',
        type: 'uint8',
        indexed: false,
      },
      {
        name: 'operationData',
        internalType: 'struct OperationData',
        type: 'tuple',
        components: [
          { name: 'vaultType', internalType: 'enum VaultType', type: 'uint8' },
          { name: 'sender', internalType: 'address', type: 'address' },
          { name: 'receiver', internalType: 'address', type: 'address' },
          { name: 'chainNonce', internalType: 'uint256', type: 'uint256' },
          { name: 'amount', internalType: 'uint256', type: 'uint256' },
          { name: 'vaultId', internalType: 'bytes32', type: 'bytes32' },
          { name: 'accountId', internalType: 'bytes32', type: 'bytes32' },
          {
            name: 'strategyProviderId',
            internalType: 'bytes32',
            type: 'bytes32',
          },
          { name: 'tokenHash', internalType: 'bytes32', type: 'bytes32' },
          { name: 'brokerHash', internalType: 'bytes32', type: 'bytes32' },
        ],
        indexed: false,
      },
    ],
    name: 'OperationExecuted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferStarted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'Paused',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'periodId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'vaultId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false,
      },
      {
        name: 'claimInfos',
        internalType: 'struct ClaimInfo[]',
        type: 'tuple[]',
        components: [
          { name: 'requestId', internalType: 'bytes32', type: 'bytes32' },
          { name: 'accountId', internalType: 'bytes32', type: 'bytes32' },
          {
            name: 'strategyProviderId',
            internalType: 'bytes32',
            type: 'bytes32',
          },
          { name: 'assets', internalType: 'uint256', type: 'uint256' },
        ],
        indexed: false,
      },
    ],
    name: 'UnClaimedUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'Unpaused',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'implementation',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'Upgraded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '',
        internalType: 'enum RoleType',
        type: 'uint8',
        indexed: false,
      },
      { name: 'id', internalType: 'bytes32', type: 'bytes32', indexed: false },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'requests',
        internalType: 'bytes32[]',
        type: 'bytes32[]',
        indexed: false,
      },
    ],
    name: 'UserClaimed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'state',
        internalType: 'enum VaultState',
        type: 'uint8',
        indexed: false,
      },
    ],
    name: 'VaultStateChanged',
  },
  {
    type: 'function',
    inputs: [],
    name: 'UPGRADE_INTERFACE_VERSION',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'acceptOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'chainNonce',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'claimParams',
        internalType: 'struct ClaimParams',
        type: 'tuple',
        components: [
          { name: 'roleType', internalType: 'enum RoleType', type: 'uint8' },
          { name: 'token', internalType: 'address', type: 'address' },
          { name: 'brokerHash', internalType: 'bytes32', type: 'bytes32' },
        ],
      },
    ],
    name: 'claimWithFee',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    name: 'crossChainFee',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'crossChainManager',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'depositParams',
        internalType: 'struct DepositParams',
        type: 'tuple',
        components: [
          {
            name: 'payloadType',
            internalType: 'enum PayloadType',
            type: 'uint8',
          },
          { name: 'receiver', internalType: 'address', type: 'address' },
          { name: 'token', internalType: 'address', type: 'address' },
          { name: 'amount', internalType: 'uint256', type: 'uint256' },
          { name: 'brokerHash', internalType: 'bytes32', type: 'bytes32' },
        ],
      },
    ],
    name: 'deposit',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'periodId', internalType: 'uint256', type: 'uint256' },
      { name: 'broker', internalType: 'bytes32', type: 'bytes32' },
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'depositFromStrategy',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'periodId', internalType: 'uint256', type: 'uint256' },
      { name: 'receiver', internalType: 'address', type: 'address' },
      { name: 'broker', internalType: 'bytes32', type: 'bytes32' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'depositToStrategy',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'dexVault',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'emergencyPause',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'emergencyUnpause',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'userId', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getUserClaimedInfo',
    outputs: [
      {
        name: '',
        internalType: 'struct UserClaimedInfo',
        type: 'tuple',
        components: [
          { name: 'unClaimedAssets', internalType: 'uint256', type: 'uint256' },
          { name: 'requestIds', internalType: 'bytes32[]', type: 'bytes32[]' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_dexVault', internalType: 'address', type: 'address' },
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'token', internalType: 'address', type: 'address' },
      { name: '_minDepositForLp', internalType: 'uint256', type: 'uint256' },
      { name: '_minDepositForSp', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'isAllowedAdmin',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    name: 'isAllowedBroker',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'isAllowedStrategy',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    name: 'isAllowedStrategyProvider',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'isAllowedToken',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'ledgerEid',
    outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'lpWhitelist',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'lpWhitelistEnabled',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'lpWhitelistEndTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'minDepositForLp',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'minDepositForSp',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'paused',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'pendingOwner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'proxiableUUID',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'payloadType', internalType: 'enum PayloadType', type: 'uint8' },
      { name: 'receiver', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'quoteOperation',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'admin', internalType: 'address', type: 'address' },
      { name: 'isAllowed', internalType: 'bool', type: 'bool' },
    ],
    name: 'setAdmin',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'brokerHash', internalType: 'bytes32', type: 'bytes32' },
      { name: 'isAllowed', internalType: 'bool', type: 'bool' },
    ],
    name: 'setAllowedBroker',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'strategy', internalType: 'address', type: 'address' },
      { name: 'isAllowed', internalType: 'bool', type: 'bool' },
    ],
    name: 'setAllowedStrategy',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spId', internalType: 'bytes32', type: 'bytes32' },
      { name: 'knob', internalType: 'bool', type: 'bool' },
    ],
    name: 'setAllowedStrategyProvider',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'isAllowed', internalType: 'bool', type: 'bool' },
    ],
    name: 'setAllowedToken',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_crossChainManager', internalType: 'address', type: 'address' }],
    name: 'setCrossChainManager',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'eid', internalType: 'uint32', type: 'uint32' }],
    name: 'setLedgerEid',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_enabled', internalType: 'bool', type: 'bool' },
      { name: '_endTime', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setLpWhitelistConfig',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
    name: 'setMinDepositForLP',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
    name: 'setMinDepositForSP',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_dexVault', internalType: 'address', type: 'address' }],
    name: 'setOrderlyDexVault',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'hash', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'setTokenHashToAddress',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_vaultState', internalType: 'enum VaultState', type: 'uint8' }],
    name: 'setVaultState',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    name: 'tokenHashToAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_users', internalType: 'address[]', type: 'address[]' },
      { name: '_isWhitelisted', internalType: 'bool', type: 'bool' },
    ],
    name: 'updateLpWhitelist',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'periodId', internalType: 'uint256', type: 'uint256' },
      { name: 'ccFee', internalType: 'uint256', type: 'uint256' },
      { name: 'broker', internalType: 'bytes32', type: 'bytes32' },
      {
        name: 'userClaimInfos',
        internalType: 'struct ClaimInfo[]',
        type: 'tuple[]',
        components: [
          { name: 'requestId', internalType: 'bytes32', type: 'bytes32' },
          { name: 'accountId', internalType: 'bytes32', type: 'bytes32' },
          {
            name: 'strategyProviderId',
            internalType: 'bytes32',
            type: 'bytes32',
          },
          { name: 'assets', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    name: 'updateUnClaimed',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'upgradeToAndCall',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'bytes32', type: 'bytes32' },
      { name: '', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'userClaimedById',
    outputs: [{ name: 'unClaimedAssets', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'vaultState',
    outputs: [{ name: '', internalType: 'enum VaultState', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'withdrawParams',
        internalType: 'struct WithdrawParams',
        type: 'tuple',
        components: [
          {
            name: 'payloadType',
            internalType: 'enum PayloadType',
            type: 'uint8',
          },
          { name: 'token', internalType: 'address', type: 'address' },
          { name: 'amount', internalType: 'uint256', type: 'uint256' },
          { name: 'brokerHash', internalType: 'bytes32', type: 'bytes32' },
        ],
      },
    ],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address payable', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'withdrawNativeToken',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  { type: 'receive', stateMutability: 'payable' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20Abi}__
 */
export const useReadErc20 = /*#__PURE__*/ createUseReadContract({
  abi: erc20Abi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"name"`
 */
export const useReadErc20Name = /*#__PURE__*/ createUseReadContract({
  abi: erc20Abi,
  functionName: 'name',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"totalSupply"`
 */
export const useReadErc20TotalSupply = /*#__PURE__*/ createUseReadContract({
  abi: erc20Abi,
  functionName: 'totalSupply',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"decimals"`
 */
export const useReadErc20Decimals = /*#__PURE__*/ createUseReadContract({
  abi: erc20Abi,
  functionName: 'decimals',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadErc20BalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: erc20Abi,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"symbol"`
 */
export const useReadErc20Symbol = /*#__PURE__*/ createUseReadContract({
  abi: erc20Abi,
  functionName: 'symbol',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"allowance"`
 */
export const useReadErc20Allowance = /*#__PURE__*/ createUseReadContract({
  abi: erc20Abi,
  functionName: 'allowance',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc20Abi}__
 */
export const useWriteErc20 = /*#__PURE__*/ createUseWriteContract({
  abi: erc20Abi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"approve"`
 */
export const useWriteErc20Approve = /*#__PURE__*/ createUseWriteContract({
  abi: erc20Abi,
  functionName: 'approve',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"transferFrom"`
 */
export const useWriteErc20TransferFrom = /*#__PURE__*/ createUseWriteContract({
  abi: erc20Abi,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"transfer"`
 */
export const useWriteErc20Transfer = /*#__PURE__*/ createUseWriteContract({
  abi: erc20Abi,
  functionName: 'transfer',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc20Abi}__
 */
export const useSimulateErc20 = /*#__PURE__*/ createUseSimulateContract({
  abi: erc20Abi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"approve"`
 */
export const useSimulateErc20Approve = /*#__PURE__*/ createUseSimulateContract({
  abi: erc20Abi,
  functionName: 'approve',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"transferFrom"`
 */
export const useSimulateErc20TransferFrom = /*#__PURE__*/ createUseSimulateContract({
  abi: erc20Abi,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"transfer"`
 */
export const useSimulateErc20Transfer = /*#__PURE__*/ createUseSimulateContract({
  abi: erc20Abi,
  functionName: 'transfer',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc20Abi}__
 */
export const useWatchErc20Event = /*#__PURE__*/ createUseWatchContractEvent({
  abi: erc20Abi,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc20Abi}__ and `eventName` set to `"Approval"`
 */
export const useWatchErc20ApprovalEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: erc20Abi,
  eventName: 'Approval',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc20Abi}__ and `eventName` set to `"Transfer"`
 */
export const useWatchErc20TransferEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: erc20Abi,
  eventName: 'Transfer',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link orderlyVaultAbi}__
 */
export const useReadOrderlyVault = /*#__PURE__*/ createUseReadContract({
  abi: orderlyVaultAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link orderlyVaultAbi}__ and `functionName` set to `"UPGRADE_INTERFACE_VERSION"`
 */
export const useReadOrderlyVaultUpgradeInterfaceVersion = /*#__PURE__*/ createUseReadContract({
  abi: orderlyVaultAbi,
  functionName: 'UPGRADE_INTERFACE_VERSION',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link orderlyVaultAbi}__ and `functionName` set to `"chainNonce"`
 */
export const useReadOrderlyVaultChainNonce = /*#__PURE__*/ createUseReadContract({
  abi: orderlyVaultAbi,
  functionName: 'chainNonce',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link orderlyVaultAbi}__ and `functionName` set to `"crossChainFee"`
 */
export const useReadOrderlyVaultCrossChainFee = /*#__PURE__*/ createUseReadContract({
  abi: orderlyVaultAbi,
  functionName: 'crossChainFee',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link orderlyVaultAbi}__ and `functionName` set to `"crossChainManager"`
 */
export const useReadOrderlyVaultCrossChainManager = /*#__PURE__*/ createUseReadContract({
  abi: orderlyVaultAbi,
  functionName: 'crossChainManager',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link orderlyVaultAbi}__ and `functionName` set to `"dexVault"`
 */
export const useReadOrderlyVaultDexVault = /*#__PURE__*/ createUseReadContract({
  abi: orderlyVaultAbi,
  functionName: 'dexVault',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link orderlyVaultAbi}__ and `functionName` set to `"getUserClaimedInfo"`
 */
export const useReadOrderlyVaultGetUserClaimedInfo = /*#__PURE__*/ createUseReadContract({
  abi: orderlyVaultAbi,
  functionName: 'getUserClaimedInfo',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link orderlyVaultAbi}__ and `functionName` set to `"isAllowedAdmin"`
 */
export const useReadOrderlyVaultIsAllowedAdmin = /*#__PURE__*/ createUseReadContract({
  abi: orderlyVaultAbi,
  functionName: 'isAllowedAdmin',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link orderlyVaultAbi}__ and `functionName` set to `"isAllowedBroker"`
 */
export const useReadOrderlyVaultIsAllowedBroker = /*#__PURE__*/ createUseReadContract({
  abi: orderlyVaultAbi,
  functionName: 'isAllowedBroker',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link orderlyVaultAbi}__ and `functionName` set to `"isAllowedStrategy"`
 */
export const useReadOrderlyVaultIsAllowedStrategy = /*#__PURE__*/ createUseReadContract({
  abi: orderlyVaultAbi,
  functionName: 'isAllowedStrategy',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link orderlyVaultAbi}__ and `functionName` set to `"isAllowedStrategyProvider"`
 */
export const useReadOrderlyVaultIsAllowedStrategyProvider = /*#__PURE__*/ createUseReadContract({
  abi: orderlyVaultAbi,
  functionName: 'isAllowedStrategyProvider',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link orderlyVaultAbi}__ and `functionName` set to `"isAllowedToken"`
 */
export const useReadOrderlyVaultIsAllowedToken = /*#__PURE__*/ createUseReadContract({
  abi: orderlyVaultAbi,
  functionName: 'isAllowedToken',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link orderlyVaultAbi}__ and `functionName` set to `"ledgerEid"`
 */
export const useReadOrderlyVaultLedgerEid = /*#__PURE__*/ createUseReadContract({
  abi: orderlyVaultAbi,
  functionName: 'ledgerEid',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link orderlyVaultAbi}__ and `functionName` set to `"lpWhitelist"`
 */
export const useReadOrderlyVaultLpWhitelist = /*#__PURE__*/ createUseReadContract({
  abi: orderlyVaultAbi,
  functionName: 'lpWhitelist',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link orderlyVaultAbi}__ and `functionName` set to `"lpWhitelistEnabled"`
 */
export const useReadOrderlyVaultLpWhitelistEnabled = /*#__PURE__*/ createUseReadContract({
  abi: orderlyVaultAbi,
  functionName: 'lpWhitelistEnabled',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link orderlyVaultAbi}__ and `functionName` set to `"lpWhitelistEndTime"`
 */
export const useReadOrderlyVaultLpWhitelistEndTime = /*#__PURE__*/ createUseReadContract({
  abi: orderlyVaultAbi,
  functionName: 'lpWhitelistEndTime',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link orderlyVaultAbi}__ and `functionName` set to `"minDepositForLp"`
 */
export const useReadOrderlyVaultMinDepositForLp = /*#__PURE__*/ createUseReadContract({
  abi: orderlyVaultAbi,
  functionName: 'minDepositForLp',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link orderlyVaultAbi}__ and `functionName` set to `"minDepositForSp"`
 */
export const useReadOrderlyVaultMinDepositForSp = /*#__PURE__*/ createUseReadContract({
  abi: orderlyVaultAbi,
  functionName: 'minDepositForSp',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link orderlyVaultAbi}__ and `functionName` set to `"owner"`
 */
export const useReadOrderlyVaultOwner = /*#__PURE__*/ createUseReadContract({
  abi: orderlyVaultAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link orderlyVaultAbi}__ and `functionName` set to `"paused"`
 */
export const useReadOrderlyVaultPaused = /*#__PURE__*/ createUseReadContract({
  abi: orderlyVaultAbi,
  functionName: 'paused',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link orderlyVaultAbi}__ and `functionName` set to `"pendingOwner"`
 */
export const useReadOrderlyVaultPendingOwner = /*#__PURE__*/ createUseReadContract({
  abi: orderlyVaultAbi,
  functionName: 'pendingOwner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link orderlyVaultAbi}__ and `functionName` set to `"proxiableUUID"`
 */
export const useReadOrderlyVaultProxiableUuid = /*#__PURE__*/ createUseReadContract({
  abi: orderlyVaultAbi,
  functionName: 'proxiableUUID',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link orderlyVaultAbi}__ and `functionName` set to `"quoteOperation"`
 */
export const useReadOrderlyVaultQuoteOperation = /*#__PURE__*/ createUseReadContract({
  abi: orderlyVaultAbi,
  functionName: 'quoteOperation',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link orderlyVaultAbi}__ and `functionName` set to `"tokenHashToAddress"`
 */
export const useReadOrderlyVaultTokenHashToAddress = /*#__PURE__*/ createUseReadContract({
  abi: orderlyVaultAbi,
  functionName: 'tokenHashToAddress',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link orderlyVaultAbi}__ and `functionName` set to `"userClaimedById"`
 */
export const useReadOrderlyVaultUserClaimedById = /*#__PURE__*/ createUseReadContract({
  abi: orderlyVaultAbi,
  functionName: 'userClaimedById',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link orderlyVaultAbi}__ and `functionName` set to `"vaultState"`
 */
export const useReadOrderlyVaultVaultState = /*#__PURE__*/ createUseReadContract({
  abi: orderlyVaultAbi,
  functionName: 'vaultState',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link orderlyVaultAbi}__
 */
export const useWriteOrderlyVault = /*#__PURE__*/ createUseWriteContract({
  abi: orderlyVaultAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link orderlyVaultAbi}__ and `functionName` set to `"acceptOwnership"`
 */
export const useWriteOrderlyVaultAcceptOwnership = /*#__PURE__*/ createUseWriteContract({
  abi: orderlyVaultAbi,
  functionName: 'acceptOwnership',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link orderlyVaultAbi}__ and `functionName` set to `"claimWithFee"`
 */
export const useWriteOrderlyVaultClaimWithFee = /*#__PURE__*/ createUseWriteContract({
  abi: orderlyVaultAbi,
  functionName: 'claimWithFee',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link orderlyVaultAbi}__ and `functionName` set to `"deposit"`
 */
export const useWriteOrderlyVaultDeposit = /*#__PURE__*/ createUseWriteContract({
  abi: orderlyVaultAbi,
  functionName: 'deposit',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link orderlyVaultAbi}__ and `functionName` set to `"depositFromStrategy"`
 */
export const useWriteOrderlyVaultDepositFromStrategy = /*#__PURE__*/ createUseWriteContract({
  abi: orderlyVaultAbi,
  functionName: 'depositFromStrategy',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link orderlyVaultAbi}__ and `functionName` set to `"depositToStrategy"`
 */
export const useWriteOrderlyVaultDepositToStrategy = /*#__PURE__*/ createUseWriteContract({
  abi: orderlyVaultAbi,
  functionName: 'depositToStrategy',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link orderlyVaultAbi}__ and `functionName` set to `"emergencyPause"`
 */
export const useWriteOrderlyVaultEmergencyPause = /*#__PURE__*/ createUseWriteContract({
  abi: orderlyVaultAbi,
  functionName: 'emergencyPause',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link orderlyVaultAbi}__ and `functionName` set to `"emergencyUnpause"`
 */
export const useWriteOrderlyVaultEmergencyUnpause = /*#__PURE__*/ createUseWriteContract({
  abi: orderlyVaultAbi,
  functionName: 'emergencyUnpause',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link orderlyVaultAbi}__ and `functionName` set to `"initialize"`
 */
export const useWriteOrderlyVaultInitialize = /*#__PURE__*/ createUseWriteContract({
  abi: orderlyVaultAbi,
  functionName: 'initialize',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link orderlyVaultAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWriteOrderlyVaultRenounceOwnership = /*#__PURE__*/ createUseWriteContract({
  abi: orderlyVaultAbi,
  functionName: 'renounceOwnership',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link orderlyVaultAbi}__ and `functionName` set to `"setAdmin"`
 */
export const useWriteOrderlyVaultSetAdmin = /*#__PURE__*/ createUseWriteContract({
  abi: orderlyVaultAbi,
  functionName: 'setAdmin',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link orderlyVaultAbi}__ and `functionName` set to `"setAllowedBroker"`
 */
export const useWriteOrderlyVaultSetAllowedBroker = /*#__PURE__*/ createUseWriteContract({
  abi: orderlyVaultAbi,
  functionName: 'setAllowedBroker',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link orderlyVaultAbi}__ and `functionName` set to `"setAllowedStrategy"`
 */
export const useWriteOrderlyVaultSetAllowedStrategy = /*#__PURE__*/ createUseWriteContract({
  abi: orderlyVaultAbi,
  functionName: 'setAllowedStrategy',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link orderlyVaultAbi}__ and `functionName` set to `"setAllowedStrategyProvider"`
 */
export const useWriteOrderlyVaultSetAllowedStrategyProvider = /*#__PURE__*/ createUseWriteContract({
  abi: orderlyVaultAbi,
  functionName: 'setAllowedStrategyProvider',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link orderlyVaultAbi}__ and `functionName` set to `"setAllowedToken"`
 */
export const useWriteOrderlyVaultSetAllowedToken = /*#__PURE__*/ createUseWriteContract({
  abi: orderlyVaultAbi,
  functionName: 'setAllowedToken',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link orderlyVaultAbi}__ and `functionName` set to `"setCrossChainManager"`
 */
export const useWriteOrderlyVaultSetCrossChainManager = /*#__PURE__*/ createUseWriteContract({
  abi: orderlyVaultAbi,
  functionName: 'setCrossChainManager',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link orderlyVaultAbi}__ and `functionName` set to `"setLedgerEid"`
 */
export const useWriteOrderlyVaultSetLedgerEid = /*#__PURE__*/ createUseWriteContract({
  abi: orderlyVaultAbi,
  functionName: 'setLedgerEid',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link orderlyVaultAbi}__ and `functionName` set to `"setLpWhitelistConfig"`
 */
export const useWriteOrderlyVaultSetLpWhitelistConfig = /*#__PURE__*/ createUseWriteContract({
  abi: orderlyVaultAbi,
  functionName: 'setLpWhitelistConfig',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link orderlyVaultAbi}__ and `functionName` set to `"setMinDepositForLP"`
 */
export const useWriteOrderlyVaultSetMinDepositForLp = /*#__PURE__*/ createUseWriteContract({
  abi: orderlyVaultAbi,
  functionName: 'setMinDepositForLP',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link orderlyVaultAbi}__ and `functionName` set to `"setMinDepositForSP"`
 */
export const useWriteOrderlyVaultSetMinDepositForSp = /*#__PURE__*/ createUseWriteContract({
  abi: orderlyVaultAbi,
  functionName: 'setMinDepositForSP',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link orderlyVaultAbi}__ and `functionName` set to `"setOrderlyDexVault"`
 */
export const useWriteOrderlyVaultSetOrderlyDexVault = /*#__PURE__*/ createUseWriteContract({
  abi: orderlyVaultAbi,
  functionName: 'setOrderlyDexVault',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link orderlyVaultAbi}__ and `functionName` set to `"setTokenHashToAddress"`
 */
export const useWriteOrderlyVaultSetTokenHashToAddress = /*#__PURE__*/ createUseWriteContract({
  abi: orderlyVaultAbi,
  functionName: 'setTokenHashToAddress',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link orderlyVaultAbi}__ and `functionName` set to `"setVaultState"`
 */
export const useWriteOrderlyVaultSetVaultState = /*#__PURE__*/ createUseWriteContract({
  abi: orderlyVaultAbi,
  functionName: 'setVaultState',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link orderlyVaultAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteOrderlyVaultTransferOwnership = /*#__PURE__*/ createUseWriteContract({
  abi: orderlyVaultAbi,
  functionName: 'transferOwnership',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link orderlyVaultAbi}__ and `functionName` set to `"updateLpWhitelist"`
 */
export const useWriteOrderlyVaultUpdateLpWhitelist = /*#__PURE__*/ createUseWriteContract({
  abi: orderlyVaultAbi,
  functionName: 'updateLpWhitelist',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link orderlyVaultAbi}__ and `functionName` set to `"updateUnClaimed"`
 */
export const useWriteOrderlyVaultUpdateUnClaimed = /*#__PURE__*/ createUseWriteContract({
  abi: orderlyVaultAbi,
  functionName: 'updateUnClaimed',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link orderlyVaultAbi}__ and `functionName` set to `"upgradeToAndCall"`
 */
export const useWriteOrderlyVaultUpgradeToAndCall = /*#__PURE__*/ createUseWriteContract({
  abi: orderlyVaultAbi,
  functionName: 'upgradeToAndCall',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link orderlyVaultAbi}__ and `functionName` set to `"withdraw"`
 */
export const useWriteOrderlyVaultWithdraw = /*#__PURE__*/ createUseWriteContract({
  abi: orderlyVaultAbi,
  functionName: 'withdraw',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link orderlyVaultAbi}__ and `functionName` set to `"withdrawNativeToken"`
 */
export const useWriteOrderlyVaultWithdrawNativeToken = /*#__PURE__*/ createUseWriteContract({
  abi: orderlyVaultAbi,
  functionName: 'withdrawNativeToken',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link orderlyVaultAbi}__
 */
export const useSimulateOrderlyVault = /*#__PURE__*/ createUseSimulateContract({
  abi: orderlyVaultAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link orderlyVaultAbi}__ and `functionName` set to `"acceptOwnership"`
 */
export const useSimulateOrderlyVaultAcceptOwnership = /*#__PURE__*/ createUseSimulateContract({
  abi: orderlyVaultAbi,
  functionName: 'acceptOwnership',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link orderlyVaultAbi}__ and `functionName` set to `"claimWithFee"`
 */
export const useSimulateOrderlyVaultClaimWithFee = /*#__PURE__*/ createUseSimulateContract({
  abi: orderlyVaultAbi,
  functionName: 'claimWithFee',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link orderlyVaultAbi}__ and `functionName` set to `"deposit"`
 */
export const useSimulateOrderlyVaultDeposit = /*#__PURE__*/ createUseSimulateContract({
  abi: orderlyVaultAbi,
  functionName: 'deposit',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link orderlyVaultAbi}__ and `functionName` set to `"depositFromStrategy"`
 */
export const useSimulateOrderlyVaultDepositFromStrategy = /*#__PURE__*/ createUseSimulateContract({
  abi: orderlyVaultAbi,
  functionName: 'depositFromStrategy',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link orderlyVaultAbi}__ and `functionName` set to `"depositToStrategy"`
 */
export const useSimulateOrderlyVaultDepositToStrategy = /*#__PURE__*/ createUseSimulateContract({
  abi: orderlyVaultAbi,
  functionName: 'depositToStrategy',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link orderlyVaultAbi}__ and `functionName` set to `"emergencyPause"`
 */
export const useSimulateOrderlyVaultEmergencyPause = /*#__PURE__*/ createUseSimulateContract({
  abi: orderlyVaultAbi,
  functionName: 'emergencyPause',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link orderlyVaultAbi}__ and `functionName` set to `"emergencyUnpause"`
 */
export const useSimulateOrderlyVaultEmergencyUnpause = /*#__PURE__*/ createUseSimulateContract({
  abi: orderlyVaultAbi,
  functionName: 'emergencyUnpause',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link orderlyVaultAbi}__ and `functionName` set to `"initialize"`
 */
export const useSimulateOrderlyVaultInitialize = /*#__PURE__*/ createUseSimulateContract({
  abi: orderlyVaultAbi,
  functionName: 'initialize',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link orderlyVaultAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulateOrderlyVaultRenounceOwnership = /*#__PURE__*/ createUseSimulateContract({
  abi: orderlyVaultAbi,
  functionName: 'renounceOwnership',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link orderlyVaultAbi}__ and `functionName` set to `"setAdmin"`
 */
export const useSimulateOrderlyVaultSetAdmin = /*#__PURE__*/ createUseSimulateContract({
  abi: orderlyVaultAbi,
  functionName: 'setAdmin',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link orderlyVaultAbi}__ and `functionName` set to `"setAllowedBroker"`
 */
export const useSimulateOrderlyVaultSetAllowedBroker = /*#__PURE__*/ createUseSimulateContract({
  abi: orderlyVaultAbi,
  functionName: 'setAllowedBroker',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link orderlyVaultAbi}__ and `functionName` set to `"setAllowedStrategy"`
 */
export const useSimulateOrderlyVaultSetAllowedStrategy = /*#__PURE__*/ createUseSimulateContract({
  abi: orderlyVaultAbi,
  functionName: 'setAllowedStrategy',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link orderlyVaultAbi}__ and `functionName` set to `"setAllowedStrategyProvider"`
 */
export const useSimulateOrderlyVaultSetAllowedStrategyProvider = /*#__PURE__*/ createUseSimulateContract({
  abi: orderlyVaultAbi,
  functionName: 'setAllowedStrategyProvider',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link orderlyVaultAbi}__ and `functionName` set to `"setAllowedToken"`
 */
export const useSimulateOrderlyVaultSetAllowedToken = /*#__PURE__*/ createUseSimulateContract({
  abi: orderlyVaultAbi,
  functionName: 'setAllowedToken',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link orderlyVaultAbi}__ and `functionName` set to `"setCrossChainManager"`
 */
export const useSimulateOrderlyVaultSetCrossChainManager = /*#__PURE__*/ createUseSimulateContract({
  abi: orderlyVaultAbi,
  functionName: 'setCrossChainManager',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link orderlyVaultAbi}__ and `functionName` set to `"setLedgerEid"`
 */
export const useSimulateOrderlyVaultSetLedgerEid = /*#__PURE__*/ createUseSimulateContract({
  abi: orderlyVaultAbi,
  functionName: 'setLedgerEid',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link orderlyVaultAbi}__ and `functionName` set to `"setLpWhitelistConfig"`
 */
export const useSimulateOrderlyVaultSetLpWhitelistConfig = /*#__PURE__*/ createUseSimulateContract({
  abi: orderlyVaultAbi,
  functionName: 'setLpWhitelistConfig',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link orderlyVaultAbi}__ and `functionName` set to `"setMinDepositForLP"`
 */
export const useSimulateOrderlyVaultSetMinDepositForLp = /*#__PURE__*/ createUseSimulateContract({
  abi: orderlyVaultAbi,
  functionName: 'setMinDepositForLP',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link orderlyVaultAbi}__ and `functionName` set to `"setMinDepositForSP"`
 */
export const useSimulateOrderlyVaultSetMinDepositForSp = /*#__PURE__*/ createUseSimulateContract({
  abi: orderlyVaultAbi,
  functionName: 'setMinDepositForSP',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link orderlyVaultAbi}__ and `functionName` set to `"setOrderlyDexVault"`
 */
export const useSimulateOrderlyVaultSetOrderlyDexVault = /*#__PURE__*/ createUseSimulateContract({
  abi: orderlyVaultAbi,
  functionName: 'setOrderlyDexVault',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link orderlyVaultAbi}__ and `functionName` set to `"setTokenHashToAddress"`
 */
export const useSimulateOrderlyVaultSetTokenHashToAddress = /*#__PURE__*/ createUseSimulateContract({
  abi: orderlyVaultAbi,
  functionName: 'setTokenHashToAddress',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link orderlyVaultAbi}__ and `functionName` set to `"setVaultState"`
 */
export const useSimulateOrderlyVaultSetVaultState = /*#__PURE__*/ createUseSimulateContract({
  abi: orderlyVaultAbi,
  functionName: 'setVaultState',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link orderlyVaultAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateOrderlyVaultTransferOwnership = /*#__PURE__*/ createUseSimulateContract({
  abi: orderlyVaultAbi,
  functionName: 'transferOwnership',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link orderlyVaultAbi}__ and `functionName` set to `"updateLpWhitelist"`
 */
export const useSimulateOrderlyVaultUpdateLpWhitelist = /*#__PURE__*/ createUseSimulateContract({
  abi: orderlyVaultAbi,
  functionName: 'updateLpWhitelist',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link orderlyVaultAbi}__ and `functionName` set to `"updateUnClaimed"`
 */
export const useSimulateOrderlyVaultUpdateUnClaimed = /*#__PURE__*/ createUseSimulateContract({
  abi: orderlyVaultAbi,
  functionName: 'updateUnClaimed',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link orderlyVaultAbi}__ and `functionName` set to `"upgradeToAndCall"`
 */
export const useSimulateOrderlyVaultUpgradeToAndCall = /*#__PURE__*/ createUseSimulateContract({
  abi: orderlyVaultAbi,
  functionName: 'upgradeToAndCall',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link orderlyVaultAbi}__ and `functionName` set to `"withdraw"`
 */
export const useSimulateOrderlyVaultWithdraw = /*#__PURE__*/ createUseSimulateContract({
  abi: orderlyVaultAbi,
  functionName: 'withdraw',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link orderlyVaultAbi}__ and `functionName` set to `"withdrawNativeToken"`
 */
export const useSimulateOrderlyVaultWithdrawNativeToken = /*#__PURE__*/ createUseSimulateContract({
  abi: orderlyVaultAbi,
  functionName: 'withdrawNativeToken',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link orderlyVaultAbi}__
 */
export const useWatchOrderlyVaultEvent = /*#__PURE__*/ createUseWatchContractEvent({ abi: orderlyVaultAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link orderlyVaultAbi}__ and `eventName` set to `"AdminSet"`
 */
export const useWatchOrderlyVaultAdminSetEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: orderlyVaultAbi,
  eventName: 'AdminSet',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link orderlyVaultAbi}__ and `eventName` set to `"AllowedBrokerSet"`
 */
export const useWatchOrderlyVaultAllowedBrokerSetEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: orderlyVaultAbi,
  eventName: 'AllowedBrokerSet',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link orderlyVaultAbi}__ and `eventName` set to `"AllowedStrategySet"`
 */
export const useWatchOrderlyVaultAllowedStrategySetEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: orderlyVaultAbi,
  eventName: 'AllowedStrategySet',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link orderlyVaultAbi}__ and `eventName` set to `"AllowedTokenSet"`
 */
export const useWatchOrderlyVaultAllowedTokenSetEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: orderlyVaultAbi,
  eventName: 'AllowedTokenSet',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link orderlyVaultAbi}__ and `eventName` set to `"DepositFromStrategy"`
 */
export const useWatchOrderlyVaultDepositFromStrategyEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: orderlyVaultAbi,
  eventName: 'DepositFromStrategy',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link orderlyVaultAbi}__ and `eventName` set to `"DepositToStrategy"`
 */
export const useWatchOrderlyVaultDepositToStrategyEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: orderlyVaultAbi,
  eventName: 'DepositToStrategy',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link orderlyVaultAbi}__ and `eventName` set to `"Initialized"`
 */
export const useWatchOrderlyVaultInitializedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: orderlyVaultAbi,
  eventName: 'Initialized',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link orderlyVaultAbi}__ and `eventName` set to `"OperationExecuted"`
 */
export const useWatchOrderlyVaultOperationExecutedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: orderlyVaultAbi,
  eventName: 'OperationExecuted',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link orderlyVaultAbi}__ and `eventName` set to `"OwnershipTransferStarted"`
 */
export const useWatchOrderlyVaultOwnershipTransferStartedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: orderlyVaultAbi,
  eventName: 'OwnershipTransferStarted',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link orderlyVaultAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchOrderlyVaultOwnershipTransferredEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: orderlyVaultAbi,
  eventName: 'OwnershipTransferred',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link orderlyVaultAbi}__ and `eventName` set to `"Paused"`
 */
export const useWatchOrderlyVaultPausedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: orderlyVaultAbi,
  eventName: 'Paused',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link orderlyVaultAbi}__ and `eventName` set to `"UnClaimedUpdated"`
 */
export const useWatchOrderlyVaultUnClaimedUpdatedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: orderlyVaultAbi,
  eventName: 'UnClaimedUpdated',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link orderlyVaultAbi}__ and `eventName` set to `"Unpaused"`
 */
export const useWatchOrderlyVaultUnpausedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: orderlyVaultAbi,
  eventName: 'Unpaused',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link orderlyVaultAbi}__ and `eventName` set to `"Upgraded"`
 */
export const useWatchOrderlyVaultUpgradedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: orderlyVaultAbi,
  eventName: 'Upgraded',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link orderlyVaultAbi}__ and `eventName` set to `"UserClaimed"`
 */
export const useWatchOrderlyVaultUserClaimedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: orderlyVaultAbi,
  eventName: 'UserClaimed',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link orderlyVaultAbi}__ and `eventName` set to `"VaultStateChanged"`
 */
export const useWatchOrderlyVaultVaultStateChangedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: orderlyVaultAbi,
  eventName: 'VaultStateChanged',
})
