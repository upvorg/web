if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      await navigator.serviceWorker.register('./sw.js', { type: 'module' })

      console.log('[SW] ServiceWorker registered')

      await navigator.serviceWorker.ready

      if (navigator.serviceWorker.controller) {
        console.log('[SW] ServiceWorker ready')
      } else {
        console.error('[SW] ServiceWorker not available')
      }
    } catch (err) {
      console.error('[SW] ServiceWorker registration failed: ', err)
    }
  })
  window.addEventListener('focus', async () => {
    await navigator.serviceWorker.ready
  })
}
