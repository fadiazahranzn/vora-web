import 'fake-indexeddb/auto'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'

if (!global.crypto.randomUUID) {
  Object.defineProperty(global.crypto, 'randomUUID', {
    value: () => 'test-uuid-' + Math.random(),
  })
}
import {
  addToQueue,
  getQueue,
  removeFromQueue,
  updateRetryCount,
  getQueueCount,
} from '@/lib/sync-db'

describe('Sync Queue (IndexedDB)', () => {
  // Clear the database before/after each test to ensure isolation
  const clearDB = async () => {
    const dbPromise = new Promise<void>((resolve, reject) => {
      const req = indexedDB.deleteDatabase('vora-sync-queue')
      req.onsuccess = () => resolve()
      req.onerror = () => reject(req.error)
      req.onblocked = () => resolve() // Attempt to proceed even if blocked (though in happy path it shouldn't be)
    })
    return dbPromise
  }

  beforeEach(async () => {
    await clearDB()
  })

  afterEach(async () => {
    await clearDB()
  })

  it('should add items to the queue', async () => {
    const request = {
      url: '/api/test',
      method: 'POST',
      body: JSON.stringify({ data: 'test' }),
      headers: { 'Content-Type': 'application/json' },
    }

    await addToQueue(request)
    const queue = await getQueue()

    expect(queue).toHaveLength(1)
    expect(queue[0]).toMatchObject({
      url: request.url,
      method: request.method,
      body: request.body,
      retryCount: 0,
    })
    expect(queue[0].id).toBeDefined()
    expect(queue[0].timestamp).toBeDefined()
  })

  it('should retrieve items in FIFO order', async () => {
    const req1 = {
      url: '/api/1',
      method: 'POST',
      body: null,
      headers: {},
    }
    const req2 = {
      url: '/api/2',
      method: 'POST',
      body: null,
      headers: {},
    }

    await addToQueue(req1)
    // Small delay to ensure timestamp difference if implementation relies on it (though Date.now() might be same, implementation uses it)
    // If execution is fast, timestamps might be identical. Let's see if we can mock Date.now() or relying on insertion order if timestamps are equal (implementation sorts by timestamp).
    // The implementation: results.sort((a, b) => a.timestamp - b.timestamp)
    // If timestamps are equal, order is undefined.
    // Let's force a delay or mock Date.now()

    await new Promise((r) => setTimeout(r, 10))
    await addToQueue(req2)

    const queue = await getQueue()
    expect(queue).toHaveLength(2)
    expect(queue[0].url).toBe('/api/1')
    expect(queue[1].url).toBe('/api/2')
  })

  it('should remove items from the queue', async () => {
    const request = {
      url: '/api/remove',
      method: 'DELETE',
      body: null,
      headers: {},
    }

    await addToQueue(request)
    let queue = await getQueue()
    expect(queue).toHaveLength(1)

    const id = queue[0].id
    await removeFromQueue(id)

    queue = await getQueue()
    expect(queue).toHaveLength(0)
  })

  it('should update retry count', async () => {
    const request = {
      url: '/api/retry',
      method: 'POST',
      body: null,
      headers: {},
    }

    await addToQueue(request)
    let queue = await getQueue()
    const id = queue[0].id
    expect(queue[0].retryCount).toBe(0)

    await updateRetryCount(id, 1)
    queue = await getQueue()
    expect(queue[0].retryCount).toBe(1)

    await updateRetryCount(id, 5)
    queue = await getQueue()
    expect(queue[0].retryCount).toBe(5)
  })

  it('should get correct queue count', async () => {
    expect(await getQueueCount()).toBe(0)

    await addToQueue({ url: '/1', method: 'GET', body: null, headers: {} })
    expect(await getQueueCount()).toBe(1)

    await addToQueue({ url: '/2', method: 'GET', body: null, headers: {} })
    expect(await getQueueCount()).toBe(2)
  })
})
