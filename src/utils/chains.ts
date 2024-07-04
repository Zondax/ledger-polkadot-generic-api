import yaml from 'yaml'
import fs from 'fs'
import type { MetadataV15 } from '@polkadot/types/interfaces/metadata'

import type { ChainProps } from '../types'
import { cacheMetadata } from './metadata'

export type Chain = {
  id: string
  name: string
  url: string
  metadata?: MetadataV15
  metadataHex?: string
  props?: ChainProps
}

export type ChainsFile = { chains: Chain[] }

const reloadChainMetadataInterval = 60 * 60 * 1000
let reloadChainTimer: NodeJS.Timeout | undefined
let reloadChainsInProgress = false

let chainsFile: ChainsFile | undefined

export const getChains = (): Chain[] => {
  if (chainsFile) {
    return chainsFile.chains
  }

  const fileRead = loadChains('./chains.yaml')
  chainsFile = fileRead

  reloadChains()
  return chainsFile.chains
}

function reloadChains() {
  if (reloadChainTimer) {
    return
  }

  reloadChainTimer = setInterval(async () => {
    if (reloadChainsInProgress) {
      return
    }

    reloadChainsInProgress = true
    for (const chain of getChains()) {
      try {
        console.log('reloading chain metadata from chain: ', chain.id)
        await cacheMetadata(chain)
        console.log('chain metadata reloaded from chain: ', chain.id)
      } catch (e) {
        console.log('error reloading chain metadata from chain: ', chain.id)
      }
    }
    reloadChainsInProgress = false
  }, reloadChainMetadataInterval)
}

function loadChains(filePath: string) {
  const file = fs.readFileSync(filePath, 'utf8')
  const yamlFile = yaml.parse(file)

  if (!yamlFile['chains']) {
    throw new Error('invalid chains yaml, first field must be "chains"')
  }
  if (!(yamlFile['chains'] instanceof Array)) {
    throw new Error('invalid chains yaml, chains should be array')
  }
  if (
    !yamlFile['chains'].reduce((isValid, chain) => typeof chain == 'object' && !!chain.id && !!chain.name && !!chain.url && isValid, true)
  ) {
    throw new Error('invalid chains yaml, chain elements should have id, name and url')
  }

  return yamlFile as ChainsFile
}
