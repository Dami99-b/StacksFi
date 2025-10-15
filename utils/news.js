export async function fetchDeFiHeadlines() {
  const response = await fetch('https://cryptopanic.com/api/v1/posts/?auth_token=demo&currencies=BTC,STX');
  const data = await response.json();
  return data.results.slice(0, 5).map(item => ({
    title: item.title,
    link: item.url,
    source: item.source.title
  }));
}
