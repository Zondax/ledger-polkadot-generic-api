import { Chain, getChains } from '../utils/chains'
import { renderChainNotFoundError, renderInternalError } from '../utils/errors'
import { cacheMetadata } from '../utils/metadata'
import { Request, Response } from 'express'
import { ChainConfig } from '../utils/types'

export const nodeMetadata = async (req: Request, res: Response) => {
  const chains = getChains()
  const { id: chainId }: ChainConfig = req.body

  const chain = chains.find((b: Chain) => b.id === chainId)
  if (!chain) {
    renderChainNotFoundError(res)
    return
  }

  if (chain.metadata) {
    res.status(200).json({ metadata: chain.metadata })
    return
  }

  try {
    await cacheMetadata(chain)
  } catch (e) {
    renderInternalError(res, e)
    return
  }

  res.status(200).json({ metadata: chain.metadata })
}
