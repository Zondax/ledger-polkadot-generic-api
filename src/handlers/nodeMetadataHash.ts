import { Chain, getChains } from '../utils/chains'
import { renderChainNotFoundError, renderGetMetadataFirstError, renderInternalError } from '../utils/errors'
import { cacheMetadata } from '../utils/metadata'
import { getMetadataDigest } from '../../rust'
import { Request, Response } from 'express'
import { ChainConfig } from '../utils/types'

export const nodeMetadataHash = async (req: Request, res: Response) => {
  const chains = getChains()
  const { id: chainId = '' }: ChainConfig = req.body

  const chain = chains.find((b: Chain) => b.id.toLowerCase() === chainId.toLowerCase())
  if (!chain) {
    renderChainNotFoundError(res)
    return
  }

  let { props, metadataHex } = chain
  if (!props || !metadataHex) {
    try {
      await cacheMetadata(chain)
    } catch (e) {
      renderInternalError(res, e)
      return
    }
  }

  ;({ props, metadataHex } = chain)
  if (!props || !metadataHex) {
    renderGetMetadataFirstError(res)
    return
  }

  const metadataHash = getMetadataDigest({ metadata: metadataHex, props })

  res.status(200).json({ metadataHash })
}
