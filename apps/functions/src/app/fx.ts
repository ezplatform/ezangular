import * as axios from 'axios';
import * as axiosCookieJarSupport from 'axios-cookiejar-support';
import * as csvToJson from 'csvtojson';
import * as express from 'express';
import * as functions from 'firebase-functions';
import * as sha256 from 'sha256';

import { CookieJar } from 'tough-cookie';

interface AuthAccount {
  username: string;
  password: string;
}

class Configs {
  public static BASE_URL = 'https://www.mql5.com';
  public static AUTH_URL = '';
  public static DEFAULT_HEADERS = {
    'user-agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.70',
    'X-Requested-With': 'XMLHttpRequest'
  };
}

class MQL5 {
  public getAuthCookieFn: () => string = () => {
    return 'auth=62DF3BC1309EEE64747FA39233E6A47BF6B561A7A17BA39F5DFB572170FC186ACC8F399021A6E72E7CD3D6B1D3CB791600E169A50B66F8AAD3964158FB5B058E4523589123677375C91CF9E4B26A2880AE3720197033434F8320E818B62A96D2BFDFDEF5';
  };
  public getAuthAccountFn: () => AuthAccount = () => ({ username: 'khanhbui.lab', password: '9nquKdhB' });
  public saveCookieFn: (cookie: string) => void;

  private jar = new CookieJar();
  private http: axios.AxiosInstance;
  private account: AuthAccount;
  constructor() {
    this.http = axios.default.create({ baseURL: Configs.BASE_URL, jar: this.jar, withCredentials: true });
    axiosCookieJarSupport.default(this.http);
    this.http.defaults.jar = this.jar;
  }

  public async ensureAuth(): Promise<void> {
    await this.jar.setCookie(this.getAuthCookieFn(), Configs.BASE_URL);
    const isLogged = await this.pingLoginPage();

    if (!isLogged) {
      this.getAuthAccountFn();
      const signature = await this.startLogin();
      await this.login(signature);
    }
  }
  public downloadTrading(): Promise<string> {
    return this.http
      .get('/en/signals/1007348/export/trading', {
        headers: Configs.DEFAULT_HEADERS
      })
      .then(resp => resp.data);
  }
  public downloadHistory(): Promise<string> {
    return this.http
      .get('/en/signals/1007348/export/history', {
        headers: Configs.DEFAULT_HEADERS
      })
      .then(resp => resp.data);
  }
  public createSignal(): void {
    // TODO
  }

