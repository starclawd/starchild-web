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
// vault
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const vaultAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  { type: 'error', inputs: [], name: 'AccessControlBadConfirmation' },
  {
    type: 'error',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'neededRole', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'AccessControlUnauthorizedAccount',
  },
  { type: 'error', inputs: [], name: 'AccountIdInvalid' },
  { type: 'error', inputs: [], name: 'AddressZero' },
  {
    type: 'error',
    inputs: [
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'amount', internalType: 'uint128', type: 'uint128' },
    ],
    name: 'BalanceNotEnough',
  },
  { type: 'error', inputs: [], name: 'BrokerNotAllowed' },
  {
    type: 'error',
    inputs: [
      { name: 'want', internalType: 'address', type: 'address' },
      { name: 'got', internalType: 'address', type: 'address' },
    ],
    name: 'CeffuAddressMismatch',
  },
  { type: 'error', inputs: [], name: 'DepositExceedLimit' },
  { type: 'error', inputs: [], name: 'EnumerableSetError' },
  { type: 'error', inputs: [], name: 'InvalidSwapSignature' },
  { type: 'error', inputs: [], name: 'InvalidTokenAddress' },
  { type: 'error', inputs: [], name: 'NativeTokenDepositAmountMismatch' },
  { type: 'error', inputs: [], name: 'NotRebalanceEnableToken' },
  { type: 'error', inputs: [], name: 'NotZeroCodeLength' },
  { type: 'error', inputs: [], name: 'OnlyCrossChainManagerCanCall' },
  { type: 'error', inputs: [], name: 'ReentrancyGuardReentrantCall' },
  { type: 'error', inputs: [], name: 'SwapAlreadySubmitted' },
  { type: 'error', inputs: [], name: 'TokenNotAllowed' },
  { type: 'error', inputs: [], name: 'ZeroCodeLength' },
  { type: 'error', inputs: [], name: 'ZeroDeposit' },
  { type: 'error', inputs: [], name: 'ZeroDepositFee' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'delegateContract',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'brokerHash',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'delegateSigner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'chainId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'blockNumber',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'AccountDelegate',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'accountId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'userAddress',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'depositNonce',
        internalType: 'uint64',
        type: 'uint64',
        indexed: true,
      },
      {
        name: 'tokenHash',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false,
      },
      {
        name: 'tokenAmount',
        internalType: 'uint128',
        type: 'uint128',
        indexed: false,
      },
    ],
    name: 'AccountDeposit',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'accountId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'userAddress',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'depositNonce',
        internalType: 'uint64',
        type: 'uint64',
        indexed: true,
      },
      {
        name: 'tokenHash',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false,
      },
      {
        name: 'tokenAmount',
        internalType: 'uint128',
        type: 'uint128',
        indexed: false,
      },
    ],
    name: 'AccountDepositTo',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'accountId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'withdrawNonce',
        internalType: 'uint64',
        type: 'uint64',
        indexed: true,
      },
      {
        name: 'brokerHash',
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
        name: 'receiver',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'tokenHash',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false,
      },
      {
        name: 'tokenAmount',
        internalType: 'uint128',
        type: 'uint128',
        indexed: false,
      },
      { name: 'fee', internalType: 'uint128', type: 'uint128', indexed: false },
    ],
    name: 'AccountWithdraw',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldAddress',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'newAddress',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'ChangeCrossChainManager',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_tokenAddress',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: '_limit',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ChangeDepositLimit',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_tokenHash',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: '_tokenAddress',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'ChangeTokenAddressAndAllow',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'tradeId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'inTokenHash',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false,
      },
      {
        name: 'inTokenAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      { name: 'to', internalType: 'address', type: 'address', indexed: false },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'DelegateSwapExecuted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'version', internalType: 'uint8', type: 'uint8', indexed: false }],
    name: 'Initialized',
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
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'previousAdminRole',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'newAdminRole',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
    ],
    name: 'RoleAdminChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'RoleGranted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'RoleRevoked',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_brokerHash',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      { name: '_allowed', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'SetAllowedBroker',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_tokenHash',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      { name: '_allowed', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'SetAllowedToken',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'brokerHash',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'dstChainId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      { name: 'allowed', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'SetBrokerFromLedgerAlreadySet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'brokerHash',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'dstChainId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      { name: 'allowed', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'SetBrokerFromLedgerSuccess',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_oldCeffuAddress',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: '_newCeffuAddress',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'SetCeffuAddress',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_oldProtocolVaultAddress',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: '_newProtocolVaultAddress',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'SetProtocolVaultAddress',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_tokenHash',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      { name: '_allowed', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'SetRebalanceEnableToken',
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
        name: 'adapter',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'VaultAdapterSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'receiver',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'WithdrawFailed',
  },
  {
    type: 'function',
    inputs: [],
    name: 'BROKER_MANAGER_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'DEFAULT_ADMIN_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'SYMBOL_MANAGER_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    name: 'allowedToken',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'cctpFinalityThreshold',
    outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'cctpMaxFee',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_tokenHash', internalType: 'bytes32', type: 'bytes32' },
      { name: '_tokenAddress', internalType: 'address', type: 'address' },
    ],
    name: 'changeTokenAddressAndAllow',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'crossChainManagerAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'data',
        internalType: 'struct VaultTypes.VaultDelegate',
        type: 'tuple',
        components: [
          { name: 'brokerHash', internalType: 'bytes32', type: 'bytes32' },
          { name: 'delegateSigner', internalType: 'address', type: 'address' },
        ],
      },
    ],
    name: 'delegateSigner',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'data',
        internalType: 'struct VaultTypes.DelegateSwap',
        type: 'tuple',
        components: [
          { name: 'tradeId', internalType: 'bytes32', type: 'bytes32' },
          { name: 'chainId', internalType: 'uint256', type: 'uint256' },
          { name: 'inTokenHash', internalType: 'bytes32', type: 'bytes32' },
          { name: 'inTokenAmount', internalType: 'uint256', type: 'uint256' },
          { name: 'to', internalType: 'address', type: 'address' },
          { name: 'value', internalType: 'uint256', type: 'uint256' },
          { name: 'swapCalldata', internalType: 'bytes', type: 'bytes' },
          { name: 'r', internalType: 'bytes32', type: 'bytes32' },
          { name: 's', internalType: 'bytes32', type: 'bytes32' },
          { name: 'v', internalType: 'uint8', type: 'uint8' },
        ],
      },
    ],
    name: 'delegateSwap',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'data',
        internalType: 'struct VaultTypes.VaultDepositFE',
        type: 'tuple',
        components: [
          { name: 'accountId', internalType: 'bytes32', type: 'bytes32' },
          { name: 'brokerHash', internalType: 'bytes32', type: 'bytes32' },
          { name: 'tokenHash', internalType: 'bytes32', type: 'bytes32' },
          { name: 'tokenAmount', internalType: 'uint128', type: 'uint128' },
        ],
      },
    ],
    name: 'deposit',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'depositFeeEnabled',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'depositId',
    outputs: [{ name: '', internalType: 'uint64', type: 'uint64' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'receiver', internalType: 'address', type: 'address' },
      {
        name: 'data',
        internalType: 'struct VaultTypes.VaultDepositFE',
        type: 'tuple',
        components: [
          { name: 'accountId', internalType: 'bytes32', type: 'bytes32' },
          { name: 'brokerHash', internalType: 'bytes32', type: 'bytes32' },
          { name: 'tokenHash', internalType: 'bytes32', type: 'bytes32' },
          { name: 'tokenAmount', internalType: 'uint128', type: 'uint128' },
        ],
      },
    ],
    name: 'depositTo',
    outputs: [],
    stateMutability: 'payable',
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
    inputs: [{ name: '_enabled', internalType: 'bool', type: 'bool' }],
    name: 'enableDepositFee',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getAllAllowedBroker',
    outputs: [{ name: '', internalType: 'bytes32[]', type: 'bytes32[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getAllAllowedToken',
    outputs: [{ name: '', internalType: 'bytes32[]', type: 'bytes32[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getAllRebalanceEnableToken',
    outputs: [{ name: '', internalType: 'bytes32[]', type: 'bytes32[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_brokerHash', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getAllowedBroker',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_tokenHash', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getAllowedToken',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'receiver', internalType: 'address', type: 'address' },
      {
        name: 'data',
        internalType: 'struct VaultTypes.VaultDepositFE',
        type: 'tuple',
        components: [
          { name: 'accountId', internalType: 'bytes32', type: 'bytes32' },
          { name: 'brokerHash', internalType: 'bytes32', type: 'bytes32' },
          { name: 'tokenHash', internalType: 'bytes32', type: 'bytes32' },
          { name: 'tokenAmount', internalType: 'uint128', type: 'uint128' },
        ],
      },
    ],
    name: 'getDepositFee',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'role', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getRoleAdmin',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getSubmittedSwaps',
    outputs: [{ name: '', internalType: 'bytes32[]', type: 'bytes32[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'grantRole',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'hasRole',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'tradeId', internalType: 'bytes32', type: 'bytes32' }],
    name: 'isSwapSubmitted',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'messageTransmitterContract',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'nativeTokenDepositLimit',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'nativeTokenHash',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
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
    name: 'protocolVault',
    outputs: [{ name: '', internalType: 'contract IProtocolVault', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'data',
        internalType: 'struct RebalanceTypes.RebalanceBurnCCData',
        type: 'tuple',
        components: [
          { name: 'dstDomain', internalType: 'uint32', type: 'uint32' },
          { name: 'rebalanceId', internalType: 'uint64', type: 'uint64' },
          { name: 'amount', internalType: 'uint128', type: 'uint128' },
          { name: 'tokenHash', internalType: 'bytes32', type: 'bytes32' },
          { name: 'burnChainId', internalType: 'uint256', type: 'uint256' },
          { name: 'mintChainId', internalType: 'uint256', type: 'uint256' },
          { name: 'dstVaultAddress', internalType: 'address', type: 'address' },
        ],
      },
    ],
    name: 'rebalanceBurn',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'data',
        internalType: 'struct RebalanceTypes.RebalanceMintCCData',
        type: 'tuple',
        components: [
          { name: 'rebalanceId', internalType: 'uint64', type: 'uint64' },
          { name: 'amount', internalType: 'uint128', type: 'uint128' },
          { name: 'tokenHash', internalType: 'bytes32', type: 'bytes32' },
          { name: 'burnChainId', internalType: 'uint256', type: 'uint256' },
          { name: 'mintChainId', internalType: 'uint256', type: 'uint256' },
          { name: 'messageBytes', internalType: 'bytes', type: 'bytes' },
          { name: 'messageSignature', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'rebalanceMint',
    outputs: [],
    stateMutability: 'nonpayable',
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
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'callerConfirmation', internalType: 'address', type: 'address' },
    ],
    name: 'renounceRole',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'revokeRole',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_brokerHash', internalType: 'bytes32', type: 'bytes32' },
      { name: '_allowed', internalType: 'bool', type: 'bool' },
    ],
    name: 'setAllowedBroker',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_tokenHash', internalType: 'bytes32', type: 'bytes32' },
      { name: '_allowed', internalType: 'bool', type: 'bool' },
    ],
    name: 'setAllowedToken',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'data',
        internalType: 'struct EventTypes.SetBrokerData',
        type: 'tuple',
        components: [
          { name: 'brokerHash', internalType: 'bytes32', type: 'bytes32' },
          { name: 'dstChainId', internalType: 'uint256', type: 'uint256' },
          { name: 'allowed', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
    name: 'setBrokerFromLedger',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_maxFee', internalType: 'uint256', type: 'uint256' },
      { name: '_finalityThreshold', internalType: 'uint32', type: 'uint32' },
    ],
    name: 'setCCTPConfig',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_crossChainManagerAddress',
        internalType: 'address',
        type: 'address',
      },
    ],
    name: 'setCrossChainManager',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_tokenAddress', internalType: 'address', type: 'address' },
      { name: '_limit', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setDepositLimit',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_nativeTokenDepositLimit',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    name: 'setNativeTokenDepositLimit',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_nativeTokenHash', internalType: 'bytes32', type: 'bytes32' }],
    name: 'setNativeTokenHash',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_protocolVaultAddress',
        internalType: 'address',
        type: 'address',
      },
    ],
    name: 'setProtocolVaultAddress',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_tokenHash', internalType: 'bytes32', type: 'bytes32' },
      { name: '_allowed', internalType: 'bool', type: 'bool' },
    ],
    name: 'setRebalanceEnableToken',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_rebalanceMessengerContract',
        internalType: 'address',
        type: 'address',
      },
    ],
    name: 'setRebalanceMessengerContract',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_swapOperator', internalType: 'address', type: 'address' }],
    name: 'setSwapOperator',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_swapSigner', internalType: 'address', type: 'address' }],
    name: 'setSwapSigner',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_tokenMessengerContract',
        internalType: 'address',
        type: 'address',
      },
    ],
    name: 'setTokenMessengerContract',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_vaultAdapter', internalType: 'address', type: 'address' }],
    name: 'setVaultAdapter',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'swapOperator',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'swapSigner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'tokenAddress2DepositLimit',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'tokenMessengerContract',
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
    inputs: [],
    name: 'vaultAdapter',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'data',
        internalType: 'struct VaultTypes.VaultWithdraw',
        type: 'tuple',
        components: [
          { name: 'accountId', internalType: 'bytes32', type: 'bytes32' },
          { name: 'brokerHash', internalType: 'bytes32', type: 'bytes32' },
          { name: 'tokenHash', internalType: 'bytes32', type: 'bytes32' },
          { name: 'tokenAmount', internalType: 'uint128', type: 'uint128' },
          { name: 'fee', internalType: 'uint128', type: 'uint128' },
          { name: 'sender', internalType: 'address', type: 'address' },
          { name: 'receiver', internalType: 'address', type: 'address' },
          { name: 'withdrawNonce', internalType: 'uint64', type: 'uint64' },
        ],
      },
    ],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'data',
        internalType: 'struct VaultTypes.VaultWithdraw2Contract',
        type: 'tuple',
        components: [
          {
            name: 'vaultType',
            internalType: 'enum VaultTypes.VaultEnum',
            type: 'uint8',
          },
          { name: 'accountId', internalType: 'bytes32', type: 'bytes32' },
          { name: 'brokerHash', internalType: 'bytes32', type: 'bytes32' },
          { name: 'tokenHash', internalType: 'bytes32', type: 'bytes32' },
          { name: 'tokenAmount', internalType: 'uint128', type: 'uint128' },
          { name: 'fee', internalType: 'uint128', type: 'uint128' },
          { name: 'sender', internalType: 'address', type: 'address' },
          { name: 'receiver', internalType: 'address', type: 'address' },
          { name: 'withdrawNonce', internalType: 'uint64', type: 'uint64' },
          { name: 'clientId', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    name: 'withdraw2Contract',
    outputs: [],
    stateMutability: 'nonpayable',
  },
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

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vaultAbi}__
 */
