"""Unit tests for the CosmosDB database client."""
import pytest
from unittest.mock import MagicMock, patch
from azure.cosmos import exceptions

from api.visitor_counter.database import CosmosDBClient


class TestCosmosDBClientInit:
    """Tests for CosmosDBClient initialization."""

    def test_raises_on_empty_endpoint(self):
        with pytest.raises(ValueError, match="endpoint and key are required"):
            CosmosDBClient("", "valid-key")

    def test_raises_on_empty_key(self):
        with pytest.raises(ValueError, match="endpoint and key are required"):
            CosmosDBClient("https://example.documents.azure.com", "")

    def test_raises_on_none_endpoint(self):
        with pytest.raises(ValueError):
            CosmosDBClient(None, "valid-key")

    @patch.dict("os.environ", {}, clear=True)
    def test_from_environment_missing_vars(self):
        with pytest.raises(ValueError, match="environment variables must be set"):
            CosmosDBClient.from_environment()

    @patch.dict("os.environ", {"COSMOS_ENDPOINT": "https://x.documents.azure.com", "COSMOS_KEY": "key123"})
    @patch("api.visitor_counter.database.CosmosClient")
    def test_from_environment_success(self, mock_cosmos):
        client = CosmosDBClient.from_environment()
        assert client is not None
        mock_cosmos.assert_called_once_with(
            "https://x.documents.azure.com", credential="key123"
        )


class TestGetVisitorCount:
    """Tests for retrieving visitor count."""

    @patch("api.visitor_counter.database.CosmosClient")
    def test_returns_count_when_exists(self, mock_cosmos_cls):
        mock_container = MagicMock()
        mock_container.read_item.return_value = {"id": "visitor_counter", "count": 42}
        mock_cosmos_cls.return_value.get_database_client.return_value.get_container_client.return_value = mock_container

        client = CosmosDBClient("https://x.documents.azure.com", "key")
        assert client.get_visitor_count() == 42

    @patch("api.visitor_counter.database.CosmosClient")
    def test_returns_zero_when_not_found(self, mock_cosmos_cls):
        mock_container = MagicMock()
        mock_container.read_item.side_effect = exceptions.CosmosResourceNotFoundError()
        mock_cosmos_cls.return_value.get_database_client.return_value.get_container_client.return_value = mock_container

        client = CosmosDBClient("https://x.documents.azure.com", "key")
        assert client.get_visitor_count() == 0


class TestIncrementVisitorCount:
    """Tests for incrementing visitor count."""

    @patch("api.visitor_counter.database.CosmosClient")
    def test_increments_existing_count(self, mock_cosmos_cls):
        mock_container = MagicMock()
        mock_container.read_item.return_value = {"id": "visitor_counter", "count": 10}
        mock_cosmos_cls.return_value.get_database_client.return_value.get_container_client.return_value = mock_container

        client = CosmosDBClient("https://x.documents.azure.com", "key")
        result = client.increment_visitor_count()

        assert result == 11
        mock_container.upsert_item.assert_called_once()
        upserted = mock_container.upsert_item.call_args[0][0]
        assert upserted["count"] == 11

    @patch("api.visitor_counter.database.CosmosClient")
    def test_creates_counter_when_missing(self, mock_cosmos_cls):
        mock_container = MagicMock()
        mock_container.read_item.side_effect = exceptions.CosmosResourceNotFoundError()
        mock_cosmos_cls.return_value.get_database_client.return_value.get_container_client.return_value = mock_container

        client = CosmosDBClient("https://x.documents.azure.com", "key")
        result = client.increment_visitor_count()

        assert result == 1
        mock_container.upsert_item.assert_called_once()


class TestResetVisitorCount:
    """Tests for resetting the visitor count."""

    @patch("api.visitor_counter.database.CosmosClient")
    def test_reset_upserts_zero_count(self, mock_cosmos_cls):
        mock_container = MagicMock()
        mock_cosmos_cls.return_value.get_database_client.return_value.get_container_client.return_value = mock_container

        client = CosmosDBClient("https://x.documents.azure.com", "key")
        client.reset_visitor_count()

        mock_container.upsert_item.assert_called_once_with(
            {"id": "visitor_counter", "count": 0}
        )
