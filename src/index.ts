import express from 'express'
import bodyParser from 'body-parser'

import { getApi } from './utils/getApi'
import { Option } from '@polkadot/types'
import { OpaqueMetadata } from '@polkadot/types/interfaces'
import { CHAIN, CHAINS } from './consts'
import { getShortMetadata } from '../rust'
import { getProperties } from './utils/getProperties'

// Create a new express application instance
const app: express.Application = express()

// Middleware to parse JSON bodies
app.use(bodyParser.json())

// Book interface
interface TxToSign {
  blob: string
  nodeApiUrl?: string
}

const metadata: CHAIN[] = []

// GET endpoint to retrieve all books
app.get('/:chain/metadata/flush', (req, res) => {
  const chain = CHAINS.find((b: CHAIN) => b.name === req.params.chain)
  if (!chain) {
    res.status(404).send('chain not found')
    return
  }

  chain.metadata = undefined
  chain.metadataHex = undefined
  chain.props = undefined
  res.status(200).json('ok')
})

app.get('/:chain/metadata', async (req, res) => {
  const chain = CHAINS.find((b: CHAIN) => b.name === req.params.chain)
  if (!chain) {
    res.status(404).send('chain not found')
    return
  }

  if (chain.metadata) {
    res.status(200).json(chain.metadata)
    return
  }

  const { apiWs } = chain
  const api = await getApi(apiWs)

  if (api.runtimeMetadata.version !== 14) {
    res.status(400).json('Only metadata V14 is supported')
    return
  }

  const metadataV15Hex = await api.call.metadata.metadataAtVersion<Option<OpaqueMetadata>>(15).then(m => {
    if (!m.isNone) return m.unwrap().toHex().slice(2)
  })

  if (!metadataV15Hex) {
    res.status(400).json('Only metadata V15 is supported')
    return
  }

  const props = await getProperties(api)

  chain.metadata = api.runtimeMetadata.asV15
  chain.metadataHex = metadataV15Hex
  chain.props = props

  res.status(200).json(chain.metadata)
})

// POST endpoint to add a new book
app.post('/:chain/transaction/metadata', (req, res) => {
  const chain = CHAINS.find((b: CHAIN) => b.name === req.params.chain)
  if (!chain) {
    res.status(404).send('chain not found')
    return
  }

  const { props, metadataHex } = chain
  if (!props || !metadataHex) {
    res.status(400).send('please, cache metadata first with GET /:chain/metadata')
    return
  }

  try {
    const txToSign: TxToSign = req.body
    const shortMetadata = Buffer.from(getShortMetadata({ blob: txToSign.blob, metadata: metadataHex, props }), 'hex')
    res.status(200).send({ shortMetadata: shortMetadata.toString('hex') })
  } catch (e) {
    res.status(500).send(e)
  }
})

// Set the server to listen on port 3000
app.listen(3001, () => {
  console.log('Server running on http://localhost:3001/')
})
