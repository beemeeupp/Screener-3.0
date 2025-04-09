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
        order: 'market_cap_desc',
        per_page: 10,  // Limit to 10 results for simplicity
        page: 1,
        sparkline: false
    });

    try {
        const response = await fetch(`${url}?${params.toString()}`);
        const data = await response.json();

        // Log the raw response data for debugging
        console.log("Raw data from API:", data);

        // Check if the response is valid and not empty
        if (data && Array.isArray(data) && data.length > 0) {
            return data;
        } else {
            console.log('No data or empty response received.');
            return [];
        }
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

        // Insert the data into each table cell
        row.innerHTML = `
            <td>${coin.name}</td>
            <td>$${coin.current_price.toFixed(2)}</td>
            <td>${coin.market_cap.toLocaleString()}</td>
            <td>${coin.price_change_percentage_24h.toFixed(2)}%</td>
            <td>${coin.total_volume.toLocaleString()}</td>
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
