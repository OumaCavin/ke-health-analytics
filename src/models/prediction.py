"""Prediction models for disease outbreak forecasting.

Implements machine learning models for predicting disease outbreaks
based on historical health data and environmental factors.
Author: Cavin Otieno
"""

import pandas as pd
import numpy as np
from typing import Dict, List, Optional
from sklearn.ensemble import RandomForestClassifier, GradientBoostingRegressor
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
import pickle
import os


class DiseasePredictor:
    """
    Predicts disease outbreak risk based on health and environmental data.
    """

    def __init__(self, model_type: str = "random_forest"):
        """
        Initialize the disease predictor.

        Args:
            model_type: Type of model to use (random_forest, gradient_boost, logistic)
        """
        self.model_type = model_type
        self.model = None
        self.scaler = StandardScaler()
        self.feature_names = None
        self.is_trained = False

    def _get_model(self):
        """Get the appropriate model instance."""
        if self.model_type == "random_forest":
            return RandomForestClassifier(
                n_estimators=100,
                max_depth=10,
                min_samples_split=5,
                random_state=42,
                n_jobs=-1,
            )
        elif self.model_type == "gradient_boost":
            return GradientBoostingRegressor(
                n_estimators=100,
                max_depth=5,
                learning_rate=0.1,
                random_state=42,
            )
        elif self.model_type == "logistic":
            return LogisticRegression(max_iter=1000, random_state=42)
        else:
            raise ValueError(f"Unknown model type: {self.model_type}")

    def train(
        self,
        X: pd.DataFrame,
        y: pd.Series,
        feature_names: Optional[List[str]] = None,
    ) -> Dict:
        """
        Train the prediction model.

        Args:
            X: Training features
            y: Training labels
            feature_names: Optional list of feature names

        Returns:
            Dictionary with training metrics
        """
        self.feature_names = feature_names or list(X.columns)

        # Scale features
        X_scaled = self.scaler.fit_transform(X)

        # Get and train model
        self.model = self._get_model()
        self.model.fit(X_scaled, y)

        self.is_trained = True

        # Calculate training score
        train_score = self.model.score(X_scaled, y)

        return {
            "model_type": self.model_type,
            "train_accuracy": train_score,
            "n_features": len(self.feature_names),
            "n_samples": len(y),
        }

    def predict(self, X: pd.DataFrame) -> np.ndarray:
        """
        Make predictions on new data.

        Args:
            X: Features to predict on

        Returns:
            Array of predictions
        """
        if not self.is_trained:
            raise RuntimeError("Model must be trained before making predictions")

        X_scaled = self.scaler.transform(X)
        return self.model.predict(X_scaled)

    def predict_proba(self, X: pd.DataFrame) -> np.ndarray:
        """
        Get prediction probabilities for classification models.

        Args:
            X: Features to predict on

        Returns:
            Array of prediction probabilities
        """
        if not self.is_trained:
            raise RuntimeError("Model must be trained before predictions")

        if not hasattr(self.model, "predict_proba"):
            raise ValueError("Model does not support probability predictions")

        X_scaled = self.scaler.transform(X)
        return self.model.predict_proba(X_scaled)

    def get_feature_importance(self) -> pd.DataFrame:
        """
        Get feature importance scores.

        Returns:
            DataFrame with feature names and importance scores
        """
        if not self.is_trained:
            raise RuntimeError("Model must be trained first")

        if hasattr(self.model, "feature_importances_"):
            importance_df = pd.DataFrame(
                {
                    "feature": self.feature_names,
                    "importance": self.model.feature_importances_,
                }
            ).sort_values("importance", ascending=False)
            return importance_df
        elif hasattr(self.model, "coef_"):
            importance_df = pd.DataFrame(
                {
                    "feature": self.feature_names,
                    "importance": np.abs(self.model.coef_[0]),
                }
            ).sort_values("importance", ascending=False)
            return importance_df
        else:
            raise ValueError("Model does not support feature importance")

    def save(self, filepath: str):
        """Save the trained model to disk."""
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        with open(filepath, "wb") as f:
            pickle.dump(
                {
                    "model": self.model,
                    "scaler": self.scaler,
                    "feature_names": self.feature_names,
                    "model_type": self.model_type,
                },
                f,
            )

    @classmethod
    def load(cls, filepath: str) -> "DiseasePredictor":
        """Load a trained model from disk."""
        with open(filepath, "rb") as f:
            data = pickle.load(f)

        predictor = cls(model_type=data["model_type"])
        predictor.model = data["model"]
        predictor.scaler = data["scaler"]
        predictor.feature_names = data["feature_names"]
        predictor.is_trained = True

        return predictor


