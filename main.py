"""Main entry point for KE Health Analytics.

Demonstrates the predictive healthcare analytics prototype.
Author: Cavin Otieno
"""

import pandas as pd
import numpy as np
from src.data.loader import get_sample_health_data, get_sample_weather_data
from src.data.preprocessing import clean_data, encode_categorical, split_data
from src.features.engineering import create_disease_features, create_weather_features
from src.models.prediction import DiseasePredictor, OutbreakForecaster
from src.models.evaluation import evaluate_model, generate_report
from src.visualization.dashboard import create_disease_dashboard, plot_region_comparison


def run_disease_prediction_pipeline():
    """
    Run the disease prediction machine learning pipeline.

    Demonstrates:
    1. Data loading and preprocessing
    2. Feature engineering
    3. Model training and evaluation
    4. Results visualization
    """
    print("=" * 60)
    print("KE HEALTH ANALYTICS - DISEASE PREDICTION PIPELINE")
    print("=" * 60)

    # Step 1: Load sample health data
    print("\n[1] Loading health data...")
    health_data = get_sample_health_data()
    print(f"    Loaded {len(health_data)} health records")
    print(f"    Regions: {health_data['region'].unique().tolist()}")
    print(f"    Disease types: {health_data['disease_type'].unique().tolist()}")

    # Step 2: Load and merge weather data
    print("\n[2] Loading weather data...")
    weather_data = get_sample_weather_data()
    print(f"    Loaded {len(weather_data)} weather records")

    # Step 3: Clean and preprocess data
    print("\n[3] Preprocessing data...")
    cleaned_data = clean_data(health_data)
    print(f"    Cleaned records: {len(cleaned_data)}")

    # Step 4: Feature engineering
    print("\n[4] Engineering features...")
    featured_data = create_disease_features(cleaned_data)
    print(f"    Created age groups, risk scores, and disease severity features")

    # Step 5: Encode categorical variables
    print("\n[5] Encoding categorical variables...")
    categorical_cols = ["gender", "region", "disease_type"]
    encoded_data = encode_categorical(featured_data, categorical_cols)
    print(f"    Encoded columns: {categorical_cols}")

    # Step 6: Prepare features for ML
    print("\n[6] Preparing features for ML...")
    feature_cols = ["age", "cases", "temperature", "humidity", "age_risk_score", "disease_severity", "high_case_load", "is_rainy_season"]

    # Create binary target: high risk region + high case load = outbreak
    encoded_data["outbreak"] = ((encoded_data["high_risk_region"] == 1) & (encoded_data["high_case_load"] == 1)).astype(int)

    X = encoded_data[feature_cols]
    y = encoded_data["outbreak"]

    print(f"    Features: {feature_cols}")
    print(f"    Target distribution: {dict(y.value_counts())}")

    # Step 7: Split data
    print("\n[7] Splitting data...")
    X_train, X_test, y_train, y_test = split_data(encoded_data, "outbreak", test_size=0.2)
    print(f"    Training samples: {len(X_train)}")
    print(f"    Testing samples: {len(X_test)}")

    # Step 8: Train disease predictor
    print("\n[8] Training disease prediction model...")
    predictor = DiseasePredictor(model_type="random_forest")
    metrics = predictor.train(X_train, y_train, feature_names=feature_cols)
    print(f"    Model: {metrics['model_type']}")
    print(f"    Training accuracy: {metrics['train_accuracy']:.4f}")

    # Step 9: Evaluate model
    print("\n[9] Evaluating model...")
    y_pred = predictor.predict(X_test)
    eval_metrics = evaluate_model(y_test.values, y_pred, task_type="classification")
    print(f"    Test accuracy: {eval_metrics['accuracy']:.4f}")
    print(f"    Precision: {eval_metrics['precision']:.4f}")
    print(f"    Recall: {eval_metrics['recall']:.4f}")
    print(f"    F1 Score: {eval_metrics['f1_score']:.4f}")

    # Step 10: Get feature importance
    print("\n[10] Feature importance ranking...")
    importance_df = predictor.get_feature_importance()
    print("    Top features for disease prediction:")
    for idx, row in importance_df.head(5).iterrows():
        print(f"    - {row['feature']}: {row['importance']:.4f}")

    # Step 11: Run outbreak forecasting
    print("\n[11] Running outbreak forecasting...")
    monthly_cases = cleaned_data.groupby("month")["cases"].sum()
    forecaster = OutbreakForecaster(forecast_horizon=7)
    fit_metrics = forecaster.fit(monthly_cases)
    forecasts = forecaster.forecast()
    alerts = forecaster.get_alert_levels(forecasts)

    print(f"    Historical mean cases: {fit_metrics['mean']:.2f}")
    print(f"    7-day forecast: {forecasts.round(1).tolist()}")
    print(f"    Alert levels: {alerts}")

    print("\n" + "=" * 60)
    print("PIPELINE COMPLETED SUCCESSFULLY")
    print("=" * 60)

    return {
        "predictor": predictor,
        "forecaster": forecaster,
        "metrics": eval_metrics,
        "feature_importance": importance_df,
    }


