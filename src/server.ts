import express from 'express'
import bodyParser from 'body-parser'
import http from 'http'

import { cacheMetadata } from './utils/metadata'
import { getShortMetadataFromTxBlob } from '../rust'
import { Chain, loadChains } from './utils/chains'

interface ChainConfig {
  id: string
}

interface TxToSign {
  txBlob: string
  chain: ChainConfig
}

export function createAndServe() {
  const { chains } = loadChains('./chains.yaml')

  // Create a new express application instance
  const app: express.Application = express()

  // Middleware to parse JSON bodies
  app.use(bodyParser.json())

  app.get('/chains', (req, res) => {
    const chainsFiltered = chains.map(({ name, id, url }: Chain) => {
      return {
        name,
        id,
        url: url,
      }
    })

    res.status(200).json({ chains: chainsFiltered })
  })

  app.post('/node/metadata/flush', (req, res) => {
    const { id: chainId }: ChainConfig = req.body

    const chain = chains.find((b: Chain) => b.id === chainId)
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

    const chain = chains.find((b: Chain) => b.id === chainId)
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
    let { txBlob }: TxToSign = req.body

    const chain = chains.find((b: Chain) => b.id === chainId)
    if (!chain) {
      res.status(404).send('chain not found')
      return
    }

    let { props, metadataHex } = chain
    if (!props || !metadataHex === undefined) {
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

    if (!txBlob) {
      res.status(400).send('txBlob is missing')
      return
    }

    try {
      if (txBlob.substring(0, 2) == '0x') {
        txBlob = txBlob.substring(2)
      }

      const txMetadata = Buffer.from(getShortMetadataFromTxBlob({ txBlob, metadata: metadataHex, props }), 'hex')
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
