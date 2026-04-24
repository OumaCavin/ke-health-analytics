"""Data preprocessing utilities for KE Health Analytics.

Provides data cleaning, encoding, and transformation functions.
Author: Cavin Otieno
"""

import pandas as pd
import numpy as np
from typing import Tuple, Dict
from sklearn.model_selection import train_test_split


def clean_data(df: pd.DataFrame) -> pd.DataFrame:
    """
    Clean health data by handling missing values and outliers.

    Args:
        df: Raw health data DataFrame

    Returns:
        Cleaned DataFrame
    """
    df = df.copy()

    # Handle missing values
    numeric_cols = df.select_dtypes(include=[np.number]).columns
    for col in numeric_cols:
        if df[col].isna().any():
            df[col].fillna(df[col].median(), inplace=True)

    # Handle categorical missing values
    categorical_cols = df.select_dtypes(include=["object"]).columns
    for col in categorical_cols:
        if df[col].isna().any():
            df[col].fillna(df[col].mode()[0], inplace=True)

    # Remove outliers using IQR method for numeric columns
    for col in numeric_cols:
        if col not in ["patient_id", "month"]:
            Q1 = df[col].quantile(0.25)
            Q3 = df[col].quantile(0.75)
            IQR = Q3 - Q1
            lower_bound = Q1 - 1.5 * IQR
            upper_bound = Q3 + 1.5 * IQR
            df = df[(df[col] >= lower_bound) & (df[col] <= upper_bound)]

    return df


def encode_categorical(df: pd.DataFrame, columns: list) -> pd.DataFrame:
    """
    Encode categorical variables using label encoding.

    Args:
        df: DataFrame with categorical columns
        columns: List of columns to encode

    Returns:
        DataFrame with encoded columns
    """
    from sklearn.preprocessing import LabelEncoder

    df = df.copy()
    encoders = {}

    for col in columns:
        if col in df.columns:
            le = LabelEncoder()
            df[col] = le.fit_transform(df[col].astype(str))
            encoders[col] = le

    return df


def normalize_features(df: pd.DataFrame, columns: list) -> pd.DataFrame:
    """
    Normalize numeric features to [0, 1] range.

    Args:
        df: DataFrame with numeric columns
        columns: List of columns to normalize

    Returns:
        DataFrame with normalized columns
    """
    from sklearn.preprocessing import MinMaxScaler

    df = df.copy()
    scaler = MinMaxScaler()

    for col in columns:
        if col in df.columns:
            df[col] = scaler.fit_transform(df[[col]])

    return df


def split_data(
    df: pd.DataFrame, target_col: str, test_size: float = 0.2, random_state: int = 42
) -> Tuple[pd.DataFrame, pd.DataFrame, pd.Series, pd.Series]:
    """
    Split data into train and test sets.

    Args:
        df: Input DataFrame
        target_col: Target variable column name
        test_size: Proportion of test set
        random_state: Random seed for reproducibility

    Returns:
        Tuple of (X_train, X_test, y_train, y_test)
    """
    X = df.drop(columns=[target_col])
    y = df[target_col]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=random_state
    )

    return X_train, X_test, y_train, y_test


def create_temporal_features(df: pd.DataFrame, date_col: str) -> pd.DataFrame:
    """
    Create temporal features from date column.

    Args:
        df: DataFrame with date column
        date_col: Name of date column

    Returns:
        DataFrame with temporal features added
    """
    df = df.copy()

    if date_col in df.columns:
        df[date_col] = pd.to_datetime(df[date_col])
        df["year"] = df[date_col].dt.year
        df["month"] = df[date_col].dt.month
        df["day"] = df[date_col].dt.day
        df["weekday"] = df[date_col].dt.weekday
        df["quarter"] = df[date_col].dt.quarter
        df["is_weekend"] = df["weekday"].isin([5, 6]).astype(int)

    return df


def aggregate_by_region(df: pd.DataFrame, region_col: str, value_col: str) -> pd.DataFrame:
    """
    Aggregate data by region with statistics.

    Args:
        df: Input DataFrame
        region_col: Name of region column
        value_col: Value column to aggregate

    Returns:
        Aggregated DataFrame with region statistics
    """
    agg_df = df.groupby(region_col)[value_col].agg([
        "count",
        "mean",
        "std",
        "min",
        "max",
    ]).reset_index()

    return agg_df