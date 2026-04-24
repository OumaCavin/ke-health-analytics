# KE Health Analytics - Predictive Healthcare Intelligence

A modern data science project leveraging machine learning to predict disease outbreaks, patient health risks, and resource optimization for Kenya's healthcare system.

## Features

- Disease outbreak prediction using historical data and environmental factors
- Patient risk assessment for maternal health and chronic diseases
- Health resource optimization and demand forecasting
- Interactive visualization dashboards
- Regional health burden analysis

## Installation

```bash
pip install -r requirements.txt
```

## Quick Start

```python
from src.data.loader import load_health_data, get_sample_health_data
from src.data.preprocessing import clean_data
from src.models.prediction import DiseasePredictor

# Load sample data
data = get_sample_health_data()

# Preprocess
cleaned_data = clean_data(data)

# Train model
predictor = DiseasePredictor(model_type="random_forest")
```

## Project Structure

```
ke-health-analytics/
├── data/           # Data storage (raw, processed, sample)
├── notebooks/      # Jupyter notebooks for exploration
├── src/            # Source code
│   ├── data/       # Data processing modules
│   ├── features/   # Feature engineering
│   ├── models/     # ML prediction models
│   └── visualization/  # Dashboards and plots
├── models/         # Trained model storage
├── config/         # Configuration files
└── tests/          # Unit tests
```

## Available Scripts

```bash
# Run data preprocessing
python -m src.data.loader

# Train disease prediction model
python -m src.models.prediction

# Start visualization dashboard
python -m src.visualization.dashboard
```

## Requirements

- Python 3.10+
- See requirements.txt for full dependencies

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit with proper convention
4. Push and create Pull Request

## License

MIT License - See LICENSE file