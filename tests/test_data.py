# KE Health Analytics

Predictive Healthcare Intelligence for Kenya's Healthcare System

## Overview

This project provides machine learning models and analytics tools for predicting disease outbreaks, patient health risks, and optimizing health resources in Kenya.

## Quick Start

```python
from src.data.loader import get_sample_health_data
from src.data.preprocessing import clean_data
from src.models.prediction import DiseasePredictor

# Load and preprocess data
data = get_sample_health_data()
cleaned = clean_data(data)

# Create and train predictor
predictor = DiseasePredictor(model_type="random_forest")
```

## Features

- Disease outbreak prediction
- Patient risk assessment
- Health resource optimization
- Interactive dashboards

## Author

Cavin Otieno - Healthcare Data Scientist