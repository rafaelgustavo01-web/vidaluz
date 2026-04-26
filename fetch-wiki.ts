import https from 'https';

const url = 'https://commons.wikimedia.org/w/api.php?action=query&generator=categorymembers&gcmtitle=Category:Rider-Waite-Smith_tarot_deck_(Geldard)&gcmlimit=max&prop=imageinfo&iiprop=url&format=json';

https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const json = JSON.parse(data);
    const pages = Object.values(json.query.pages) as any[];
    pages.forEach(p => console.log(p.title + ' | ' + p.imageinfo[0].url));
  });
});
