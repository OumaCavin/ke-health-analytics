# KE Health Analytics - API Reference

## Data Module (`src/data/`)

### Loader Functions

#### `load_health_data(filepath: str, format: str = "csv") -> pd.DataFrame`
Load health records data from file.

**Parameters:**
- `filepath`: Path to the data file
- `format`: File format (csv, parquet, excel)

**Returns:** DataFrame containing health records

#### `load_weather_data(filepath: str) -> pd.DataFrame`
Load weather data for disease correlation analysis.

#### `get_sample_health_data() -> pd.DataFrame`
Generate sample health data for testing.

#### `get_sample_weather_data() -> pd.DataFrame`
Generate sample weather data for testing.

### Preprocessing Functions

#### `clean_data(df: pd.DataFrame) -> pd.DataFrame`
Clean health data by handling missing values and outliers.

#### `encode_categorical(df: pd.DataFrame, columns: list) -> pd.DataFrame`
Encode categorical variables using label encoding.

#### `split_data(df: pd.DataFrame, target_col: str, test_size: float = 0.2) -> Tuple`
Split data into train and test sets.

---

## Features Module (`src/features/`)

### Feature Engineering Functions

#### `create_disease_features(df: pd.DataFrame) -> pd.DataFrame`
Create engineered features for disease prediction.

Creates:
- Age groups (child, teen, adult, middle_age, senior)
- Age risk scores
- Disease severity encoding
- Regional risk indicators
- Seasonal features
- Interaction features

#### `create_weather_features(df: pd.DataFrame) -> pd.DataFrame`
Create features from weather data for disease correlation.

#### `create_lag_features(df: pd.DataFrame, column: str, lags: list) -> pd.DataFrame`
Create lagged features for time series prediction.

#### `create_epidemiological_features(df: pd.DataFrame) -> pd.DataFrame`
Create epidemiological features for disease spread modeling.

---

## Models Module (`src/models/`)

### DiseasePredictor

```python
class DiseasePredictor:
    def __init__(self, model_type: str = "random_forest")
    def train(self, X, y, feature_names) -> Dict
    def predict(self, X) -> np.ndarray
    def predict_proba(self, X) -> np.ndarray
    def get_feature_importance(self) -> pd.DataFrame
    def save(self, filepath: str)
    @classmethod
    def load(cls, filepath) -> DiseasePredictor
```

**Supported Model Types:**
- `random_forest`: Random Forest Classifier
- `gradient_boost`: Gradient Boosting Regressor
- `logistic`: Logistic Regression

### RiskAssessmentModel

```python
class RiskAssessmentModel:
    def train_maternal_health(self, X, y) -> Dict
    def train_chronic_disease(self, X, y) -> Dict
    def predict_risk(self, X, model_type) -> np.ndarray
    def get_patient_risk_report(self, patient_data) -> Dict
```

### OutbreakForecaster

```python
class OutbreakForecaster:
    def __init__(self, forecast_horizon: int = 7)
    def fit(self, time_series) -> Dict
    def forecast(self) -> np.ndarray
    def get_alert_levels(self, forecasts) -> List[str]
```

---

## Evaluation Module (`src/models/evaluation.py`)

### Functions

#### `evaluate_model(y_true, y_pred, task_type) -> Dict`
Evaluate model performance with comprehensive metrics.

#### `cross_validate_model(model, X, y, cv) -> Dict`
Perform cross-validation and return detailed results.

#### `generate_classification_report(y_true, y_pred, class_names) -> str`
Generate human-readable classification report.

#### `generate_regression_report(y_true, y_pred) -> str`
Generate human-readable regression report.

#### `generate_report(...) -> Dict`
Generate comprehensive evaluation report.

---

## Visualization Module (`src/visualization/`)

### Dashboard Functions

#### `create_disease_dashboard(health_data, weather_data, save_path) -> dict`
Create comprehensive disease analytics dashboard.

#### `plot_region_comparison(df, regions, metric, save_path) -> plt.Figure`
Create comparison plot for multiple regions.

#### `create_heatmap(df, value_col, index_col, columns_col, save_path) -> plt.Figure`
Create heatmap visualization for cross-tabulated data.

#### `plot_prediction_results(y_true, y_pred, title, save_path) -> plt.Figure`
Create prediction results visualization.

---

## Usage Examples

### Basic Disease Prediction

```python
from src.data.loader import get_sample_health_data
from src.data.preprocessing import clean_data, split_data, encode_categorical
from src.features.engineering import create_disease_features
from src.models.prediction import DiseasePredictor

# Load and prepare data
data = get_sample_health_data()
cleaned = clean_data(data)
featured = create_disease_features(cleaned)
encoded = encode_categorical(featured, ["region", "disease_type"])

# Prepare features and target
X = encoded[["age", "cases", "temperature", "humidity"]]
y = encoded["high_case_load"]

# Train model
predictor = DiseasePredictor(model_type="random_forest")
predictor.train(X, y)

# Make predictions
predictions = predictor.predict(X)
```

### Outbreak Forecasting

```python
from src.models.prediction import OutbreakForecaster

# Create forecaster
forecaster = OutbreakForecaster(forecast_horizon=7)

# Fit on historical data
forecaster.fit(monthly_cases_series)

# Generate forecasts
forecasts = forecaster.forecast()
alerts = forecaster.get_alert_levels(forecasts)
```

---

## Author

Cavin Otieno - Healthcare Data Scientist