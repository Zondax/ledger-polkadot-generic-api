import { createAndServe } from '../src/server'
import axios from 'axios'
import { describe } from 'node:test'
import express from 'express'
import http from 'http'

let app: http.Server | undefined
describe('basic api', () => {
  beforeAll(() => {
    app = createAndServe()
  })

  afterAll(() => {
    if (app) {
      app.close()
    }
  })

  test('get chains', async () => {
    const resp = await axios.get('http://127.0.0.1:3001/chains')

    expect(resp.status).toBe(200)
    expect(resp.data).not.toBe(undefined)
  })

  test('get chain metadata', async () => {
    const resp = await axios.post('http://127.0.0.1:3001/node/metadata', { id: 'dot' })

    expect(resp.status).toBe(200)
    expect(resp.data).not.toBe(undefined)
  })

  test('get tx metadata', async () => {
    const resp = await axios.post('http://127.0.0.1:3001/transaction/metadata', {
      callData: '0000d050f0c8c0a9706b7c0c4e439245a347627901c89d4791239533d1d2c961f1a72ad615c8530de078e565ba644b38b01bcad249e8c0',
      signedExtensions:
        'a80aceb4befe330990a59f74ed976c933db269c64dda40104a0f001900000091b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3a071db11cdbfd29285f25d402f1aee7a1c0384269c9c2edb476688d35e346998',
      chain: { id: 'dot' },
    })

    expect(resp.status).toBe(200)
    expect(resp.data).not.toBe(undefined)
  })

  test('flush chain metadata', async () => {
    const resp = await axios.post('http://127.0.0.1:3001/node/metadata/flush', { id: 'dot' })
    expect(resp.status).toBe(200)
  })
})
