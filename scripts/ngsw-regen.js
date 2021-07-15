const https = require('https');
const fs = require('fs');

async function request(url) {
  return new Promise(rs => {
    let json = '';
    https.get(url, res => {
      res.on('data', chunk => {
        json += chunk;
      });
      res.on('end', () => {
        rs(JSON.parse(json));
      });
    });
  });
}

(async () => {
  const remoteNgsw = await request('https://cdn.jsdelivr.net/npm/@ezfinhub-dev/import-map/ngsw.json');
  const path = 'dist/apps/portal/ngsw.json';
  const ngsw = require(`../${path}`);

  fs.copyFileSync(path, path + '.bk');
  ngsw.assetGroups.push(remoteNgsw.assetGroup);
  ngsw.hashTable = { ...ngsw.hashTable, ...remoteNgsw.hashTable };
  fs.writeFileSync(path, JSON.stringify(ngsw, null, 2));
})();
