"""Model evaluation and performance metrics for KE Health Analytics.

Provides comprehensive model evaluation utilities.
Author: Cavin Otieno
"""

import pandas as pd
import numpy as np
from typing import Dict, List, Tuple
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix,
    mean_squared_error,
    mean_absolute_error,
    r2_score,
)


def evaluate_model(
    y_true: np.ndarray,
    y_pred: np.ndarray,
    task_type: str = "classification",
) -> Dict:
    """
    Evaluate model performance with comprehensive metrics.

    Args:
        y_true: True labels
        y_pred: Predicted labels
        task_type: Type of task (classification or regression)

    Returns:
        Dictionary of evaluation metrics
    """
    metrics = {}

    if task_type == "classification":
        metrics["accuracy"] = accuracy_score(y_true, y_pred)
        metrics["precision"] = precision_score(y_true, y_pred, average="weighted", zero_division=0)
        metrics["recall"] = recall_score(y_true, y_pred, average="weighted", zero_division=0)
        metrics["f1_score"] = f1_score(y_true, y_pred, average="weighted", zero_division=0)
        metrics["confusion_matrix"] = confusion_matrix(y_true, y_pred).tolist()

        # Calculate per-class metrics
        labels = np.unique(y_true)
        class_metrics = {}
        for label in labels:
            y_binary = (y_true == label).astype(int)
            y_pred_binary = (y_pred == label).astype(int)

            class_metrics[str(label)] = {
                "precision": precision_score(y_binary, y_pred_binary, zero_division=0),
                "recall": recall_score(y_binary, y_pred_binary, zero_division=0),
                "f1": f1_score(y_binary, y_pred_binary, zero_division=0),
            }

        metrics["per_class"] = class_metrics

    elif task_type == "regression":
        metrics["mse"] = mean_squared_error(y_true, y_pred)
        metrics["rmse"] = np.sqrt(metrics["mse"])
        metrics["mae"] = mean_absolute_error(y_true, y_pred)
        metrics["r2"] = r2_score(y_true, y_pred)

        # Calculate MAPE
        mask = y_true != 0
        if mask.sum() > 0:
            metrics["mape"] = np.mean(
                np.abs((y_true[mask] - y_pred[mask]) / y_true[mask]) * 100
            )

    return metrics


def calculate_roc_auc(
    y_true: np.ndarray, y_proba: np.ndarray, average: str = "weighted"
) -> float:
    """
    Calculate ROC AUC score for classification.

    Args:
        y_true: True labels
        y_proba: Prediction probabilities
        average: Averaging method

    Returns:
        ROC AUC score
    """
    try:
        return roc_auc_score(y_true, y_proba, average=average, multi_class="ovr")
    except ValueError:
        return 0.0


def cross_validate_model(
    model, X: pd.DataFrame, y: pd.Series, cv: int = 5
) -> Dict:
    """
    Perform cross-validation and return detailed results.

    Args:
        model: Model to evaluate
        X: Features
        y: Target
        cv: Number of folds

    Returns:
        Cross-validation results
    """
    from sklearn.model_selection import cross_val_score, KFold

    kfold = KFold(n_splits=cv, shuffle=True, random_state=42)

    # Multiple scoring metrics
    scoring = {
        "accuracy": "accuracy",
        "f1_weighted": "f1_weighted",
        "roc_auc": "roc_auc_ovr_weighted",
    }

    results = {}
    for metric_name, scorer in scoring.items():
        try:
            scores = cross_val_score(model, X, y, cv=kfold, scoring=scorer, n_jobs=-1)
            results[metric_name] = {
                "mean": scores.mean(),
                "std": scores.std(),
                "scores": scores.tolist(),
            }
        except Exception:
            results[metric_name] = {"mean": 0, "std": 0, "scores": []}

    return results


def generate_classification_report(
    y_true: np.ndarray, y_pred: np.ndarray, class_names: List[str] = None
) -> str:
    """
    Generate human-readable classification report.

    Args:
        y_true: True labels
        y_pred: Predicted labels
        class_names: Optional class names

    Returns:
        Formatted report string
    """
    metrics = evaluate_model(y_true, y_pred, task_type="classification")

    report = "=" * 50 + "\n"
    report += "CLASSIFICATION REPORT\n"
    report += "=" * 50 + "\n\n"

    report += f"Overall Accuracy: {metrics['accuracy']:.4f}\n"
    report += f"Precision: {metrics['precision']:.4f}\n"
    report += f"Recall: {metrics['recall']:.4f}\n"
    report += f"F1 Score: {metrics['f1_score']:.4f}\n\n"

    report += "-" * 50 + "\n"
    report += "Per-Class Performance:\n"
    report += "-" * 50 + "\n"

    for class_name, class_metrics in metrics.get("per_class", {}).items():
        name = class_name if class_names is None else class_names[int(class_name)]
        report += f"\n{name}:\n"
        report += f"  Precision: {class_metrics['precision']:.4f}\n"
        report += f"  Recall: {class_metrics['recall']:.4f}\n"
        report += f"  F1 Score: {class_metrics['f1']:.4f}\n"

    return report


def generate_regression_report(
    y_true: np.ndarray, y_pred: np.ndarray
) -> str:
    """
    Generate human-readable regression report.

    Args:
        y_true: True values
        y_pred: Predicted values

    Returns:
        Formatted report string
    """
    metrics = evaluate_model(y_true, y_pred, task_type="regression")

    report = "=" * 50 + "\n"
    report += "REGRESSION REPORT\n"
    report += "=" * 50 + "\n\n"

    report += f"R-squared: {metrics['r2']:.4f}\n"
    report += f"Mean Squared Error: {metrics['mse']:.4f}\n"
    report += f"Root Mean Squared Error: {metrics['rmse']:.4f}\n"
    report += f"Mean Absolute Error: {metrics['mae']:.4f}\n"

    if "mape" in metrics:
        report += f"Mean Absolute Percentage Error: {metrics['mape']:.2f}%\n"

    return report


def generate_report(
    y_true: np.ndarray,
    y_pred: np.ndarray,
    y_proba: np.ndarray = None,
    task_type: str = "classification",
    class_names: List[str] = None,
    output_path: str = None,
) -> Dict:
    """
    Generate comprehensive evaluation report.

    Args:
        y_true: True labels/values
        y_pred: Predicted labels/values
        y_proba: Prediction probabilities (optional)
        task_type: Type of task
        class_names: Class names for display
        output_path: Path to save report

    Returns:
        Complete evaluation report
    """
    metrics = evaluate_model(y_true, y_pred, task_type)

    if y_proba is not None and task_type == "classification":
        try:
            metrics["roc_auc"] = calculate_roc_auc(y_true, y_proba)
        except Exception:
            pass

    # Generate text report
    if task_type == "classification":
        text_report = generate_classification_report(y_true, y_pred, class_names)
    else:
        text_report = generate_regression_report(y_true, y_pred)

    if output_path:
        with open(output_path, "w") as f:
            f.write(text_report)

    return {
        "metrics": metrics,
        "text_report": text_report,
        "n_samples": len(y_true),
    }