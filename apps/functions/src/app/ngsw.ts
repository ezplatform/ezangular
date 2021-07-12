import * as functions from 'firebase-functions';

export const ngsw = functions.https.onRequest((req, res) => {
  const content = {
    configVersion: 1,
    timestamp: 1625958690753,
    index: '/index.html',
    assetGroups: [
      {
        name: 'app',
        installMode: 'prefetch',
        updateMode: 'prefetch',
        cacheQueryOptions: {
          ignoreVary: true
        },
        urls: [],
        patterns: []
      },
      {
        name: 'assets',
        installMode: 'lazy',
        updateMode: 'prefetch',
        cacheQueryOptions: {
          ignoreVary: true
        },
        urls: [],
        patterns: []
      }
    ],
    dataGroups: [],
    hashTable: {}
  };

  functions.logger.log('Cache is invalidated!');

  // Caching for 5 minutes.
  res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
  res.setHeader('Content-Type', 'application/json');
  res.status(200).send(JSON.stringify(content));
});
