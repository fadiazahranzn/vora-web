export interface QueuedRequest {
    id: string
    url: string
    method: string
    body: string | null
    headers: Record<string, string>
    timestamp: number
    retryCount: number
}

const DB_NAME = 'vora-sync-queue'
const STORE_NAME = 'requests'
const DB_VERSION = 1

export async function openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION)

        request.onerror = () => reject(request.error)
        request.onsuccess = () => resolve(request.result)

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id' })
            }
        }
    })
}

export async function addToQueue(request: Omit<QueuedRequest, 'id' | 'timestamp' | 'retryCount'>) {
    const db = await openDB()
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)

    const entry: QueuedRequest = {
        ...request,
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        retryCount: 0,
    }

    return new Promise<void>((resolve, reject) => {
        const addRequest = store.add(entry)
        addRequest.onsuccess = () => resolve()
        addRequest.onerror = () => reject(addRequest.error)
    })
}

export async function getQueue(): Promise<QueuedRequest[]> {
    const db = await openDB()
    const tx = db.transaction(STORE_NAME, 'readonly')
    const store = tx.objectStore(STORE_NAME)

    return new Promise((resolve, reject) => {
        const getRequest = store.getAll()
        getRequest.onsuccess = () => {
            // Sort by timestamp for FIFO
            const results = getRequest.result as QueuedRequest[]
            results.sort((a, b) => a.timestamp - b.timestamp)
            resolve(results)
        }
        getRequest.onerror = () => reject(getRequest.error)
    })
}

export async function removeFromQueue(id: string) {
    const db = await openDB()
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)

    return new Promise<void>((resolve, reject) => {
        const deleteRequest = store.delete(id)
        deleteRequest.onsuccess = () => resolve()
        deleteRequest.onerror = () => reject(deleteRequest.error)
    })
}

export async function updateRetryCount(id: string, count: number) {
    const db = await openDB()
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)

    return new Promise<void>((resolve, reject) => {
        const getRequest = store.get(id)
        getRequest.onsuccess = () => {
            const data = getRequest.result as QueuedRequest
            data.retryCount = count
            store.put(data).onsuccess = () => resolve()
        }
        getRequest.onerror = () => reject(getRequest.error)
    })
}

export async function getQueueCount(): Promise<number> {
    const db = await openDB()
    const tx = db.transaction(STORE_NAME, 'readonly')
    const store = tx.objectStore(STORE_NAME)

    return new Promise((resolve, reject) => {
        const countRequest = store.count()
        countRequest.onsuccess = () => resolve(countRequest.result)
        countRequest.onerror = () => reject(countRequest.error)
    })
}
