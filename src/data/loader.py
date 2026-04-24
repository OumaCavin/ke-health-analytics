"""Data loading utilities for KE Health Analytics.

Handles loading of health records, weather data, and demographic information.
Author: Cavin Otieno
"""

import pandas as pd
import os
from typing import Optional, Dict


def load_health_data(filepath: str, format: str = "csv") -> pd.DataFrame:
    """
    Load health records data from file.

    Args:
        filepath: Path to the data file
        format: File format (csv, parquet, excel)

    Returns:
        DataFrame containing health records
    """
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"Data file not found: {filepath}")

    if format == "csv":
        return pd.read_csv(filepath)
    elif format == "parquet":
        return pd.read_parquet(filepath)
    elif format == "excel":
        return pd.read_excel(filepath)
    else:
        raise ValueError(f"Unsupported format: {format}")


def load_weather_data(filepath: str) -> pd.DataFrame:
    """
    Load weather data for disease correlation analysis.

    Args:
        filepath: Path to weather data file

    Returns:
        DataFrame with weather metrics
    """
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"Weather data file not found: {filepath}")

    return pd.read_csv(filepath)


def load_demographic_data(filepath: str) -> pd.DataFrame:
    """
    Load demographic data for population-based analysis.

    Args:
        filepath: Path to demographic data

    Returns:
        DataFrame with population demographics
    """
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"Demographic file not found: {filepath}")

    return pd.read_csv(filepath)


def get_sample_health_data() -> pd.DataFrame:
    """
    Generate sample health data for testing and prototyping.

    Returns:
        DataFrame with synthetic health records
    """
    import numpy as np

    np.random.seed(42)
    n_samples = 1000

    data = {
        "patient_id": range(1, n_samples + 1),
        "age": np.random.randint(0, 85, n_samples),
        "gender": np.random.choice(["M", "F"], n_samples),
        "region": np.random.choice(
            ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret"], n_samples
        ),
        "disease_type": np.random.choice(
            ["Malaria", "Typhoid", "Cholera", "Respiratory", "Other"],
            n_samples,
            p=[0.35, 0.25, 0.15, 0.15, 0.10],
        ),
        "cases": np.random.randint(1, 100, n_samples),
        "temperature": np.random.uniform(15, 40, n_samples),
        "humidity": np.random.uniform(30, 90, n_samples),
        "month": np.random.randint(1, 13, n_samples),
    }

    return pd.DataFrame(data)


def get_sample_weather_data() -> pd.DataFrame:
    """
    Generate sample weather data for testing.

    Returns:
        DataFrame with synthetic weather records
    """
    import numpy as np

    np.random.seed(43)
    dates = pd.date_range("2023-01-01", periods=365, freq="D")

    data = {
        "date": dates,
        "temperature": np.random.uniform(15, 35, 365),
        "humidity": np.random.uniform(40, 85, 365),
        "rainfall": np.random.uniform(0, 50, 365),
        "region": np.random.choice(
            ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret"], 365
        ),
    }

    return pd.DataFrame(data)


def validate_data(df: pd.DataFrame, required_columns: list) -> bool:
    """
    Validate that data contains required columns.

    Args:
        df: DataFrame to validate
        required_columns: List of required column names

    Returns:
        True if valid, raises ValueError otherwise
    """
    missing = set(required_columns) - set(df.columns)
    if missing:
        raise ValueError(f"Missing required columns: {missing}")
    return True


def load_all_data(
    health_path: Optional[str] = None,
    weather_path: Optional[str] = None,
    demo_path: Optional[str] = None,
) -> Dict[str, pd.DataFrame]:
    """
    Load all data sources and return as dictionary.

    Args:
        health_path: Path to health data
        weather_path: Path to weather data
        demo_path: Path to demographic data

    Returns:
        Dictionary of DataFrames
    """
    data = {}

    if health_path:
        data["health"] = load_health_data(health_path)
    if weather_path:
        data["weather"] = load_weather_data(weather_path)
    if demo_path:
        data["demographics"] = load_demographic_data(demo_path)

    return data