import https from 'https';
https.get('https://upload.wikimedia.org/wikipedia/commons/9/90/RWS_Tarot_00_Fool.jpg', {
  headers: { 'User-Agent': 'Mozilla/5.0' }
}, (res) => {
  console.log(res.statusCode, res.headers.location);
});