  private crc32(input: string): number {
    const table =
      '00000000 77073096 EE0E612C 990951BA 076DC419 706AF48F E963A535 9E6495A3 0EDB8832 79DCB8A4 E0D5E91E 97D2D988 09B64C2B 7EB17CBD E7B82D07 90BF1D91 1DB71064 6AB020F2 F3B97148 84BE41DE 1ADAD47D 6DDDE4EB F4D4B551 83D385C7 136C9856 646BA8C0 FD62F97A 8A65C9EC 14015C4F 63066CD9 FA0F3D63 8D080DF5 3B6E20C8 4C69105E D56041E4 A2677172 3C03E4D1 4B04D447 D20D85FD A50AB56B 35B5A8FA 42B2986C DBBBC9D6 ACBCF940 32D86CE3 45DF5C75 DCD60DCF ABD13D59 26D930AC 51DE003A C8D75180 BFD06116 21B4F4B5 56B3C423 CFBA9599 B8BDA50F 2802B89E 5F058808 C60CD9B2 B10BE924 2F6F7C87 58684C11 C1611DAB B6662D3D 76DC4190 01DB7106 98D220BC EFD5102A 71B18589 06B6B51F 9FBFE4A5 E8B8D433 7807C9A2 0F00F934 9609A88E E10E9818 7F6A0DBB 086D3D2D 91646C97 E6635C01 6B6B51F4 1C6C6162 856530D8 F262004E 6C0695ED 1B01A57B 8208F4C1 F50FC457 65B0D9C6 12B7E950 8BBEB8EA FCB9887C 62DD1DDF 15DA2D49 8CD37CF3 FBD44C65 4DB26158 3AB551CE A3BC0074 D4BB30E2 4ADFA541 3DD895D7 A4D1C46D D3D6F4FB 4369E96A 346ED9FC AD678846 DA60B8D0 44042D73 33031DE5 AA0A4C5F DD0D7CC9 5005713C 270241AA BE0B1010 C90C2086 5768B525 206F85B3 B966D409 CE61E49F 5EDEF90E 29D9C998 B0D09822 C7D7A8B4 59B33D17 2EB40D81 B7BD5C3B C0BA6CAD EDB88320 9ABFB3B6 03B6E20C 74B1D29A EAD54739 9DD277AF 04DB2615 73DC1683 E3630B12 94643B84 0D6D6A3E 7A6A5AA8 E40ECF0B 9309FF9D 0A00AE27 7D079EB1 F00F9344 8708A3D2 1E01F268 6906C2FE F762575D 806567CB 196C3671 6E6B06E7 FED41B76 89D32BE0 10DA7A5A 67DD4ACC F9B9DF6F 8EBEEFF9 17B7BE43 60B08ED5 D6D6A3E8 A1D1937E 38D8C2C4 4FDFF252 D1BB67F1 A6BC5767 3FB506DD 48B2364B D80D2BDA AF0A1B4C 36034AF6 41047A60 DF60EFC3 A867DF55 316E8EEF 4669BE79 CB61B38C BC66831A 256FD2A0 5268E236 CC0C7795 BB0B4703 220216B9 5505262F C5BA3BBE B2BD0B28 2BB45A92 5CB36A04 C2D7FFA7 B5D0CF31 2CD99E8B 5BDEAE1D 9B64C2B0 EC63F226 756AA39C 026D930A 9C0906A9 EB0E363F 72076785 05005713 95BF4A82 E2B87A14 7BB12BAE 0CB61B38 92D28E9B E5D5BE0D 7CDCEFB7 0BDBDF21 86D3D2D4 F1D4E242 68DDB3F8 1FDA836E 81BE16CD F6B9265B 6FB077E1 18B74777 88085AE6 FF0F6A70 66063BCA 11010B5C 8F659EFF F862AE69 616BFFD3 166CCF45 A00AE278 D70DD2EE 4E048354 3903B3C2 A7672661 D06016F7 4969474D 3E6E77DB AED16A4A D9D65ADC 40DF0B66 37D83BF0 A9BCAE53 DEBB9EC5 47B2CF7F 30B5FFE9 BDBDF21C CABAC28A 53B39330 24B4A3A6 BAD03605 CDD70693 54DE5729 23D967BF B3667A2E C4614AB8 5D681B02 2A6F2B94 B40BBE37 C30C8EA1 5A05DF1B 2D02EF8D'
        .split(' ')
        .map(function (x) {
          return parseInt('0x' + x);
        });
    let x = 0;
    let y = 0;
    let crc = -1;
    for (let i = 0; i < input.length; i++) {
      y = (crc ^ input.charCodeAt(i)) & 0xff;
      x = table[y];
      crc = (crc >>> 8) ^ x;
    }

    return crc ^ -1;
  }
  private async pingLoginPage(): Promise<boolean> {
    return this.http
      .get('/en/auth_login', {
        headers: Configs.DEFAULT_HEADERS
      })
      .then(resp => {
        if (resp.config.url === Configs.BASE_URL + '/en/auth_login') {
          return false;
        }

        return true;
      });
  }
  private async startLogin(): Promise<string> {
    const form = new URLSearchParams();
    form.append('login', this.account.username);
    return this.http
      .post('/auth_login_start', form, {
        headers: {
          ...Configs.DEFAULT_HEADERS,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      .then(resp => {
        const a = resp.data.split('_');
        let d = a[0];
        const f = a[1];
        d = sha256(d + this.account.password);
        d = sha256(d + f);
        const uniq = this.jar.serializeSync().cookies.find(x => x.key == '_fz_uniq');
        const uuid = this.crc32(this.account.username + d + uniq.value + 'window.location.href');
        this.jar.setCookieSync('_media_uuid=' + uuid, Configs.BASE_URL + '/');

        return d;
      });
  }

  private async login(signature: string): Promise<void> {
    const form = new URLSearchParams();
    form.append('RedirectAfterLoginUrl', Configs.BASE_URL + '/en');
    form.append('RegistrationUrl', '');
    form.append('ShowOpenId', 'True');
    form.append('ViewType', '0');
    form.append('Login', this.account.username);
    form.append('Password', '');
    form.append('signature', signature);
    return this.http.post('/en/auth_login', form, {
      headers: {
        ...Configs.DEFAULT_HEADERS,
        referer: Configs.BASE_URL + '/en/auth_login',
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  }
}

const app = express();
app.get('/fx/', (req, res) => {
  res.send({ message: 'FX app is running!' });
});
app.get('/fx/history', async (req, res) => {
  const mql5 = new MQL5();
  await mql5.ensureAuth();
  const csv = await mql5.downloadHistory();
  const json = await csvToJson({ delimiter: ';' }).fromString(csv);
  // Caching for 5 minutes.
  res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
  res.setHeader('Content-Type', 'application/json');
  res.send(json);
});
app.get('/fx/trading', async (req, res) => {
  const mql5 = new MQL5();
  await mql5.ensureAuth();
  const csv = await mql5.downloadTrading();
  const json = await csvToJson({ delimiter: ';' }).fromString(csv);
  // Caching for 5 minutes.
  res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
  res.setHeader('Content-Type', 'application/json');
  res.send(json);
});

export const fx = functions.https.onRequest(app);
