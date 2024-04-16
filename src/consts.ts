export type CHAIN = {
  name: string
  apiWs: string
  metadata?: any
  metadataHex?: any
  props?: any
}

const DOT_WSS = 'wss://rpc.polkadot.io'
const DOTHUB_WSS = 'wss://polkadot-asset-hub-rpc.polkadot.io'
const KSM_WSS = 'wss://kusama-rpc.polkadot.io'
const KSMHUB_WSS = 'wss://kusama-asset-hub-rpc.polkadot.io'
const ASTR_WSS = 'wss://astar.api.onfinality.io/public-ws'
const NODL_WSS = 'wss://nodle-parachain.api.onfinality.io/public-ws'
const BNC_WSS = 'wss://bifrost-polkadot.api.onfinality.io/public-ws'

export const CHAINS: CHAIN[] = [
  {
    name: 'dot',
    apiWs: DOT_WSS,
  },
  {
    name: 'dot-hub',
    apiWs: DOTHUB_WSS,
  },
  {
    name: 'ksm',
    apiWs: KSM_WSS,
  },
  {
    name: 'ksm-hub',
    apiWs: KSMHUB_WSS,
  },
  {
    name: 'nodl',
    apiWs: NODL_WSS,
  },
  {
    name: 'bnc',
    apiWs: BNC_WSS,
  },
  {
    name: 'astr',
    apiWs: ASTR_WSS,
  },
]
