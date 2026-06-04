const fs = require('fs');
const https = require('https');
const path = require('path');

const urls = {
  marubeni: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Marubeni_Logo.svg/512px-Marubeni_Logo.svg.png',
  mol: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Mitsui_O.S.K._Lines_logo.svg/512px-Mitsui_O.S.K._Lines_logo.svg.png',
  glovis: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Hyundai_Glovis_logo.svg/512px-Hyundai_Glovis_logo.svg.png',
  torm: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Torm_logo.svg/512px-Torm_logo.svg.png',
  maersk: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Maersk_Group_Logo.svg/512px-Maersk_Group_Logo.svg.png',
  msc: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Mediterranean_Shipping_Company_logo.svg/512px-Mediterranean_Shipping_Company_logo.svg.png',
  cmacgm: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/CMA_CGM_logo.svg/512px-CMA_CGM_logo.svg.png',
  cosco: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/COSCO_Shipping_logo.svg/512px-COSCO_Shipping_logo.svg.png',
  hapaglloyd: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Hapag-Lloyd_logo.svg/512px-Hapag-Lloyd_logo.svg.png',
  one: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Ocean_Network_Express_logo.svg/512px-Ocean_Network_Express_logo.svg.png',
  evergreen: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Evergreen_Marine_logo.svg/512px-Evergreen_Marine_logo.svg.png',
  hmm: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/HMM_logo.svg/512px-HMM_logo.svg.png',
  zim: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/ZIM_logo.svg/512px-ZIM_logo.svg.png',
  nyk: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Nippon_Yusen_logo.svg/512px-Nippon_Yusen_logo.svg.png',
  kline: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/K_Line_logo.svg/512px-K_Line_logo.svg.png'
};

const dir = path.join(__dirname, 'public', 'logos');
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

function download(name, url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
        return;
      }
      const file = fs.createWriteStream(path.join(dir, `${name}.png`));
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(name);
      });
    }).on('error', (err) => {
      fs.unlink(path.join(dir, `${name}.png`), () => reject(err));
    });
  });
}

Promise.allSettled(Object.entries(urls).map(([name, url]) => download(name, url)))
  .then((results) => {
    results.forEach(r => console.log(r.status, r.value || r.reason));
  });
