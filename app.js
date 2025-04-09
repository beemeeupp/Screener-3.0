document.getElementById('refreshBtn').addEventListener('click', refreshData);

function fetchCryptoData() {
    return fetch('https://api.coingecko.com/api/v3/coins/markets', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        params: { vs_currency: 'usd', order: 'market_cap_desc', per_page: 25, page: 1, sparkline: false }
    })
    .then(response => response.json())
    .then(data => {
        return data.filter(coin => coin.current_price < 0.001 && coin.market_cap < 10000000);
    });
}

function renderTable(coins) {
    const tableBody = document.querySelector('#cryptoTable tbody');
    tableBody.innerHTML = ''; // Clear previous rows

    coins.forEach(coin => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${coin.name}</td>
            <td>$${coin.current_price}</td>
            <td>${coin.market_cap}</td>
            <td>${Math.random() * 100}%</td>
            <td>${Math.random() * 100}%</td>
            <td>RSI: ${Math.random() * 100}, MACD: ${Math.random() > 0.5 ? 'Bullish' : 'Bearish'}</td>
        `;
        tableBody.appendChild(row);
    });
}

function refreshData() {
    fetchCryptoData().then(coins => renderTable(coins));
}

refreshData(); // Load initial data when the page loads
