"""Unit tests for KE Health Analytics model modules."""

import pytest
import pandas as pd
import numpy as np
from src.models.prediction import (
    DiseasePredictor,
    RiskAssessmentModel,
    OutbreakForecaster,
)
from src.models.evaluation import (
    evaluate_model,
    generate_classification_report,
    generate_regression_report,
)


class TestDiseasePredictor:
    """Tests for DiseasePredictor class."""

    def test_initialization(self):
        """Test predictor initialization."""
        predictor = DiseasePredictor(model_type="random_forest")
        assert predictor.model_type == "random_forest"
        assert predictor.is_trained is False

    def test_train_model(self):
        """Test model training."""
        # Create sample data
        X = pd.DataFrame({
            "age": [25, 30, 35, 40, 45, 50],
            "cases": [10, 20, 30, 40, 50, 60],
            "temperature": [25, 26, 27, 28, 29, 30],
        })
        y = pd.Series([0, 0, 1, 1, 1, 1])

        predictor = DiseasePredictor(model_type="random_forest")
        metrics = predictor.train(X, y)

        assert "train_accuracy" in metrics
        assert predictor.is_trained is True

    def test_predict_before_train(self):
        """Test that prediction fails before training."""
        predictor = DiseasePredictor()
        X = pd.DataFrame({"feature": [1, 2, 3]})

        with pytest.raises(RuntimeError, match="must be trained"):
            predictor.predict(X)


class TestRiskAssessmentModel:
    """Tests for RiskAssessmentModel class."""

    def test_initialization(self):
        """Test model initialization."""
        model = RiskAssessmentModel()
        assert len(model.models) == 0
        assert len(model.scalers) == 0

    def test_get_patient_risk_report(self):
        """Test patient risk report generation."""
        model = RiskAssessmentModel()
        patient_data = {
            "patient_id": "P001",
            "age": 30,
        }
        report = model.get_patient_risk_report(patient_data)
        assert "patient_id" in report
        assert "recommendations" in report


class TestOutbreakForecaster:
    """Tests for OutbreakForecaster class."""

    def test_initialization(self):
        """Test forecaster initialization."""
        forecaster = OutbreakForecaster(forecast_horizon=7)
        assert forecaster.forecast_horizon == 7

    def test_fit_and_forecast(self):
        """Test forecasting workflow."""
        forecaster = OutbreakForecaster(forecast_horizon=5)
        time_series = pd.Series([10, 15, 12, 18, 20])

        metrics = forecaster.fit(time_series)
        assert "mean" in metrics
        assert "std" in metrics

        forecasts = forecaster.forecast()
        assert len(forecasts) == 5

    def test_get_alert_levels(self):
        """Test alert level generation."""
        forecaster = OutbreakForecaster(forecast_horizon=3)
        time_series = pd.Series([10, 10, 10, 10, 10])
        forecaster.fit(time_series)

        forecasts = np.array([10, 10, 50])
        alerts = forecaster.get_alert_levels(forecasts)
        assert len(alerts) == 3
        assert all(level in ["normal", "warning", "critical"] for level in alerts)


class TestEvaluation:
    """Tests for evaluation metrics."""

    def test_classification_metrics(self):
        """Test classification evaluation metrics."""
        y_true = np.array([0, 1, 1, 0, 1, 1])
        y_pred = np.array([0, 1, 0, 0, 1, 1])

        metrics = evaluate_model(y_true, y_pred, task_type="classification")

        assert "accuracy" in metrics
        assert "precision" in metrics
        assert "recall" in metrics
        assert "f1_score" in metrics
        assert 0 <= metrics["accuracy"] <= 1

    def test_regression_metrics(self):
        """Test regression evaluation metrics."""
        y_true = np.array([10, 20, 30, 40, 50])
        y_pred = np.array([12, 18, 32, 38, 52])

        metrics = evaluate_model(y_true, y_pred, task_type="regression")

        assert "mse" in metrics
        assert "rmse" in metrics
        assert "mae" in metrics
        assert "r2" in metrics

    def test_generate_classification_report(self):
        """Test classification report generation."""
        y_true = np.array([0, 1, 1, 0])
        y_pred = np.array([0, 1, 0, 0])

        report = generate_classification_report(y_true, y_pred)
        assert "Accuracy" in report
        assert "Precision" in report

    def test_generate_regression_report(self):
        """Test regression report generation."""
        y_true = np.array([10, 20, 30])
        y_pred = np.array([12, 18, 32])

        report = generate_regression_report(y_true, y_pred)
        assert "R-squared" in report
        assert "MSE" in report