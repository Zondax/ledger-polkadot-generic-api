import { type ApiPromise } from '@polkadot/api'
import { type ChainProps } from '../types'

export async function getProperties(api: ApiPromise): Promise<ChainProps> {
  const props = await api.rpc.system.properties()
  const base58Prefix = props.ss58Format.unwrapOr(null)?.toNumber() ?? 42
  const decimals = props.tokenDecimals.unwrapOr(null)?.[0].toNumber() ?? 12
  const tokenSymbol = props.tokenSymbol.unwrapOr(null)?.[0].toString() ?? '???'
  const specName = api.runtimeVersion.specName.toString()
  const specVersion = api.runtimeVersion.specVersion.toNumber()

  return { base58Prefix, decimals, tokenSymbol, specName, specVersion }
}
