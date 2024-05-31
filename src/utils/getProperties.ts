import { type ApiPromise } from '@polkadot/api'
import { type ChainProps } from '../types'
import { ChainError } from './errors'

export async function getProperties(api: ApiPromise): Promise<ChainProps> {
  const props = await api.rpc.system.properties()
  const base58Prefix = props.ss58Format.unwrapOr(null)?.toNumber()
  const decimals = props.tokenDecimals.unwrapOr(null)?.[0].toNumber()
  const tokenSymbol = props.tokenSymbol.unwrapOr(null)?.[0].toString()
  const specName = api.runtimeVersion.specName.toString()
  const specVersion = api.runtimeVersion.specVersion.toNumber()

  if (!base58Prefix) {
    throw new ChainError('the base58 prefix was not found for this chain')
  }

  if (!decimals) {
    throw new ChainError('the chain decimals were not found for this chain')
  }

  if (!tokenSymbol) {
    throw new ChainError('the token symbol was not found for this chain')
  }

  return { base58Prefix, decimals, tokenSymbol, specName, specVersion }
}