def analyze_regional_outbreaks():
    """
    Analyze disease outbreaks by region.
    """
    print("\n" + "=" * 60)
    print("REGIONAL OUTBREAK ANALYSIS")
    print("=" * 60)

    health_data = get_sample_health_data()
    weather_data = get_sample_weather_data()

    # Create dashboard
    print("\nGenerating regional analysis dashboard...")
    figures = create_disease_dashboard(health_data, weather_data)
    print(f"    Generated {len(figures)} visualization figures")

    # Regional comparison
    print("\nComparing disease burden across regions...")
    regions = health_data["region"].unique().tolist()
    print(f"    Regions analyzed: {regions}")

    for region in regions:
        region_data = health_data[health_data["region"] == region]
        total_cases = region_data["cases"].sum()
        avg_cases = region_data["cases"].mean()
        print(f"    {region}: {total_cases} total cases (avg: {avg_cases:.1f} per record)")

    print("\n" + "=" * 60)
    print("REGIONAL ANALYSIS COMPLETED")
    print("=" * 60)


def demonstrate_model_usage():
    """
    Demonstrate how to use the models for predictions.
    """
    print("\n" + "=" * 60)
    print("MODEL USAGE DEMONSTRATION")
    print("=" * 60)

    # Load and prepare data
    health_data = get_sample_health_data()
    cleaned_data = clean_data(health_data)
    featured_data = create_disease_features(cleaned_data)
    encoded_data = encode_categorical(featured_data, ["region", "disease_type"])

    # Prepare features
    feature_cols = ["age", "cases", "temperature", "humidity", "age_risk_score", "disease_severity", "high_case_load", "is_rainy_season"]
    X = encoded_data[feature_cols]
    y = encoded_data["high_case_load"]

    # Train model
    predictor = DiseasePredictor(model_type="random_forest")
    predictor.train(X, y)

    # Example predictions
    print("\nExample predictions for new patient data:")
    example_patients = pd.DataFrame({
        "age": [25, 45, 7],
        "cases": [15, 80, 5],
        "temperature": [28.5, 32.0, 26.0],
        "humidity": [75, 45, 80],
        "age_risk_score": [0.5, 0.5, 1.0],
        "disease_severity": [2, 4, 1],
        "high_case_load": [0, 0, 0],
        "is_rainy_season": [1, 0, 1],
    })

    predictions = predictor.predict(example_patients[feature_cols])
    probas = predictor.predict_proba(example_patients[feature_cols])

    print("\n    Patient 1 (25 years, moderate case):")
    print(f"    - High case load prediction: {predictions[0]}")
    print(f"    - Probability: {probas[0].max():.4f}")

    print("\n    Patient 2 (45 years, severe symptoms):")
    print(f"    - High case load prediction: {predictions[1]}")
    print(f"    - Probability: {probas[1].max():.4f}")

    print("\n    Patient 3 (7 years, mild symptoms):")
    print(f"    - High case load prediction: {predictions[2]}")
    print(f"    - Probability: {probas[2].max():.4f}")

    print("\n" + "=" * 60)


def main():
    """
    Main entry point for the KE Health Analytics prototype.
    """
    print("\n" + "=" * 60)
    print("KE HEALTH ANALYTICS - PROTOTYPE DEMONSTRATION")
    print("=" * 60)
    print("\nModern Data Science Project for Kenya Healthcare")
    print("Author: Cavin Otieno")
    print("=" * 60)

    # Run the main prediction pipeline
    results = run_disease_prediction_pipeline()

    # Analyze regional outbreaks
    analyze_regional_outbreaks()

    # Demonstrate model usage
    demonstrate_model_usage()

    print("\n" + "=" * 60)
    print("PROTOTYPE DEMONSTRATION COMPLETED")
    print("=" * 60)
    print("\nTo use this project in your own code:")
    print("""
    from src.data.loader import get_sample_health_data
    from src.data.preprocessing import clean_data
    from src.models.prediction import DiseasePredictor

    # Load data
    data = get_sample_health_data()
    cleaned = clean_data(data)

    # Create predictor
    predictor = DiseasePredictor(model_type='random_forest')
    predictor.train(X_train, y_train)

    # Make predictions
    predictions = predictor.predict(X_test)
    """)


if __name__ == "__main__":
    main()