"""Setup configuration for KE Health Analytics."""

from setuptools import setup, find_packages

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

with open("requirements.txt", "r", encoding="utf-8") as fh:
    requirements = [line.strip() for line in fh if line.strip() and not line.startswith("#")]

setup(
    name="ke-health-analytics",
    version="0.1.0",
    author="Cavin Otieno",
    author_email="cavin.otieno012@gmail.com",
    description="Predictive Healthcare Intelligence for Kenya",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/OumaCavin/ke-health-analytics",
    packages=find_packages(),
    classifiers=[
        "Development Status :: 3 - Alpha",
        "Intended Audience :: Healthcare Industry",
        "Topic :: Scientific/Engineering :: Artificial Intelligence",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
    ],
    python_requires=">=3.10",
    install_requires=requirements,
    extras_require={
        "dev": [
            "pytest>=7.4.0",
            "pytest-cov>=4.1.0",
            "black>=23.0.0",
            "flake8>=6.1.0",
        ],
        "viz": [
            "dash>=2.14.0",
            "panel>=1.2.0",
        ],
    },
)