import { Chain, getChains } from '../utils/chains'
import { renderChainNotFoundError } from '../utils/errors'
import { Request, Response } from 'express'
import { ChainConfig } from '../utils/types'

export const nodeMetadataFlush = (req: Request, res: Response) => {
  const chains = getChains()
  const { id: chainId = '' }: ChainConfig = req.body

  const chain = chains.find((b: Chain) => b.id.toLowerCase() === chainId.toLowerCase())
  if (!chain) {
    renderChainNotFoundError(res)
    return
  }

  chain.metadata = undefined
  chain.metadataHex = undefined
  chain.props = undefined

  res.status(200).json()
}
