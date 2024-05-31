import { Chain, getChains } from '../utils/chains'
import { Request, Response } from 'express'

export const chains = (req: Request, res: Response) => {
  const chains = getChains()
  const chainsFiltered = chains.map(({ name, id, url }: Chain) => {
    return {
      name,
      id,
      url: url,
    }
  })

  res.status(200).json({ chains: chainsFiltered })
}
