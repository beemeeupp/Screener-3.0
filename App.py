from fastapi import FastAPI
import joblib
import numpy as np
from pydantic import BaseModel

# Load the trained model
model = joblib.load('crypto_price_predictor.pkl')

# FastAPI app setup
app = FastAPI()

class CryptoData(BaseModel):
    rsi: float
    macd: float
    volume: float

@app.post("/predict/")
async def predict(data: CryptoData):
    # Prepare features for prediction
    features = np.array([data.rsi, data.macd, data.volume]).reshape(1, -1)
    
    # Predict price from the model
    prediction = model.predict(features)[0]
    
    return {"predicted_price": prediction}
