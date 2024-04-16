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
      txBlob:
        '05030377d0a8ce271cef83d243bed1677f0881f7641a8303e046e00491557935782b2a336137026055d82b344ac88debddce7fae210003395be7aa002b460f001900000091b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c366cc0778218e6c15ddfff2906f20037b85e38231efe087c883a2d40a550ccd6a',
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
