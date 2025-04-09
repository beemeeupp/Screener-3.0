document.addEventListener('DOMContentLoaded', function () {
    // Add event listener to the Refresh button
    document.getElementById('refreshBtn').addEventListener('click', refreshData);

    // Fetch data and render the table initially
    refreshData();
});

// Function to fetch data from CoinGecko API with CORS proxy
async function fetchCryptoData() {
    const url = 'https://cors-anywhere.herokuapp.com/https://api.coingecko.com/api/v3/coins/markets';
    const params = new URLSearchParams({
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 50, // Increase number of coins fetched to ensure better results
        page: 1,
        sparkline: false
    });

    try {
        console.log("Fetching data...");
        const response = await fetch(`${url}?${params.toString()}`);
        const data = await response.json();
        console.log("Raw data fetched:", data);  // Log the raw response data

        // Filter the data for low-cap coins with volume spikes, and good indicators
        const filteredCoins = data.filter(coin => 
            coin.current_price < 0.50 &&                             // Price under $0.50
            coin.market_cap < 100000000 &&                           // Market cap under $100M
            coin.total_volume > 5000000 &&                           // Volume above $5M to ensure liquidity
            (coin.price_change_percentage_24h > 10 || coin.price_change_percentage_24h < -10) // Price change in 24h greater than +/- 10%
        );

        // Return the filtered coins for further processing
        return filteredCoins;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

// Function to render the fetched data into the table
function renderTable(coins) {
    const tableBody = document.querySelector('#cryptoTable tbody');
    tableBody.innerHTML = ''; // Clear the table before rendering new data

    if (coins.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="6">No data available</td>`;
        tableBody.appendChild(row);
        return;
    }

    // Loop through coins and create a row for each
    coins.forEach(coin => {
        const row = document.createElement('tr');

        // Generate a simple RSI and MACD check (Note: these are placeholders, as real analysis would require actual calculations)
        const rsi = Math.random() * 100; // Placeholder for RSI (should implement a real calculation based on price history)
        const macd = (Math.random() > 0.5) ? 'Bullish' : 'Bearish'; // Placeholder for MACD signal (real calculation needed)

        // Insert the data into each table cell
        row.innerHTML = `
            <td>${coin.name}</td>
            <td>$${coin.current_price.toFixed(2)}</td>
            <td>${coin.market_cap.toLocaleString()}</td>
            <td>${coin.price_change_percentage_24h.toFixed(2)}%</td>
            <td>${coin.total_volume.toLocaleString()}</td>
            <td>RSI: ${rsi.toFixed(2)}, MACD: ${macd}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Function to refresh the data when the button is clicked
async function refreshData() {
    console.log("Refreshing data...");
    const coins = await fetchCryptoData();
    renderTable(coins);
}
