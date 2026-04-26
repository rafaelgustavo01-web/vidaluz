import https from 'https';

const urls = [
  'https://raw.githubusercontent.com/ITMeita/tarot-images/main/cards/ar00.jpg',
  'https://raw.githubusercontent.com/howech/tarot-images/main/cards/ar00.jpg',
  'https://raw.githubusercontent.com/howech/tarot-images/master/cards/ar00.jpg',
  'https://raw.githubusercontent.com/itmeita/tarot-images/main/cards/ar00.jpg',
  'https://assets.tarot.com/images/cards/rider-waite/0-the-fool.jpg'
];

async function checkUrl(url: string) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      resolve({ url, status: res.statusCode });
    }).on('error', (e) => resolve({ url, error: e.message }));
  });
}

async function run() {
  for (const u of urls) {
    console.log(await checkUrl(u));
  }
}

run();
