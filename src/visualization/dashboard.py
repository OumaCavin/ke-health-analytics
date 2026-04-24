"""Dashboard and visualization utilities for KE Health Analytics.

Creates interactive visualizations for health data analysis.
Author: Cavin Otieno
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from typing import Optional, List


def create_disease_dashboard(
    health_data: pd.DataFrame,
    weather_data: Optional[pd.DataFrame] = None,
    save_path: Optional[str] = None,
) -> dict:
    """
    Create comprehensive disease analytics dashboard.

    Args:
        health_data: Health records DataFrame
        weather_data: Optional weather data for correlation
        save_path: Optional path to save dashboard image

    Returns:
        Dictionary with dashboard figures
    """
    sns.set_style("whitegrid")
    figures = {}

    # Disease distribution by region
    fig1, ax1 = plt.subplots(figsize=(12, 6))
    disease_region = health_data.groupby(["region", "disease_type"])["cases"].sum().unstack()
    disease_region.plot(kind="bar", ax=ax1, stacked=True)
    ax1.set_title("Disease Cases by Region")
    ax1.set_xlabel("Region")
    ax1.set_ylabel("Total Cases")
    ax1.legend(title="Disease Type", bbox_to_anchor=(1.05, 1))
    plt.tight_layout()
    figures["disease_by_region"] = fig1

    # Age distribution of patients
    fig2, ax2 = plt.subplots(figsize=(10, 6))
    ax2.hist(health_data["age"], bins=20, edgecolor="black", alpha=0.7)
    ax2.set_title("Age Distribution of Patients")
    ax2.set_xlabel("Age")
    ax2.set_ylabel("Frequency")
    plt.tight_layout()
    figures["age_distribution"] = fig2

    # Monthly disease trends
    fig3, ax3 = plt.subplots(figsize=(12, 5))
    monthly = health_data.groupby("month")["cases"].sum()
    monthly.plot(kind="line", ax=ax3, marker="o")
    ax3.set_title("Monthly Disease Cases Trend")
    ax3.set_xlabel("Month")
    ax3.set_ylabel("Total Cases")
    ax3.set_xticks(range(1, 13))
    plt.tight_layout()
    figures["monthly_trend"] = fig3

    # Weather correlation if available
    if weather_data is not None:
        fig4, axes = plt.subplots(1, 2, figsize=(14, 5))

        # Temperature vs Cases
        merged = pd.merge(health_data, weather_data, on=["region", "month"])
        axes[0].scatter(merged["temperature"], merged["cases"], alpha=0.5)
        axes[0].set_xlabel("Temperature")
        axes[0].set_ylabel("Cases")
        axes[0].set_title("Temperature vs Disease Cases")

        # Humidity vs Cases
        axes[1].scatter(merged["humidity"], merged["cases"], alpha=0.5)
        axes[1].set_xlabel("Humidity")
        axes[1].set_ylabel("Cases")
        axes[1].set_title("Humidity vs Disease Cases")

        plt.tight_layout()
        figures["weather_correlation"] = fig4

    if save_path:
        for name, fig in figures.items():
            fig.savefig(f"{save_path}_{name}.png", dpi=300, bbox_inches="tight")

    return figures


def plot_region_comparison(
    df: pd.DataFrame,
    regions: List[str],
    metric: str = "cases",
    save_path: Optional[str] = None,
) -> plt.Figure:
    """
    Create comparison plot for multiple regions.

    Args:
        df: Health data DataFrame
        regions: List of regions to compare
        metric: Metric to plot
        save_path: Optional path to save figure

    Returns:
        Matplotlib figure
    """
    fig, ax = plt.subplots(figsize=(12, 6))

    for region in regions:
        region_data = df[df["region"] == region]
        monthly = region_data.groupby("month")[metric].sum()
        ax.plot(monthly.index, monthly.values, marker="o", label=region)

    ax.set_xlabel("Month")
    ax.set_ylabel(metric.title())
    ax.set_title(f"Regional Comparison: {metric.title()}")
    ax.legend()
    ax.set_xticks(range(1, 13))

    plt.tight_layout()

    if save_path:
        fig.savefig(save_path, dpi=300, bbox_inches="tight")

    return fig


def create_heatmap(
    df: pd.DataFrame,
    value_col: str,
    index_col: str,
    columns_col: str,
    save_path: Optional[str] = None,
) -> plt.Figure:
    """
    Create heatmap visualization for cross-tabulated data.

    Args:
        df: Input DataFrame
        value_col: Value column
        index_col: Row index column
        columns_col: Column name for pivoting
        save_path: Optional path to save figure

    Returns:
        Matplotlib figure
    """
    pivot = df.pivot_table(
        values=value_col,
        index=index_col,
        columns=columns_col,
        aggfunc="sum",
        fill_value=0,
    )

    fig, ax = plt.subplots(figsize=(12, 8))
    sns.heatmap(pivot, annot=True, fmt="d", cmap="YlOrRd", ax=ax)
    ax.set_title(f"Heatmap: {value_col} by {index_col} and {columns_col}")

    plt.tight_layout()

    if save_path:
        fig.savefig(save_path, dpi=300, bbox_inches="tight")

    return fig


def plot_prediction_results(
    y_true: np.ndarray,
    y_pred: np.ndarray,
    title: str = "Prediction Results",
    save_path: Optional[str] = None,
) -> plt.Figure:
    """
    Create prediction results visualization.

    Args:
        y_true: True values
        y_pred: Predicted values
        title: Plot title
        save_path: Optional path to save figure

    Returns:
        Matplotlib figure
    """
    fig, axes = plt.subplots(1, 2, figsize=(14, 5))

    # Scatter plot
    axes[0].scatter(y_true, y_pred, alpha=0.5)
    max_val = max(y_true.max(), y_pred.max())
    axes[0].plot([0, max_val], [0, max_val], "r--", label="Perfect Prediction")
    axes[0].set_xlabel("Actual Values")
    axes[0].set_ylabel("Predicted Values")
    axes[0].set_title("Actual vs Predicted")
    axes[0].legend()

    # Residual plot
    residuals = y_true - y_pred
    axes[1].scatter(y_pred, residuals, alpha=0.5)
    axes[1].axhline(y=0, color="r", linestyle="--")
    axes[1].set_xlabel("Predicted Values")
    axes[1].set_ylabel("Residuals")
    axes[1].set_title("Residual Plot")

    plt.suptitle(title)
    plt.tight_layout()

    if save_path:
        fig.savefig(save_path, dpi=300, bbox_inches="tight")

    return fig