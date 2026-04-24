"""Feature engineering for health data analysis.

Creates predictive features from raw health and weather data.
Author: Cavin Otieno
"""

import pandas as pd
import numpy as np
from typing import List


def create_disease_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Create engineered features for disease prediction.

    Args:
        df: Health data DataFrame

    Returns:
        DataFrame with engineered features
    """
    df = df.copy()

    # Age-based features
    df["age_group"] = pd.cut(
        df["age"],
        bins=[0, 5, 18, 35, 50, 100],
        labels=["child", "teen", "adult", "middle_age", "senior"],
    )

    # Risk scores based on age
    df["age_risk_score"] = df["age"].apply(
        lambda x: 1.0 if x < 5 or x > 65 else 0.5
    )

    # Disease severity encoding
    disease_severity = {
        "Malaria": 3,
        "Cholera": 4,
        "Typhoid": 2,
        "Respiratory": 2,
        "Other": 1,
    }
    df["disease_severity"] = df["disease_type"].map(disease_severity)

    # Case load features
    df["high_case_load"] = (df["cases"] > df["cases"].median()).astype(int)
    df["case_density"] = df["cases"] / (df["age"] + 1)

    # Regional risk indicator
    high_risk_regions = ["Mombasa", "Kisumu"]
    df["high_risk_region"] = df["region"].isin(high_risk_regions).astype(int)

    # Seasonal indicators
    rainy_months = [3, 4, 5, 10, 11]
    df["is_rainy_season"] = df["month"].isin(rainy_months).astype(int)

    # Interaction features
    df["age_disease_interaction"] = df["age"] * df["disease_severity"]
    df["region_disease_interaction"] = df["high_risk_region"] * df["disease_severity"]

    return df


def create_weather_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Create features from weather data for disease correlation.

    Args:
        df: Weather data DataFrame

    Returns:
        DataFrame with weather-based features
    """
    df = df.copy()

    # Temperature risk levels
    df["temp_risk"] = pd.cut(
        df["temperature"],
        bins=[0, 20, 30, 100],
        labels=["low", "medium", "high"],
    )

    # Humidity conditions
    df["humidity_condition"] = pd.cut(
        df["humidity"],
        bins=[0, 50, 70, 100],
        labels=["dry", "moderate", "humid"],
    )

    # Rainfall categories
    df["rainfall_category"] = pd.cut(
        df["rainfall"],
        bins=[-1, 10, 30, 100],
        labels=["light", "moderate", "heavy"],
    )

    # Heat index calculation
    df["heat_index"] = df["temperature"] + (0.5 * (df["humidity"] - 40))

    # Mosquito breeding conditions (Malaria risk)
    df["malaria_conditions"] = (
        (df["temperature"] >= 25) & (df["humidity"] >= 60) & (df["rainfall"] > 5)
    ).astype(int)

    # Combined weather risk score
    df["weather_risk_score"] = (
        (df["temperature"].clip(20, 35) - 20) / 15 * 0.3
        + (df["humidity"].clip(40, 90) - 40) / 50 * 0.3
        + (df["rainfall"].clip(0, 40) / 40) * 0.4
    )

    return df


def create_lag_features(
    df: pd.DataFrame, column: str, lags: List[int], group_col: str = None
) -> pd.DataFrame:
    """
    Create lagged features for time series prediction.

    Args:
        df: Input DataFrame
        column: Column to create lags for
        lags: List of lag periods
        group_col: Optional grouping column

    Returns:
        DataFrame with lag features
    """
    df = df.copy()

    for lag in lags:
        lag_col = f"{column}_lag_{lag}"
        if group_col:
            df[lag_col] = df.groupby(group_col)[column].shift(lag)
        else:
            df[lag_col] = df[column].shift(lag)

    return df


def create_epidemiological_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Create epidemiological features for disease spread modeling.

    Args:
        df: Health data DataFrame

    Returns:
        DataFrame with epidemiological features
    """
    df = df.copy()

    # Basic reproduction number proxy
    df["transmission_rate"] = df["cases"] / (df["cases"].shift(1).fillna(1) + 1)

    # Outbreak indicator
    df["is_outbreak"] = (df["cases"] > df["cases"].quantile(0.9)).astype(int)

    # Incidence rate
    df["incidence_rate"] = df["cases"] / (df["age"] + 1) * 1000

    # Spatial clustering indicator
    region_counts = df.groupby("region")["cases"].transform("count")
    df["region_case_share"] = df["cases"] / region_counts

    return df