"""Demo script to showcase KE Health Analytics capabilities.

Run this script to see the data science project in action.
Author: Cavin Otieno
"""

from src.data.loader import get_sample_health_data, get_sample_weather_data
from src.data.preprocessing import clean_data, split_data, encode_categorical
from src.features.engineering import create_disease_features, create_weather_features
from src.models.prediction import DiseasePredictor, RiskAssessmentModel, OutbreakForecaster
from src.models.evaluation import evaluate_model


def quick_demo():
    """
    Quick demonstration of the analytics pipeline.
    """
    print("\n" + "=" * 50)
    print("KE HEALTH ANALYTICS - QUICK DEMO")
    print("=" * 50)

    # Load data
    print("\n[1] Loading sample health data...")
    health_data = get_sample_health_data()
    weather_data = get_sample_weather_data()
    print(f"    Health records: {len(health_data)}")
    print(f"    Weather records: {len(weather_data)}")

    # Preprocess
    print("\n[2] Preprocessing...")
    cleaned = clean_data(health_data)
    featured = create_disease_features(cleaned)
    encoded = encode_categorical(featured, ["region", "disease_type"])
    print(f"    Clean records: {len(encoded)}")

    # Prepare for ML
    print("\n[3] Preparing ML features...")
    feature_cols = ["age", "cases", "temperature", "humidity", "age_risk_score", "disease_severity"]
    X = encoded[feature_cols]
    y = encoded["high_case_load"]
    print(f"    Features: {len(feature_cols)}")
    print(f"    Target distribution: Low={sum(y==0)}, High={sum(y==1)}")

    # Train model
    print("\n[4] Training DiseasePredictor...")
    X_train, X_test, y_train, y_test = split_data(encoded, "high_case_load")
    predictor = DiseasePredictor(model_type="random_forest")
    train_metrics = predictor.train(X_train, y_train, feature_names=feature_cols)
    print(f"    Training accuracy: {train_metrics['train_accuracy']:.4f}")

    # Evaluate
    print("\n[5] Evaluating...")
    y_pred = predictor.predict(X_test)
    metrics = evaluate_model(y_test.values, y_pred)
    print(f"    Test accuracy: {metrics['accuracy']:.4f}")

    # Feature importance
    print("\n[6] Top predictive features:")
    importance = predictor.get_feature_importance()
    for _, row in importance.head(4).iterrows():
        print(f"    - {row['feature']}: {row['importance']:.4f}")

    # Outbreak forecasting
    print("\n[7] Outbreak forecasting:")
    monthly = cleaned.groupby("month")["cases"].sum()
    forecaster = OutbreakForecaster(forecast_horizon=5)
    forecaster.fit(monthly)
    forecasts = forecaster.forecast()
    alerts = forecaster.get_alert_levels(forecasts)
    print(f"    5-day forecast: {forecasts.round(1).tolist()}")
    print(f"    Alerts: {alerts}")

    print("\n" + "=" * 50)
    print("DEMO COMPLETED SUCCESSFULLY")
    print("=" * 50)


if __name__ == "__main__":
    quick_demo()