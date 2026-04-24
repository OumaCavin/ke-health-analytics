# KE Health Analytics - Contributing Guide

Thank you for your interest in contributing to KE Health Analytics!

## How to Contribute

### Reporting Issues

If you find a bug or have a suggestion:
1. Check existing issues first
2. Create a new issue with clear description
3. Include relevant code snippets and error messages

### Pull Requests

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes with proper commit messages
4. Run tests: `pytest tests/`
5. Push to your fork: `git push origin feature/my-feature`
6. Create a Pull Request

### Commit Message Format

We follow the conventional commits format:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance

### Code Style

- Follow PEP 8 guidelines
- Use type hints where applicable
- Write docstrings for all public functions
- Add unit tests for new features

### Development Setup

```bash
# Clone the repository
git clone https://github.com/OumaCavin/ke-health-analytics.git

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Install development dependencies
pip install pytest pytest-cov black flake8

# Run tests
pytest tests/ -v

# Format code
black src/ tests/
```

### Project Structure

```
ke-health-analytics/
├── src/              # Source code
│   ├── data/         # Data loading and preprocessing
│   ├── features/     # Feature engineering
│   ├── models/       # ML models
│   └── visualization/ # Dashboards
├── tests/            # Unit tests
├── config/           # Configuration
└── docs/             # Documentation
```

### Contact

- Author: Cavin Otieno
- Email: cavin.otieno012@gmail.com
- GitHub: https://github.com/OumaCavin