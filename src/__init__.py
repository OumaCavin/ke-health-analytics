"""KE Health Analytics - Predictive Healthcare Intelligence

A modern data science project for healthcare analytics.
Author: Cavin Otieno
"""

__version__ = "0.1.0"

from .data import loader, preprocessing
from .features import engineering
from .models import prediction, evaluation

__all__ = [
    "loader",
    "preprocessing",
    "engineering",
    "prediction",
    "evaluation",
]