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

        // Temporary: relax filter criteria for debugging (show all coins under $0.50)
        const filteredData = data.filter(coin => 
            coin.current_price < 0.50 // Only coins under $0.50
        );

        // Log the filtered data for debugging
        console.log("Filtered Data:", filteredData);

        // Return the filtered data
        return filteredData.slice(0, 25); // Show top 25 coins
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
        row.innerHTML = `<td colspan="11">No data available</td>`; // Adjusted column span for new columns
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
            <td>RSI: N/A | MACD: N/A</td> <!-- Temporary placeholders for now -->
            <td>$${(coin.current_price * 1.05).toFixed(2)}</td> <!-- Projected 1 day -->
            <td>$${(coin.current_price * 1.10).toFixed(2)}</td> <!-- Projected 2 days -->
            <td>$${(coin.current_price * 1.25).toFixed(2)}</td> <!-- Projected 5 days -->
            <td>$${(coin.current_price * 1.50).toFixed(2)}</td> <!-- Projected 2 weeks -->
            <td>1-2 days</td> <!-- Temporary placeholder for hold time -->
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
