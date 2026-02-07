# Test Coverage Analysis Report

**Project:** Azure Cloud Resume (AZ-104)
**Date:** 2026-02-07
**Overall Coverage:** 91% (58 statements, 5 missed)

---

## Current State

### Test Inventory

| Test File | Tests | Layer | What It Covers |
|-----------|-------|-------|----------------|
| `tests/unit/test_database.py` | 9 | Unit | CosmosDBClient init, get count, increment |
| `tests/unit/test_function.py` | 5 | Unit | HTTP handler, CORS, error responses |
| **Total** | **14** | | |

### Coverage by Module

| Module | Statements | Missed | Coverage | Missed Lines |
|--------|-----------|--------|----------|--------------|
| `api/visitor_counter/__init__.py` | 23 | 3 | 87% | 49-51 (generic Exception handler) |
| `api/visitor_counter/database.py` | 35 | 2 | 94% | 57-58 (`reset_visitor_count`) |
| **TOTAL** | **58** | **5** | **91%** | |

---

## Gap Analysis: Where We Need More Tests

### PRIORITY 1 — Critical Gaps (No Tests Exist)

#### 1. Frontend JavaScript (`frontend/app.js`) — 0% covered
The visitor counter fetch logic has **zero tests**. This is the code users interact with directly.

**Recommended tests:**
- `updateVisitorCount()` displays count on successful fetch
- Displays "unavailable" when API returns an error
- Displays "unavailable" on network failure
- Correctly reads `APP_CONFIG.apiUrl` when present
- Falls back to `/api/visitor` when config is missing

**Tools needed:** Jest + jsdom (or Vitest)

#### 2. Infrastructure as Code (`infra/`) — 0% validated
Terraform code has no automated validation.

**Recommended tests:**
- `terraform validate` — syntax correctness
- `terraform plan` — dry-run for drift detection
- Policy tests with OPA/Conftest (e.g., "serverless SKU enforced", "HTTPS required")
- Checkov or tfsec scans for security misconfigurations

#### 3. Integration Tests (`tests/integration/`) — Empty directory
There are zero integration tests. The unit tests mock all external dependencies, so we have no confidence the real Cosmos DB connection works.

**Recommended tests:**
- End-to-end API test: HTTP request → Function → Cosmos DB → response
- Cosmos DB integration: real read/write against emulator
- CORS validation: verify browser-like requests get correct headers

### PRIORITY 2 — Gaps in Existing Coverage

#### 4. Uncovered: Generic exception handler (lines 49-51 in `__init__.py`)
The catch-all `except Exception` path is not tested.

**Recommended test:**
```python
def test_unexpected_error_returns_500(self, mock_db_cls):
    mock_db_cls.from_environment.side_effect = RuntimeError("something unexpected")
    req = _build_request("GET")
    response = main(req)
    assert response.status_code == 500
    body = json.loads(response.get_body())
    assert body["error"] == "Internal server error"
```

#### 5. Uncovered: `reset_visitor_count()` (lines 57-58 in `database.py`)
The reset method has no test.

**Recommended test:**
```python
def test_reset_visitor_count(self, mock_cosmos_cls):
    mock_container = MagicMock()
    mock_cosmos_cls.return_value.get_database_client.return_value \
        .get_container_client.return_value = mock_container
    client = CosmosDBClient("https://x.documents.azure.com", "key")
    client.reset_visitor_count()
    mock_container.upsert_item.assert_called_once_with(
        {"id": "visitor_counter", "count": 0}
    )
```

### PRIORITY 3 — Missing Test Categories

#### 6. No CI/CD Pipeline Tests
There is no `.github/workflows/` test pipeline. Tests only run locally.

**Recommended:**
- GitHub Actions workflow that runs `pytest --cov` on every push/PR
- Fail the build if coverage drops below 90%
- Run `terraform validate` in CI

#### 7. No Security Tests
No dependency scanning, no SAST, no secret detection.

**Recommended:**
- `pip-audit` for Python dependency vulnerabilities
- `tfsec` or `checkov` for Terraform security scanning
- `gitleaks` for secret detection in commits

#### 8. No Load/Performance Tests
The visitor counter will be hit by every page view. No tests verify it handles concurrent traffic.

**Recommended:**
- Locust or k6 load test hitting the function endpoint
- Verify Cosmos DB doesn't lose counts under concurrent writes

#### 9. No Accessibility Tests
The frontend has no a11y validation.

**Recommended:**
- `pa11y` or `axe-core` automated accessibility scan on `index.html`

---

## Recommended Action Plan

| # | Action | Effort | Impact |
|---|--------|--------|--------|
| 1 | Add the 2 missing unit tests (Priority 2) | 15 min | Reaches **100% backend coverage** |
| 2 | Add GitHub Actions CI pipeline | 30 min | Tests run automatically on every push |
| 3 | Add Jest tests for `frontend/app.js` | 1 hr | Covers the untested frontend layer |
| 4 | Add Terraform validation to CI | 30 min | Catches IaC syntax/config errors |
| 5 | Add integration tests with Cosmos emulator | 2 hr | Validates real database interactions |
| 6 | Add security scanning (pip-audit, tfsec) | 1 hr | Catches vulnerabilities early |
| 7 | Add load tests | 2 hr | Confidence under real traffic |

---

## Summary

The backend API has solid unit test coverage at **91%**, but the project as a whole has significant blind spots:

- **Frontend:** completely untested
- **Infrastructure:** no validation or policy tests
- **Integration:** mocks only, no real service tests
- **CI/CD:** tests don't run automatically
- **Security:** no scanning

Addressing items 1-4 from the action plan would dramatically improve confidence in the codebase with relatively low effort.
