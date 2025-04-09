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
        per_page: 250,  // Increased number of results
        page: 1,
        sparkline: false
    });

    try {
        const response = await fetch(`${url}?${params.toString()}`);
        const data = await response.json();

        // Log the raw response data for debugging
        console.log("Raw data from API:", data);

        // Filter for coins with a price under $0.50 and with sufficient volume
        const filteredData = data.filter(coin => coin.current_price < 0.50 && coin.total_volume > 1000000);
        
        // Sort by price change in the last 24 hours (for momentum)
        filteredData.sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);

        // Return top 25 coins
        return filteredData.slice(0, 25);
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

// Function to calculate a basic placeholder indicator (e.g., Buy/Sell/Neutral)
function calculateIndicator(priceChangePercentage) {
    console.log(`Price Change Percentage: ${priceChangePercentage}`); // Log to check the value

    if (priceChangePercentage > 5) {
        return "Buy";
    } else if (priceChangePercentage < -5) {
        return "Sell";
    } else {
        return "Neutral";
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

        // Log the individual coin data for debugging
        console.log(`Rendering coin: ${coin.name}`);
        
        // Insert the data into each table cell
        row.innerHTML = `
            <td>${coin.name}</td>
            <td>$${coin.current_price.toFixed(2)}</td>
            <td>${coin.market_cap.toLocaleString()}</td>
            <td>${coin.price_change_percentage_24h.toFixed(2)}%</td>
            <td>${coin.total_volume.toLocaleString()}</td>
            <td>${calculateIndicator(coin.price_change_percentage_24h)}</td> <!-- Add the indicator -->
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
