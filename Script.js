const API_URL = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=24h';

const tableGroups = {
  '20': document.getElementById("table-20").querySelector("tbody"),
  '15': document.getElementById("table-15").querySelector("tbody"),
  '10': document.getElementById("table-10").querySelector("tbody"),
  '5': document.getElementById("table-5").querySelector("tbody")
};

function getSignalFromRSI(rsi) {
  if (rsi < 30) return '<span class="buy">Buy</span>';
  if (rsi > 70) return '<span class="sell">Sell</span>';
  return '<span class="hold">Hold</span>';
}

// Estimate RSI based on 24h change % (very simplified model)
function estimateRSI(change) {
  let rsi = 50 + change * 1.5;
  return Math.max(0, Math.min(100, rsi.toFixed(2)));
}

// Estimate MACD based on price volatility
function estimateMACD(sparkline) {
  if (!sparkline || !sparkline.length) return 'N/A';
  const shortEMA = sparkline.slice(-5).reduce((a, b) => a + b, 0) / 5;
  const longEMA = sparkline.slice(-10).reduce((a, b) => a + b, 0) / 10;
  return (shortEMA - longEMA).toFixed(4);
}

function clearTables() {
  Object.values(tableGroups).forEach(tbody => tbody.innerHTML = '');
}

async function loadData() {
  clearTables();
  try {
    const res = await fetch(API_URL);
    const coins = await res.json();

    // Sort by performance
    coins.sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);

    coins.forEach(coin => {
      const change = coin.price_change_percentage_24h;
      if (change < 5) return;

      const row = document.createElement("tr");
      const rsi = estimateRSI(change);
      const macd = estimateMACD(coin.sparkline_in_7d?.price);
      const signal = getSignalFromRSI(rsi);

      row.innerHTML = `
        <td>${coin.name} (${coin.symbol.toUpperCase()})</td>
        <td>$${coin.current_price.toFixed(4)}</td>
        <td>$${coin.market_cap.toLocaleString()}</td>
        <td>${change.toFixed(2)}%</td>
        <td>${rsi}</td>
        <td>${macd}</td>
        <td>${signal}</td>
        <td>4h</td>
      `;

      if (change >= 20) tableGroups['20'].appendChild(row);
      else if (change >= 15) tableGroups['15'].appendChild(row);
      else if (change >= 10) tableGroups['10'].appendChild(row);
      else if (change >= 5) tableGroups['5'].appendChild(row);
    });
  } catch (error) {
    console.error("Error loading data:", error);
  }
}

loadData();
setInterval(loadData, 30000);
