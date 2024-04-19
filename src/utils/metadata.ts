import { getApi } from './getApi'
import { Option } from '@polkadot/types'
import { OpaqueMetadata } from '@polkadot/types/interfaces'
import { getProperties } from './getProperties'
import { Chain } from './chains'

export async function cacheMetadata(chain: Chain) {
  const { url } = chain
  const api = await getApi(url)

  if (api.runtimeMetadata.version !== 14) {
    return new Error('Only metadata V14 is supported')
  }

  const metadataV15Hex = await api.call.metadata.metadataAtVersion<Option<OpaqueMetadata>>(15).then(m => {
    if (!m.isNone) {
      return m.unwrap().toHex().slice(2)
    }
  })

  if (!metadataV15Hex) {
    return new Error('Only metadata V15 is supported')
  }

  const props = await getProperties(api)

  chain.metadata = api.runtimeMetadata.asV15
  chain.metadataHex = metadataV15Hex
  chain.signedExtensionsHex = ''
  chain.props = props

  await api.disconnect()
}
