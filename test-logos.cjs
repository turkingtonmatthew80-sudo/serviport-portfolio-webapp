const https = require('https');
const domains = [
  "marubeni.com", "mol.co.jp", "glovis.net", "torm.com", "maersk.com",
  "msc.com", "cma-cgm.com", "coscoshipping.com", "hapag-lloyd.com",
  "one-line.com", "evergreen-marine.com", "hmm21.com", "zim.com",
  "nyk.com", "kline.co.jp"
];

domains.forEach(domain => {
  https.get(`https://logo.clearbit.com/${domain}`, (res) => {
    console.log(`${domain}: ${res.statusCode} ${res.headers['content-type']}`);
  }).on('error', (e) => {
    console.error(e);
  });
});