class RiskAssessmentModel:
    """
    Assesses patient health risk levels based on demographic and clinical data.
    """

    def __init__(self):
        self.models = {}
        self.scalers = {}

    def train_maternal_health(
        self, X: pd.DataFrame, y: pd.Series
    ) -> Dict:
        """
        Train maternal health risk model.

        Args:
            X: Features (age, prior_complications, etc.)
            y: Risk level (low, medium, high)

        Returns:
            Training metrics
        """
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)

        model = RandomForestClassifier(n_estimators=100, random_state=42)
        model.fit(X_scaled, y)

        self.models["maternal"] = model
        self.scalers["maternal"] = scaler

        return {
            "model_type": "maternal_health",
            "accuracy": model.score(X_scaled, y),
        }

    def train_chronic_disease(
        self, X: pd.DataFrame, y: pd.Series
    ) -> Dict:
        """
        Train chronic disease risk model.

        Args:
            X: Features (age, bmi, blood_pressure, etc.)
            y: Risk level

        Returns:
            Training metrics
        """
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)

        model = GradientBoostingRegressor(n_estimators=100, random_state=42)
        model.fit(X_scaled, y)

        self.models["chronic"] = model
        self.scalers["chronic"] = scaler

        return {
            "model_type": "chronic_disease",
            "r2_score": model.score(X_scaled, y),
        }

    def predict_risk(
        self, X: pd.DataFrame, model_type: str = "maternal"
    ) -> np.ndarray:
        """
        Predict risk scores for new patients.

        Args:
            X: Patient features
            model_type: Type of risk model to use

        Returns:
            Risk predictions
        """
        if model_type not in self.models:
            raise ValueError(f"Model {model_type} not trained")

        scaler = self.scalers[model_type]
        model = self.models[model_type]

        X_scaled = scaler.transform(X)
        return model.predict(X_scaled)

    def get_patient_risk_report(
        self, patient_data: Dict
    ) -> Dict:
        """
        Generate comprehensive risk report for a patient.

        Args:
            patient_data: Dictionary with patient information

        Returns:
            Risk assessment report
        """
        report = {
            "patient_id": patient_data.get("patient_id", "unknown"),
            "maternal_risk": None,
            "chronic_risk": None,
            "recommendations": [],
        }

        # Risk assessment logic
        age = patient_data.get("age", 0)
        if age < 18 or age > 45:
            report["recommendations"].append(
                "Age requires special maternal care consideration"
            )

        # Add recommendations based on risk levels
        if report.get("maternal_risk") == "high":
            report["recommendations"].append(
                "Immediate obstetric consultation recommended"
            )

        return report


class OutbreakForecaster:
    """
    Time series forecasting for disease outbreak prediction.
    """

    def __init__(self, forecast_horizon: int = 7):
        """
        Initialize the forecaster.

        Args:
            forecast_horizon: Number of days to forecast
        """
        self.forecast_horizon = forecast_horizon
        self.model = None

    def fit(self, time_series: pd.Series) -> Dict:
        """
        Fit the forecasting model.

        Args:
            time_series: Historical case counts

        Returns:
            Model fit metrics
        """
        # Simple moving average based forecasting
        self.model = {
            "mean": time_series.mean(),
            "std": time_series.std(),
            "trend": time_series.diff().mean(),
        }

        return {
            "mean": self.model["mean"],
            "std": self.model["std"],
            "trend": self.model["trend"],
        }

    def forecast(self) -> np.ndarray:
        """
        Generate forecast for future periods.

        Returns:
            Array of forecasted values
        """
        if self.model is None:
            raise RuntimeError("Model must be fitted first")

        last_value = self.model["mean"]
        forecasts = []

        for _ in range(self.forecast_horizon):
            next_value = last_value + self.model["trend"]
            forecasts.append(max(0, next_value))
            last_value = next_value

        return np.array(forecasts)

    def get_alert_levels(self, forecasts: np.ndarray) -> List[str]:
        """
        Generate alert levels based on forecasts.

        Args:
            forecasts: Forecasted case counts

        Returns:
            List of alert levels (normal, warning, critical)
        """
        alerts = []
        threshold_warning = self.model["mean"] + self.model["std"]
        threshold_critical = self.model["mean"] + 2 * self.model["std"]

        for value in forecasts:
            if value >= threshold_critical:
                alerts.append("critical")
            elif value >= threshold_warning:
                alerts.append("warning")
            else:
                alerts.append("normal")

        return alerts