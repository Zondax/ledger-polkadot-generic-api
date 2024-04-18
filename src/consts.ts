import type { ChainProps } from './types'
import type { MetadataV15 } from '@polkadot/types/interfaces/metadata'

export type CHAIN = {
  id: string
  name: string
  url: string
  metadata?: MetadataV15
  metadataHex?: string
  props?: ChainProps
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
    id: 'dot',
    name: 'Polkadot',
    url: DOT_WSS,
  },
  {
    id: 'dot-hub',
    name: 'Polkadot Hub',
    url: DOTHUB_WSS,
  },
  {
    id: 'ksm',
    name: 'Kusama',
    url: KSM_WSS,
  },
  {
    id: 'ksm-hub',
    name: 'Kusama Hub',
    url: KSMHUB_WSS,
  },
  {
    id: 'nodl',
    name: 'Nodle',
    url: NODL_WSS,
  },
  {
    id: 'bnc',
    name: 'Bifrost',
    url: BNC_WSS,
  },
  {
    id: 'astr',
    name: 'Astar',
    url: ASTR_WSS,
  },
]
