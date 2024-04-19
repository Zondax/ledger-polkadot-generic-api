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
  const yamlFile = yaml.parse(file, {})

  return yamlFile as ChainsFile
}
