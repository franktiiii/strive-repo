"""Unit tests for the visitor counter Azure Function."""
import json
import pytest
from unittest.mock import MagicMock, patch

import azure.functions as func

from api.visitor_counter import main


def _build_request(method="GET"):
    """Helper to build a mock HTTP request."""
    return func.HttpRequest(
        method=method,
        url="/api/visitor",
        body=b"",
    )


class TestVisitorCounterFunction:
    """Tests for the main Azure Function handler."""

    @patch("api.visitor_counter.CosmosDBClient")
    def test_get_returns_visitor_count(self, mock_db_cls):
        mock_client = MagicMock()
        mock_client.increment_visitor_count.return_value = 5
        mock_db_cls.from_environment.return_value = mock_client

        req = _build_request("GET")
        response = main(req)

        assert response.status_code == 200
        body = json.loads(response.get_body())
        assert body["visitor_count"] == 5

    @patch("api.visitor_counter.CosmosDBClient")
    def test_options_returns_204(self, mock_db_cls):
        req = _build_request("OPTIONS")
        response = main(req)

        assert response.status_code == 204
        mock_db_cls.from_environment.assert_not_called()

    @patch("api.visitor_counter.CosmosDBClient")
    def test_cors_headers_present(self, mock_db_cls):
        mock_client = MagicMock()
        mock_client.increment_visitor_count.return_value = 1
        mock_db_cls.from_environment.return_value = mock_client

        req = _build_request("GET")
        response = main(req)

        assert "Access-Control-Allow-Origin" in response.headers
        assert "Access-Control-Allow-Methods" in response.headers

    @patch("api.visitor_counter.CosmosDBClient")
    def test_value_error_returns_500(self, mock_db_cls):
        mock_db_cls.from_environment.side_effect = ValueError("missing config")

        req = _build_request("GET")
        response = main(req)

        assert response.status_code == 500
        body = json.loads(response.get_body())
        assert "error" in body

    @patch("api.visitor_counter.CosmosDBClient")
    def test_connection_error_returns_503(self, mock_db_cls):
        mock_db_cls.from_environment.side_effect = ConnectionError("db down")

        req = _build_request("GET")
        response = main(req)

        assert response.status_code == 503
        body = json.loads(response.get_body())
        assert body["error"] == "Database unavailable"

    @patch("api.visitor_counter.CosmosDBClient")
    def test_unexpected_error_returns_500(self, mock_db_cls):
        mock_db_cls.from_environment.side_effect = RuntimeError("something unexpected")

        req = _build_request("GET")
        response = main(req)

        assert response.status_code == 500
        body = json.loads(response.get_body())
        assert body["error"] == "Internal server error"
