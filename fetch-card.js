fetch('https://repid-engine-production.up.railway.app/api/v1/agents/c2aab664-2c47-4418-bda5-e274098738d1/card')
  .then(res => res.json())
  .then(data => console.log(JSON.stringify(data, null, 2)))
  .catch(console.error);
