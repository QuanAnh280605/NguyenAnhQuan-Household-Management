"""
ResidentHub — Architecture Fitness Tests (ArchUnit Style)
Enforcing 3-Tier Layer Boundaries, Framework Independence, and Domain Purity.

Rules Enforced:
1. Presentation Layer (backend/app/api): Must NEVER import repositories or db directly.
2. Domain Service Layer (backend/app/services): Must NEVER import web frameworks (fastapi, starlette).
3. Core Layer (backend/app/core): Must NEVER import upwards from services or api.
4. Schemas Layer (backend/app/schemas): Pure DTO contracts, must NEVER import services, repos, or api.
5. Repository Layer (backend/app/repositories): Must NEVER import from api or services.
6. Result Pattern Compliance (ADR-0010): Services must NOT raise domain exceptions.
7. Saga Workflow Step Compliance (ADR-0011): All SagaStep subclasses must implement execute and compensate.
"""

import ast
import inspect
import os
from pathlib import Path
from typing import List, Set

import pytest

BACKEND_APP_DIR = Path(__file__).resolve().parent.parent / "app"


def get_python_files(subfolder: str) -> List[Path]:
    """Recursively collect all .py files in a subfolder, excluding __pycache__."""
    target_dir = BACKEND_APP_DIR / subfolder
    if not target_dir.exists():
        return []
    py_files = []
    for root, _, files in os.walk(target_dir):
        if "__pycache__" in root:
            continue
        for f in files:
            if f.endswith(".py"):
                py_files.append(Path(root) / f)
    return py_files


def extract_imports(filepath: Path) -> Set[str]:
    """Parse AST of a Python file and extract all imported module names."""
    with open(filepath, "r", encoding="utf-8") as f:
        tree = ast.parse(f.read(), filename=str(filepath))

    imports = set()
    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            for alias in node.names:
                imports.add(alias.name)
        elif isinstance(node, ast.ImportFrom):
            if node.module:
                imports.add(node.module)
    return imports


def test_presentation_layer_isolation():
    """Rule 1: Presentation (API controllers) must NOT import repositories or DB directly."""
    api_files = get_python_files("api")
    assert len(api_files) > 0, "No API files found to test"

    forbidden_prefixes = ("backend.app.repositories", "backend.app.db")
    violations = []

    for path in api_files:
        imports = extract_imports(path)
        for imp in imports:
            if any(imp.startswith(prefix) for prefix in forbidden_prefixes):
                violations.append(f"{path.name} imports forbidden module: {imp}")

    assert not violations, (
        f"Architecture Violation: Presentation layer directly accessing DB/Repositories:\n"
        + "\n".join(violations)
    )


def test_domain_services_framework_independence():
    """Rule 2: Domain services must be pure and independent of web frameworks (fastapi, starlette)."""
    service_files = get_python_files("services")
    assert len(service_files) > 0, "No service files found to test"

    forbidden_frameworks = ("fastapi", "starlette")
    violations = []

    for path in service_files:
        imports = extract_imports(path)
        for imp in imports:
            if any(imp == fw or imp.startswith(f"{fw}.") for fw in forbidden_frameworks):
                violations.append(f"{path.name} imports web framework: {imp}")

    assert not violations, (
        f"Architecture Violation: Domain services must not depend on web frameworks:\n"
        + "\n".join(violations)
    )


def test_core_layer_dependency_inversion():
    """Rule 3: Core primitives must NEVER import upwards from services or api (No circular dependencies)."""
    core_files = get_python_files("core")
    assert len(core_files) > 0, "No core files found to test"

    forbidden_prefixes = ("backend.app.services", "backend.app.api")
    violations = []

    for path in core_files:
        imports = extract_imports(path)
        for imp in imports:
            if any(imp.startswith(prefix) for prefix in forbidden_prefixes):
                violations.append(f"{path.name} imports higher-level layer: {imp}")

    assert not violations, (
        f"Architecture Violation: Core layer importing higher layers (circular dependency):\n"
        + "\n".join(violations)
    )


def test_schema_dto_purity():
    """Rule 4: Schema DTOs must only define contracts and never import services, repos, or api."""
    schema_files = get_python_files("schemas")
    assert len(schema_files) > 0, "No schema files found to test"

    forbidden_prefixes = (
        "backend.app.services",
        "backend.app.repositories",
        "backend.app.api",
    )
    violations = []

    for path in schema_files:
        imports = extract_imports(path)
        for imp in imports:
            if any(imp.startswith(prefix) for prefix in forbidden_prefixes):
                violations.append(f"{path.name} imports forbidden domain layer: {imp}")

    assert not violations, (
        f"Architecture Violation: Schemas must be pure contracts:\n"
        + "\n".join(violations)
    )


def test_repository_layer_boundaries():
    """Rule 5: Repositories must NEVER import from api or services."""
    repo_files = get_python_files("repositories")
    assert len(repo_files) > 0, "No repository files found to test"

    forbidden_prefixes = ("backend.app.api", "backend.app.services")
    violations = []

    for path in repo_files:
        imports = extract_imports(path)
        for imp in imports:
            if any(imp.startswith(prefix) for prefix in forbidden_prefixes):
                violations.append(f"{path.name} imports higher layer: {imp}")

    assert not violations, (
        f"Architecture Violation: Repositories must not depend on API or Services:\n"
        + "\n".join(violations)
    )


def test_services_adhere_to_result_pattern():
    """Rule 6 (ADR-0010): Domain services must return Result values, not raise domain exceptions."""
    service_files = [f for f in get_python_files("services") if "sagas" not in str(f)]
    assert len(service_files) > 0

    forbidden_exceptions = {
        "ValidationError",
        "ConflictError",
        "NotFoundError",
        "ConcurrencyError",
        "AuthenticationError",
        "ForbiddenError",
        "AppError",
    }
    violations = []

    for path in service_files:
        with open(path, "r", encoding="utf-8") as f:
            tree = ast.parse(f.read(), filename=str(path))

        for node in ast.walk(tree):
            if isinstance(node, ast.Raise) and node.exc:
                # Check raised exception name
                exc_name = None
                if isinstance(node.exc, ast.Call) and isinstance(node.exc.func, ast.Name):
                    exc_name = node.exc.func.id
                elif isinstance(node.exc, ast.Name):
                    exc_name = node.exc.id

                if exc_name in forbidden_exceptions:
                    violations.append(
                        f"{path.name}:{node.lineno} raises domain exception '{exc_name}' instead of returning Failure()"
                    )

    assert not violations, (
        f"ADR-0010 Violation: Domain services raising exceptions instead of returning Result:\n"
        + "\n".join(violations)
    )


def test_all_saga_steps_implement_execute_and_compensate():
    """Rule 7 (ADR-0011): All SagaStep subclasses must implement execute() and compensate()."""
    from backend.app.core.saga import SagaStep
    import backend.app.services.sagas.billing_batch_saga as saga_module

    step_classes = []
    for _, obj in inspect.getmembers(saga_module, inspect.isclass):
        if issubclass(obj, SagaStep) and obj is not SagaStep:
            step_classes.append(obj)

    assert len(step_classes) >= 4, "Expected at least 4 SagaStep classes in billing_batch_saga"

    for cls in step_classes:
        assert hasattr(cls, "execute") and callable(getattr(cls, "execute")), (
            f"SagaStep '{cls.__name__}' missing execute() method"
        )
        assert hasattr(cls, "compensate") and callable(getattr(cls, "compensate")), (
            f"SagaStep '{cls.__name__}' missing compensate() method"
        )
