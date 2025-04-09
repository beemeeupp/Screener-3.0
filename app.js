document.addEventListener('DOMContentLoaded', function () {
    // Add event listener to the

Certainly! Let's fix the issue and include the **CORS proxy** like we did previously. I'll simplify the code for now, ensuring it works by fetching data with the CORS proxy, and display the results before applying more complex filters.

### **Updated `app.js` (with CORS Proxy)**

```javascript
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
        per_page: 50, // Increase the number of coins fetched to ensure better results
        page: 1,
        sparkline: false
    });

    try {
        console.log("Fetching data...");
        const response = await fetch(`${url}?${params.toString()}`);
        const data = await response.json();
        console.log("Raw data fetched:", data);  // Log the raw response data

        // Check if the data is fetched correctly
        if (data.length === 0) {
            console.log('No data returned from the API.');
        } else {
            console.log('Data fetched successfully!');
        }

        // Filter the data for coins with price under $0.50 and market cap under $100M
        const filteredCoins = data.filter(coin => 
            coin.current_price < 0.50 &&                             // Price under $0.50
            coin.market_cap < 100000000                              // Market cap under $100M
        );

        console.log("Filtered data:", filteredCoins);  // Log filtered data
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

        // Placeholder for RSI and MACD (real calculations need historical data)
        const rsi = Math.random() * 100;  // Placeholder for RSI
        const macd = (Math.random() > 0.5) ? 'Bullish' : 'Bearish'; // Placeholder for MACD

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
