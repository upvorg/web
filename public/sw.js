// import { handlePush, handleNotificationClick, handleClientMessage } from './push-notification'
import { respondWithCache } from './asset-cache'

// declare const self: ServiceWorkerGlobalScope
const ASSET_CACHE_PATTERN = /.+\.[0-9a-f]{8}\..+(js|css|woff2?|svg|png|jpg|jpeg|json|wasm)$/
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

// self.addEventListener('push', handlePush)
// self.addEventListener('notificationclick', handleNotificationClick)
// self.addEventListener('message', handleClientMessage)
