import * as deployer from '@eztool/import-map-deployer';
import * as functions from 'firebase-functions';

export const microFrontend = functions.https.onRequest(deployer.app);
