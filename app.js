document.addEventListener('DOMContentLoaded', function () {
    // Add event listener to the Refresh button
    document.getElementById('refreshBtn').addEventListener('click', refreshData);

    // Fetch data and render the table initially
    refreshData();
});

// Function to fetch data from CoinGecko API (no proxy for testing)
async function fetchCryptoData() {
    const url = 'https://api.coingecko.com/api/v3/coins/markets';
    const params = new URLSearchParams({
        vs_currency: 'usd',
        order: 'volume_desc', // Sorting by highest volume
        per_page: 250,  // Increased number of results for better selection
        page: 1,
        sparkline: false
    });

    try {
        const response = await fetch(`${url}?${params.toString()}`);
        const data = await response.json();

        // Log the raw response data for debugging
        console.log("Raw data from API:", data);

        // Filter for coins under $0.50 and significant 24h volume
        const filteredData = data.filter(coin => 
            coin.current_price < 0.50 && 
            coin.total_volume > 5000000 && 
            coin.price_change_percentage_24h >= 5 && 
            coin.price_change_percentage_24h <= 25 // Remove coins with very small or extremely high price changes
        );

        // Additional filters for technical indicators (RSI, MACD)
        const filteredAndCalculated = filteredData.map(coin => {
            return {
                ...coin,
                indicator: calculateRSI(coin),
                macdSignal: calculateMACD(coin)
            };
        });

        // Sort by price change and RSI (filtering by momentum)
        filteredAndCalculated.sort((a, b) => {
            return b.price_change_percentage_24h - a.price_change_percentage_24h;
        });

        // Return top 25 coins
        return filteredAndCalculated.slice(0, 25);
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

// Function to calculate RSI (Relative Strength Index) based on price changes (simple example)
function calculateRSI(coin) {
    // Let's assume RSI calculation happens outside of the immediate price data (or from another API)
    // Placeholder RSI value (this would be based on recent price movements)
    const RSI = coin.price_change_percentage_24h > 10 ? 70 : 30; // Simplified RSI calculation: placeholder value
    return RSI;
}

// Function to calculate MACD (Moving Average Convergence Divergence)
function calculateMACD(coin) {
    // Placeholder for MACD signal (ideally calculated over 12, 26 periods)
    const MACD = coin.price_change_percentage_24h > 10 ? 'Bullish' : 'Bearish'; // Simplified calculation
    return MACD;
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
        
        // Insert the data into each table cell
        row.innerHTML = `
            <td>${coin.name}</td>
            <td>$${coin.current_price.toFixed(2)}</td>
            <td>${coin.market_cap.toLocaleString()}</td>
            <td>${coin.price_change_percentage_24h.toFixed(2)}%</td>
            <td>${coin.total_volume.toLocaleString()}</td>
            <td>RSI: ${coin.indicator} | MACD: ${coin.macdSignal}</td> <!-- Add the indicators -->
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
