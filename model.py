import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error
import joblib

# Simulate loading crypto data (Replace with actual data)
# Example: price, RSI, MACD, volume, etc. Replace with your data source
data = pd.DataFrame({
    'price': [100, 200, 300, 400, 500],  # example price data
    'rsi': [60, 65, 58, 72, 55],
    'macd': [1.5, 2.3, 1.2, 3.4, 0.8],
    'volume': [1000000, 2000000, 1500000, 1800000, 2200000]
})

# Features and target variable
X = data[['rsi', 'macd', 'volume']]
y = data['price']

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train a model (RandomForestRegressor as an example)
model = RandomForestRegressor(n_estimators=100)
model.fit(X_train, y_train)

# Evaluate model
y_pred = model.predict(X_test)
print(f"Mean Absolute Error: {mean_absolute_error(y_test, y_pred)}")

# Save the trained model
joblib.dump(model, 'crypto_price_predictor.pkl')

# Additional helper functions for RSI and MACD (example logic)
def calculate_rsi(data):
    delta = data.diff()
    gain = delta.where(delta > 0, 0)
    loss = -delta.where(delta < 0, 0)
    avg_gain = gain.rolling(window=14).mean()
    avg_loss = loss.rolling(window=14).mean()
    rs = avg_gain / avg_loss
    return 100 - (100 / (1 + rs))

def calculate_macd(data):
    short_ema = data.ewm(span=12, adjust=False).mean()
    long_ema = data.ewm(span=26, adjust=False).mean()
    return short_ema - long_ema
