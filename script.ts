import https from 'https';

async function checkUrl(url: string) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      resolve({ url, status: res.statusCode });
    }).on('error', (e) => resolve({ url, error: e.message }));
  });
}

async function run() {
  const urls = [
    'https://raw.githubusercontent.com/howech/tarot-images/master/cards/ar00.jpg',
    'https://raw.githubusercontent.com/ekelen/tarot-api/main/static/cards/ar00.jpg',
    'https://sacred-texts.com/tarot/pkt/img/ar00.jpg',
    'https://upload.wikimedia.org/wikipedia/en/9/90/RWS_Tarot_00_Fool.jpg'
  ];
  for (const u of urls) {
    console.log(await checkUrl(u));
  }
}
run();
