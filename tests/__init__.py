"""Unit tests for KE Health Analytics data modules."""

import pytest
import pandas as pd
import numpy as np
from src.data.loader import (
    get_sample_health_data,
    get_sample_weather_data,
    validate_data,
)
from src.data.preprocessing import (
    clean_data,
    encode_categorical,
    split_data,
)


class TestDataLoader:
    """Tests for data loading utilities."""

    def test_get_sample_health_data(self):
        """Test sample health data generation."""
        data = get_sample_health_data()
        assert isinstance(data, pd.DataFrame)
        assert len(data) > 0
        assert "patient_id" in data.columns
        assert "age" in data.columns
        assert "region" in data.columns

    def test_get_sample_weather_data(self):
        """Test sample weather data generation."""
        data = get_sample_weather_data()
        assert isinstance(data, pd.DataFrame)
        assert len(data) > 0
        assert "temperature" in data.columns
        assert "humidity" in data.columns
        assert "rainfall" in data.columns

    def test_validate_data_success(self):
        """Test data validation with required columns."""
        df = pd.DataFrame({"a": [1, 2, 3], "b": [4, 5, 6]})
        assert validate_data(df, ["a", "b"]) is True

    def test_validate_data_missing_columns(self):
        """Test data validation with missing columns."""
        df = pd.DataFrame({"a": [1, 2, 3]})
        with pytest.raises(ValueError, match="Missing required columns"):
            validate_data(df, ["a", "b"])


class TestPreprocessing:
    """Tests for data preprocessing utilities."""

    def test_clean_data_handles_missing_values(self):
        """Test that clean_data handles missing values."""
        df = pd.DataFrame({
            "age": [25, 30, np.nan, 40],
            "cases": [10, 20, 30, 40],
        })
        cleaned = clean_data(df)
        assert not cleaned["age"].isna().any()

    def test_clean_data_removes_outliers(self):
        """Test that clean_data removes outliers."""
        df = pd.DataFrame({
            "age": [25, 30, 35, 40, 200],
            "cases": [10, 20, 30, 40, 50],
        })
        cleaned = clean_data(df)
        assert cleaned["age"].max() < 200

    def test_encode_categorical(self):
        """Test categorical encoding."""
        df = pd.DataFrame({
            "color": ["red", "blue", "green"],
            "size": [1, 2, 3],
        })
        encoded = encode_categorical(df, ["color"])
        assert encoded["color"].dtype in [np.int64, np.int32]

    def test_split_data(self):
        """Test train-test split."""
        df = pd.DataFrame({
            "feature1": range(100),
            "feature2": range(100, 200),
            "target": range(100),
        })
        X_train, X_test, y_train, y_test = split_data(df, "target", test_size=0.2)
        assert len(X_train) == 80
        assert len(X_test) == 20