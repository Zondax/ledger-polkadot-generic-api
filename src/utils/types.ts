export interface ChainConfig {
  id: string
}

export interface TxToSign {
  txBlob: string
  chain: ChainConfig
}
