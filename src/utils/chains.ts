import yaml from 'yaml'
import fs from 'fs'
import type { MetadataV15 } from '@polkadot/types/interfaces/metadata'

import type { ChainProps } from '../types'

export type Chain = {
  id: string
  name: string
  url: string
  metadata?: MetadataV15
  metadataHex?: string
  props?: ChainProps
}

export type ChainsFile = { chains: Chain[] }

export function loadChains(filePath: string) {
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
