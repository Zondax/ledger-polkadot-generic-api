import { Chain, getChains } from '../utils/chains'
import { renderChainNotFoundError, renderGetMetadataFirstError, renderInternalError } from '../utils/errors'
import { cacheMetadata } from '../utils/metadata'
import { Request, Response } from 'express'
import { ChainConfig } from '../utils/types'

export const nodeProps = async (req: Request, res: Response) => {
  const chains = getChains()

  const { id: chainId }: ChainConfig = req.body

  const chain = chains.find((b: Chain) => b.id === chainId)
  if (!chain) {
    renderChainNotFoundError(res)
    return
  }

  let { props } = chain
  if (!props) {
    try {
      await cacheMetadata(chain)
    } catch (e) {
      renderInternalError(res, e)
      return
    }
  }

  ;({ props } = chain)
  if (!props) {
    renderGetMetadataFirstError(res)
    return
  }

  res.status(200).json({ props: { ...props } })
}