export const useReadVault = /*#__PURE__*/ createUseReadContract({
  abi: vaultAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"BROKER_MANAGER_ROLE"`
 */
export const useReadVaultBrokerManagerRole = /*#__PURE__*/ createUseReadContract({
  abi: vaultAbi,
  functionName: 'BROKER_MANAGER_ROLE',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"DEFAULT_ADMIN_ROLE"`
 */
export const useReadVaultDefaultAdminRole = /*#__PURE__*/ createUseReadContract({
  abi: vaultAbi,
  functionName: 'DEFAULT_ADMIN_ROLE',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"SYMBOL_MANAGER_ROLE"`
 */
export const useReadVaultSymbolManagerRole = /*#__PURE__*/ createUseReadContract({
  abi: vaultAbi,
  functionName: 'SYMBOL_MANAGER_ROLE',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"allowedToken"`
 */
export const useReadVaultAllowedToken = /*#__PURE__*/ createUseReadContract({
  abi: vaultAbi,
  functionName: 'allowedToken',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"cctpFinalityThreshold"`
 */
export const useReadVaultCctpFinalityThreshold = /*#__PURE__*/ createUseReadContract({
  abi: vaultAbi,
  functionName: 'cctpFinalityThreshold',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"cctpMaxFee"`
 */
export const useReadVaultCctpMaxFee = /*#__PURE__*/ createUseReadContract({
  abi: vaultAbi,
  functionName: 'cctpMaxFee',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"crossChainManagerAddress"`
 */
export const useReadVaultCrossChainManagerAddress = /*#__PURE__*/ createUseReadContract({
  abi: vaultAbi,
  functionName: 'crossChainManagerAddress',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"depositFeeEnabled"`
 */
export const useReadVaultDepositFeeEnabled = /*#__PURE__*/ createUseReadContract({
  abi: vaultAbi,
  functionName: 'depositFeeEnabled',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"depositId"`
 */
export const useReadVaultDepositId = /*#__PURE__*/ createUseReadContract({
  abi: vaultAbi,
  functionName: 'depositId',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"getAllAllowedBroker"`
 */
export const useReadVaultGetAllAllowedBroker = /*#__PURE__*/ createUseReadContract({
  abi: vaultAbi,
  functionName: 'getAllAllowedBroker',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"getAllAllowedToken"`
 */
export const useReadVaultGetAllAllowedToken = /*#__PURE__*/ createUseReadContract({
  abi: vaultAbi,
  functionName: 'getAllAllowedToken',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"getAllRebalanceEnableToken"`
 */
export const useReadVaultGetAllRebalanceEnableToken = /*#__PURE__*/ createUseReadContract({
  abi: vaultAbi,
  functionName: 'getAllRebalanceEnableToken',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"getAllowedBroker"`
 */
export const useReadVaultGetAllowedBroker = /*#__PURE__*/ createUseReadContract({
  abi: vaultAbi,
  functionName: 'getAllowedBroker',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"getAllowedToken"`
 */
export const useReadVaultGetAllowedToken = /*#__PURE__*/ createUseReadContract({
  abi: vaultAbi,
  functionName: 'getAllowedToken',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"getDepositFee"`
 */
export const useReadVaultGetDepositFee = /*#__PURE__*/ createUseReadContract({
  abi: vaultAbi,
  functionName: 'getDepositFee',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"getRoleAdmin"`
 */
export const useReadVaultGetRoleAdmin = /*#__PURE__*/ createUseReadContract({
  abi: vaultAbi,
  functionName: 'getRoleAdmin',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"getSubmittedSwaps"`
 */
export const useReadVaultGetSubmittedSwaps = /*#__PURE__*/ createUseReadContract({
  abi: vaultAbi,
  functionName: 'getSubmittedSwaps',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"hasRole"`
 */
export const useReadVaultHasRole = /*#__PURE__*/ createUseReadContract({
  abi: vaultAbi,
  functionName: 'hasRole',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"isSwapSubmitted"`
 */
export const useReadVaultIsSwapSubmitted = /*#__PURE__*/ createUseReadContract({
  abi: vaultAbi,
  functionName: 'isSwapSubmitted',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"messageTransmitterContract"`
 */
export const useReadVaultMessageTransmitterContract = /*#__PURE__*/ createUseReadContract({
  abi: vaultAbi,
  functionName: 'messageTransmitterContract',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"nativeTokenDepositLimit"`
 */
export const useReadVaultNativeTokenDepositLimit = /*#__PURE__*/ createUseReadContract({
  abi: vaultAbi,
  functionName: 'nativeTokenDepositLimit',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"nativeTokenHash"`
 */
export const useReadVaultNativeTokenHash = /*#__PURE__*/ createUseReadContract({
  abi: vaultAbi,
  functionName: 'nativeTokenHash',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"owner"`
 */
export const useReadVaultOwner = /*#__PURE__*/ createUseReadContract({
  abi: vaultAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"paused"`
 */
export const useReadVaultPaused = /*#__PURE__*/ createUseReadContract({
  abi: vaultAbi,
  functionName: 'paused',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"protocolVault"`
 */
export const useReadVaultProtocolVault = /*#__PURE__*/ createUseReadContract({
  abi: vaultAbi,
  functionName: 'protocolVault',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"swapOperator"`
 */
export const useReadVaultSwapOperator = /*#__PURE__*/ createUseReadContract({
  abi: vaultAbi,
  functionName: 'swapOperator',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"swapSigner"`
 */
export const useReadVaultSwapSigner = /*#__PURE__*/ createUseReadContract({
  abi: vaultAbi,
  functionName: 'swapSigner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"tokenAddress2DepositLimit"`
 */
export const useReadVaultTokenAddress2DepositLimit = /*#__PURE__*/ createUseReadContract({
  abi: vaultAbi,
  functionName: 'tokenAddress2DepositLimit',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"tokenMessengerContract"`
 */
export const useReadVaultTokenMessengerContract = /*#__PURE__*/ createUseReadContract({
  abi: vaultAbi,
  functionName: 'tokenMessengerContract',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"vaultAdapter"`
 */
export const useReadVaultVaultAdapter = /*#__PURE__*/ createUseReadContract({
  abi: vaultAbi,
  functionName: 'vaultAdapter',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vaultAbi}__
 */
export const useWriteVault = /*#__PURE__*/ createUseWriteContract({
  abi: vaultAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"changeTokenAddressAndAllow"`
 */
export const useWriteVaultChangeTokenAddressAndAllow = /*#__PURE__*/ createUseWriteContract({
  abi: vaultAbi,
  functionName: 'changeTokenAddressAndAllow',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"delegateSigner"`
 */
export const useWriteVaultDelegateSigner = /*#__PURE__*/ createUseWriteContract({
  abi: vaultAbi,
  functionName: 'delegateSigner',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"delegateSwap"`
 */
export const useWriteVaultDelegateSwap = /*#__PURE__*/ createUseWriteContract({
  abi: vaultAbi,
  functionName: 'delegateSwap',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"deposit"`
 */
export const useWriteVaultDeposit = /*#__PURE__*/ createUseWriteContract({
  abi: vaultAbi,
  functionName: 'deposit',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"depositTo"`
 */
export const useWriteVaultDepositTo = /*#__PURE__*/ createUseWriteContract({
  abi: vaultAbi,
  functionName: 'depositTo',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"emergencyPause"`
 */
export const useWriteVaultEmergencyPause = /*#__PURE__*/ createUseWriteContract({
  abi: vaultAbi,
  functionName: 'emergencyPause',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"emergencyUnpause"`
 */
export const useWriteVaultEmergencyUnpause = /*#__PURE__*/ createUseWriteContract({
  abi: vaultAbi,
  functionName: 'emergencyUnpause',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"enableDepositFee"`
 */
export const useWriteVaultEnableDepositFee = /*#__PURE__*/ createUseWriteContract({
  abi: vaultAbi,
  functionName: 'enableDepositFee',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"grantRole"`
 */
export const useWriteVaultGrantRole = /*#__PURE__*/ createUseWriteContract({
  abi: vaultAbi,
  functionName: 'grantRole',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"initialize"`
 */
export const useWriteVaultInitialize = /*#__PURE__*/ createUseWriteContract({
  abi: vaultAbi,
  functionName: 'initialize',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"rebalanceBurn"`
 */
export const useWriteVaultRebalanceBurn = /*#__PURE__*/ createUseWriteContract({
  abi: vaultAbi,
  functionName: 'rebalanceBurn',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"rebalanceMint"`
 */
export const useWriteVaultRebalanceMint = /*#__PURE__*/ createUseWriteContract({
  abi: vaultAbi,
  functionName: 'rebalanceMint',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWriteVaultRenounceOwnership = /*#__PURE__*/ createUseWriteContract({
  abi: vaultAbi,
  functionName: 'renounceOwnership',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"renounceRole"`
 */
export const useWriteVaultRenounceRole = /*#__PURE__*/ createUseWriteContract({
  abi: vaultAbi,
  functionName: 'renounceRole',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"revokeRole"`
 */
export const useWriteVaultRevokeRole = /*#__PURE__*/ createUseWriteContract({
  abi: vaultAbi,
  functionName: 'revokeRole',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"setAllowedBroker"`
 */
export const useWriteVaultSetAllowedBroker = /*#__PURE__*/ createUseWriteContract({
  abi: vaultAbi,
  functionName: 'setAllowedBroker',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"setAllowedToken"`
 */
export const useWriteVaultSetAllowedToken = /*#__PURE__*/ createUseWriteContract({
  abi: vaultAbi,
  functionName: 'setAllowedToken',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"setBrokerFromLedger"`
 */
export const useWriteVaultSetBrokerFromLedger = /*#__PURE__*/ createUseWriteContract({
  abi: vaultAbi,
  functionName: 'setBrokerFromLedger',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"setCCTPConfig"`
 */
export const useWriteVaultSetCctpConfig = /*#__PURE__*/ createUseWriteContract({
  abi: vaultAbi,
  functionName: 'setCCTPConfig',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"setCrossChainManager"`
 */
export const useWriteVaultSetCrossChainManager = /*#__PURE__*/ createUseWriteContract({
  abi: vaultAbi,
  functionName: 'setCrossChainManager',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"setDepositLimit"`
 */
export const useWriteVaultSetDepositLimit = /*#__PURE__*/ createUseWriteContract({
  abi: vaultAbi,
  functionName: 'setDepositLimit',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"setNativeTokenDepositLimit"`
 */
export const useWriteVaultSetNativeTokenDepositLimit = /*#__PURE__*/ createUseWriteContract({
  abi: vaultAbi,
  functionName: 'setNativeTokenDepositLimit',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"setNativeTokenHash"`
 */
export const useWriteVaultSetNativeTokenHash = /*#__PURE__*/ createUseWriteContract({
  abi: vaultAbi,
  functionName: 'setNativeTokenHash',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"setProtocolVaultAddress"`
 */
export const useWriteVaultSetProtocolVaultAddress = /*#__PURE__*/ createUseWriteContract({
  abi: vaultAbi,
  functionName: 'setProtocolVaultAddress',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"setRebalanceEnableToken"`
 */
export const useWriteVaultSetRebalanceEnableToken = /*#__PURE__*/ createUseWriteContract({
  abi: vaultAbi,
  functionName: 'setRebalanceEnableToken',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"setRebalanceMessengerContract"`
 */
export const useWriteVaultSetRebalanceMessengerContract = /*#__PURE__*/ createUseWriteContract({
  abi: vaultAbi,
  functionName: 'setRebalanceMessengerContract',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"setSwapOperator"`
 */
export const useWriteVaultSetSwapOperator = /*#__PURE__*/ createUseWriteContract({
  abi: vaultAbi,
  functionName: 'setSwapOperator',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"setSwapSigner"`
 */
export const useWriteVaultSetSwapSigner = /*#__PURE__*/ createUseWriteContract({
  abi: vaultAbi,
  functionName: 'setSwapSigner',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"setTokenMessengerContract"`
 */
export const useWriteVaultSetTokenMessengerContract = /*#__PURE__*/ createUseWriteContract({
  abi: vaultAbi,
  functionName: 'setTokenMessengerContract',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"setVaultAdapter"`
 */
export const useWriteVaultSetVaultAdapter = /*#__PURE__*/ createUseWriteContract({
  abi: vaultAbi,
  functionName: 'setVaultAdapter',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteVaultTransferOwnership = /*#__PURE__*/ createUseWriteContract({
  abi: vaultAbi,
  functionName: 'transferOwnership',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"withdraw"`
 */
export const useWriteVaultWithdraw = /*#__PURE__*/ createUseWriteContract({
  abi: vaultAbi,
  functionName: 'withdraw',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"withdraw2Contract"`
 */
export const useWriteVaultWithdraw2Contract = /*#__PURE__*/ createUseWriteContract({
  abi: vaultAbi,
  functionName: 'withdraw2Contract',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vaultAbi}__
 */
export const useSimulateVault = /*#__PURE__*/ createUseSimulateContract({
  abi: vaultAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"changeTokenAddressAndAllow"`
 */
export const useSimulateVaultChangeTokenAddressAndAllow = /*#__PURE__*/ createUseSimulateContract({
  abi: vaultAbi,
  functionName: 'changeTokenAddressAndAllow',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"delegateSigner"`
 */
export const useSimulateVaultDelegateSigner = /*#__PURE__*/ createUseSimulateContract({
  abi: vaultAbi,
  functionName: 'delegateSigner',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"delegateSwap"`
 */
export const useSimulateVaultDelegateSwap = /*#__PURE__*/ createUseSimulateContract({
  abi: vaultAbi,
  functionName: 'delegateSwap',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"deposit"`
 */
export const useSimulateVaultDeposit = /*#__PURE__*/ createUseSimulateContract({
  abi: vaultAbi,
  functionName: 'deposit',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"depositTo"`
 */
export const useSimulateVaultDepositTo = /*#__PURE__*/ createUseSimulateContract({
  abi: vaultAbi,
  functionName: 'depositTo',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"emergencyPause"`
 */
export const useSimulateVaultEmergencyPause = /*#__PURE__*/ createUseSimulateContract({
  abi: vaultAbi,
  functionName: 'emergencyPause',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"emergencyUnpause"`
 */
export const useSimulateVaultEmergencyUnpause = /*#__PURE__*/ createUseSimulateContract({
  abi: vaultAbi,
  functionName: 'emergencyUnpause',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"enableDepositFee"`
 */
export const useSimulateVaultEnableDepositFee = /*#__PURE__*/ createUseSimulateContract({
  abi: vaultAbi,
  functionName: 'enableDepositFee',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"grantRole"`
 */
export const useSimulateVaultGrantRole = /*#__PURE__*/ createUseSimulateContract({
  abi: vaultAbi,
  functionName: 'grantRole',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"initialize"`
 */
export const useSimulateVaultInitialize = /*#__PURE__*/ createUseSimulateContract({
  abi: vaultAbi,
  functionName: 'initialize',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"rebalanceBurn"`
 */
export const useSimulateVaultRebalanceBurn = /*#__PURE__*/ createUseSimulateContract({
  abi: vaultAbi,
  functionName: 'rebalanceBurn',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"rebalanceMint"`
 */
export const useSimulateVaultRebalanceMint = /*#__PURE__*/ createUseSimulateContract({
  abi: vaultAbi,
  functionName: 'rebalanceMint',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulateVaultRenounceOwnership = /*#__PURE__*/ createUseSimulateContract({
  abi: vaultAbi,
  functionName: 'renounceOwnership',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"renounceRole"`
 */
export const useSimulateVaultRenounceRole = /*#__PURE__*/ createUseSimulateContract({
  abi: vaultAbi,
  functionName: 'renounceRole',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"revokeRole"`
 */
export const useSimulateVaultRevokeRole = /*#__PURE__*/ createUseSimulateContract({
  abi: vaultAbi,
  functionName: 'revokeRole',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"setAllowedBroker"`
 */
export const useSimulateVaultSetAllowedBroker = /*#__PURE__*/ createUseSimulateContract({
  abi: vaultAbi,
  functionName: 'setAllowedBroker',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"setAllowedToken"`
 */
export const useSimulateVaultSetAllowedToken = /*#__PURE__*/ createUseSimulateContract({
  abi: vaultAbi,
  functionName: 'setAllowedToken',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"setBrokerFromLedger"`
 */
export const useSimulateVaultSetBrokerFromLedger = /*#__PURE__*/ createUseSimulateContract({
  abi: vaultAbi,
  functionName: 'setBrokerFromLedger',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"setCCTPConfig"`
 */
export const useSimulateVaultSetCctpConfig = /*#__PURE__*/ createUseSimulateContract({
  abi: vaultAbi,
  functionName: 'setCCTPConfig',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"setCrossChainManager"`
 */
export const useSimulateVaultSetCrossChainManager = /*#__PURE__*/ createUseSimulateContract({
  abi: vaultAbi,
  functionName: 'setCrossChainManager',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"setDepositLimit"`
 */
export const useSimulateVaultSetDepositLimit = /*#__PURE__*/ createUseSimulateContract({
  abi: vaultAbi,
  functionName: 'setDepositLimit',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"setNativeTokenDepositLimit"`
 */
export const useSimulateVaultSetNativeTokenDepositLimit = /*#__PURE__*/ createUseSimulateContract({
  abi: vaultAbi,
  functionName: 'setNativeTokenDepositLimit',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"setNativeTokenHash"`
 */
export const useSimulateVaultSetNativeTokenHash = /*#__PURE__*/ createUseSimulateContract({
  abi: vaultAbi,
  functionName: 'setNativeTokenHash',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"setProtocolVaultAddress"`
 */
export const useSimulateVaultSetProtocolVaultAddress = /*#__PURE__*/ createUseSimulateContract({
  abi: vaultAbi,
  functionName: 'setProtocolVaultAddress',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"setRebalanceEnableToken"`
 */
export const useSimulateVaultSetRebalanceEnableToken = /*#__PURE__*/ createUseSimulateContract({
  abi: vaultAbi,
  functionName: 'setRebalanceEnableToken',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"setRebalanceMessengerContract"`
 */
export const useSimulateVaultSetRebalanceMessengerContract = /*#__PURE__*/ createUseSimulateContract({
  abi: vaultAbi,
  functionName: 'setRebalanceMessengerContract',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"setSwapOperator"`
 */
export const useSimulateVaultSetSwapOperator = /*#__PURE__*/ createUseSimulateContract({
  abi: vaultAbi,
  functionName: 'setSwapOperator',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"setSwapSigner"`
 */
export const useSimulateVaultSetSwapSigner = /*#__PURE__*/ createUseSimulateContract({
  abi: vaultAbi,
  functionName: 'setSwapSigner',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"setTokenMessengerContract"`
 */
export const useSimulateVaultSetTokenMessengerContract = /*#__PURE__*/ createUseSimulateContract({
  abi: vaultAbi,
  functionName: 'setTokenMessengerContract',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"setVaultAdapter"`
 */
export const useSimulateVaultSetVaultAdapter = /*#__PURE__*/ createUseSimulateContract({
  abi: vaultAbi,
  functionName: 'setVaultAdapter',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateVaultTransferOwnership = /*#__PURE__*/ createUseSimulateContract({
  abi: vaultAbi,
  functionName: 'transferOwnership',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"withdraw"`
 */
export const useSimulateVaultWithdraw = /*#__PURE__*/ createUseSimulateContract({
  abi: vaultAbi,
  functionName: 'withdraw',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"withdraw2Contract"`
 */
export const useSimulateVaultWithdraw2Contract = /*#__PURE__*/ createUseSimulateContract({
  abi: vaultAbi,
  functionName: 'withdraw2Contract',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link vaultAbi}__
 */
export const useWatchVaultEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: vaultAbi,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link vaultAbi}__ and `eventName` set to `"AccountDelegate"`
 */
export const useWatchVaultAccountDelegateEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: vaultAbi,
  eventName: 'AccountDelegate',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link vaultAbi}__ and `eventName` set to `"AccountDeposit"`
 */
export const useWatchVaultAccountDepositEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: vaultAbi,
  eventName: 'AccountDeposit',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link vaultAbi}__ and `eventName` set to `"AccountDepositTo"`
 */
export const useWatchVaultAccountDepositToEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: vaultAbi,
  eventName: 'AccountDepositTo',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link vaultAbi}__ and `eventName` set to `"AccountWithdraw"`
 */
export const useWatchVaultAccountWithdrawEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: vaultAbi,
  eventName: 'AccountWithdraw',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link vaultAbi}__ and `eventName` set to `"ChangeCrossChainManager"`
 */
export const useWatchVaultChangeCrossChainManagerEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: vaultAbi,
  eventName: 'ChangeCrossChainManager',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link vaultAbi}__ and `eventName` set to `"ChangeDepositLimit"`
 */
export const useWatchVaultChangeDepositLimitEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: vaultAbi,
  eventName: 'ChangeDepositLimit',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link vaultAbi}__ and `eventName` set to `"ChangeTokenAddressAndAllow"`
 */
export const useWatchVaultChangeTokenAddressAndAllowEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: vaultAbi,
  eventName: 'ChangeTokenAddressAndAllow',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link vaultAbi}__ and `eventName` set to `"DelegateSwapExecuted"`
 */
export const useWatchVaultDelegateSwapExecutedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: vaultAbi,
  eventName: 'DelegateSwapExecuted',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link vaultAbi}__ and `eventName` set to `"Initialized"`
 */
export const useWatchVaultInitializedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: vaultAbi,
  eventName: 'Initialized',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link vaultAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchVaultOwnershipTransferredEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: vaultAbi,
  eventName: 'OwnershipTransferred',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link vaultAbi}__ and `eventName` set to `"Paused"`
 */
export const useWatchVaultPausedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: vaultAbi,
  eventName: 'Paused',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link vaultAbi}__ and `eventName` set to `"RoleAdminChanged"`
 */
export const useWatchVaultRoleAdminChangedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: vaultAbi,
  eventName: 'RoleAdminChanged',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link vaultAbi}__ and `eventName` set to `"RoleGranted"`
 */
export const useWatchVaultRoleGrantedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: vaultAbi,
  eventName: 'RoleGranted',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link vaultAbi}__ and `eventName` set to `"RoleRevoked"`
 */
export const useWatchVaultRoleRevokedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: vaultAbi,
  eventName: 'RoleRevoked',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link vaultAbi}__ and `eventName` set to `"SetAllowedBroker"`
 */
export const useWatchVaultSetAllowedBrokerEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: vaultAbi,
  eventName: 'SetAllowedBroker',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link vaultAbi}__ and `eventName` set to `"SetAllowedToken"`
 */
export const useWatchVaultSetAllowedTokenEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: vaultAbi,
  eventName: 'SetAllowedToken',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link vaultAbi}__ and `eventName` set to `"SetBrokerFromLedgerAlreadySet"`
 */
export const useWatchVaultSetBrokerFromLedgerAlreadySetEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: vaultAbi,
  eventName: 'SetBrokerFromLedgerAlreadySet',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link vaultAbi}__ and `eventName` set to `"SetBrokerFromLedgerSuccess"`
 */
export const useWatchVaultSetBrokerFromLedgerSuccessEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: vaultAbi,
  eventName: 'SetBrokerFromLedgerSuccess',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link vaultAbi}__ and `eventName` set to `"SetCeffuAddress"`
 */
export const useWatchVaultSetCeffuAddressEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: vaultAbi,
  eventName: 'SetCeffuAddress',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link vaultAbi}__ and `eventName` set to `"SetProtocolVaultAddress"`
 */
export const useWatchVaultSetProtocolVaultAddressEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: vaultAbi,
  eventName: 'SetProtocolVaultAddress',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link vaultAbi}__ and `eventName` set to `"SetRebalanceEnableToken"`
 */
export const useWatchVaultSetRebalanceEnableTokenEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: vaultAbi,
  eventName: 'SetRebalanceEnableToken',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link vaultAbi}__ and `eventName` set to `"Unpaused"`
 */
export const useWatchVaultUnpausedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: vaultAbi,
  eventName: 'Unpaused',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link vaultAbi}__ and `eventName` set to `"VaultAdapterSet"`
 */
export const useWatchVaultVaultAdapterSetEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: vaultAbi,
  eventName: 'VaultAdapterSet',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link vaultAbi}__ and `eventName` set to `"WithdrawFailed"`
 */
export const useWatchVaultWithdrawFailedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: vaultAbi,
  eventName: 'WithdrawFailed',
})
