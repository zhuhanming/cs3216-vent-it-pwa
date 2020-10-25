self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open('cache_name').then(function (cache) {
      return cache.addAll([
        '/',
        'https://res.cloudinary.com/dwbg1zcql/image/upload/v1569513124/logo_q9j2rj.svg',
        'https://res.cloudinary.com/dwbg1zcql/image/upload/v1569514446/eye_qbu5er.svg',
        'https://res.cloudinary.com/dwbg1zcql/image/upload/v1569514447/mascot2_b6x4tv.svg',
        'https://res.cloudinary.com/dwbg1zcql/image/upload/v1569568525/mascot_5_fd5oix.svg', 
        'https://res.cloudinary.com/dwbg1zcql/image/upload/v1569568525/mascot_3_rvqjh1.svg', 
        'https://res.cloudinary.com/dwbg1zcql/image/upload/v1569568526/mascot_4_df4fth.svg', 
        'https://res.cloudinary.com/dwbg1zcql/image/upload/v1569568527/mascot_2_uqednc.svg',
      ]);
    })
  );
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request)
      .then(function (response) {
        // Response for the request is found in cache, return the response
        if (response) {
          return response;
        }

        // Response is not found in cache, make a network request instead
        // You might need to polyfill `fetch` or replace with other forms of ajax calls
        return fetch(event.request);
      }
    )
  );
});