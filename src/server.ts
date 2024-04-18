import express from 'express'
import bodyParser from 'body-parser'
import http from 'http'

import { getApi } from './utils/getApi'
import { Option } from '@polkadot/types'
import { OpaqueMetadata } from '@polkadot/types/interfaces'
import { CHAIN, CHAINS } from './consts'
import { getShortMetadata } from '../rust'
import { getProperties } from './utils/getProperties'

interface ChainConfig {
  id: string
}

interface TxToSign {
  txBlob: string
  chain: ChainConfig
}

async function cacheMetadata(chain: CHAIN) {
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
  chain.props = props

  await api.disconnect()
}

export function createAndServe() {
  // Create a new express application instance
  const app: express.Application = express()

  // Middleware to parse JSON bodies
  app.use(bodyParser.json())

  app.get('/chains', (req, res) => {
    const chains = CHAINS.map(({ name, id, url }: CHAIN) => {
      return {
        name,
        id,
        url: url,
      }
    })

    res.status(200).json({ chains })
  })

  app.post('/node/metadata/flush', (req, res) => {
    const { id: chainId }: ChainConfig = req.body

    const chain = CHAINS.find((b: CHAIN) => b.id === chainId)
    if (!chain) {
      res.status(404).send('chain not found')
      return
    }

    chain.metadata = undefined
    chain.metadataHex = undefined
    chain.props = undefined
    res.status(200).json()
  })

  app.post('/node/metadata', async (req, res) => {
    const { id: chainId }: ChainConfig = req.body

    const chain = CHAINS.find((b: CHAIN) => b.id === chainId)
    if (!chain) {
      res.status(404).send('chain not found')
      return
    }

    if (chain.metadata) {
      res.status(200).json(chain.metadata)
      return
    }

    const error = await cacheMetadata(chain)
    if (error) {
      res.status(400).json(error.message)
      return
    }

    res.status(200).json(chain.metadata)
  })

  app.post('/transaction/metadata', async (req, res) => {
    const {
      chain: { id: chainId },
    }: TxToSign = req.body
    let { txBlob: blob }: TxToSign = req.body

    const chain = CHAINS.find((b: CHAIN) => b.id === chainId)
    if (!chain) {
      res.status(404).send('chain not found')
      return
    }

    let { props, metadataHex } = chain
    if (!props || !metadataHex) {
      const error = await cacheMetadata(chain)
      if (error) {
        res.status(400).json(error.message)
        return
      }
    }

    ;({ props, metadataHex } = chain)
    if (!props || !metadataHex) {
      res.status(400).send('please, cache metadata first with POST /node/metadata')
      return
    }

    try {
      if (blob.substring(0, 2) == '0x') {
        blob = blob.substring(2)
      }

      const txMetadata = Buffer.from(getShortMetadata({ blob, metadata: metadataHex, props }), 'hex')
      res.status(200).send({ txMetadata: '0x' + txMetadata.toString('hex') })
    } catch (e) {
      res.status(500).send(e)
    }
  })

  const httpServer = http.createServer(app)
  httpServer.listen(3001, () => {
    console.log('Server running on http://0.0.0.0:3001/')
  })

  return httpServer
}
