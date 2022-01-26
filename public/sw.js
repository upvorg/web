// declare const self: ServiceWorkerGlobalScope

const ASSET_CACHE_PATTERN = /.+\.[0-9a-f]{8}\.(js|css|woff2?|svg|png|jpg|jpeg|json|wasm)$/
const ACTIVATE_TIMEOUT = 3000

const pause = (ms) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(), ms)
  })

self.addEventListener('install', (e) => {
  console.log('ServiceWorker installed')

  // Activate worker immediately
  e.waitUntil(self.skipWaiting())
})

self.addEventListener('activate', (e) => {
  console.log('ServiceWorker activated')
  e.waitUntil(
    Promise.race([
      // An attempt to fix freezing UI on iOS
      pause(ACTIVATE_TIMEOUT),
      Promise.all([
        clearAssetCache(),
        // Become available to all pages
        self.clients.claim()
      ])
    ])
  )
})

self.addEventListener('fetch', (e /*: FetchEvent*/) => {
  const { url } = e.request

  if (url.startsWith('http') && url.match(ASSET_CACHE_PATTERN)) {
    e.respondWith(respondWithCache(e))
    return true
  }

  return false
})

const ASSET_CACHE_NAME = 'asset-cache'

// declare const self: ServiceWorkerGlobalScope

// An attempt to fix freezing UI on iOS
const CACHE_TIMEOUT = 3000

async function respondWithCache(e /*: FetchEvent*/) {
  const cacheResult = await withTimeout(async () => {
    const cache = await self.caches.open(ASSET_CACHE_NAME)
    const cached = await cache.match(e.request)

    return { cache, cached }
  }, CACHE_TIMEOUT)

  const { cache, cached } = cacheResult || {}

  if (cache && cached) {
    if (cached.ok) {
      return cached
    } else {
      await cache.delete(e.request)
    }
  }

  const remote = await fetch(e.request)

  if (remote.ok && cache) {
    cache.put(e.request, remote.clone())
  }

  return remote
}

async function withTimeout(cb /*: () => Promise<T>*/, timeout /*: number*/) {
  try {
    return await Promise.race([
      pause(timeout).then(() => Promise.reject(new Error('TIMEOUT'))),
      cb()
    ])
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err)
    return undefined
  }
}

function clearAssetCache() {
  return self.caches.delete(ASSET_CACHE_NAME)
}
