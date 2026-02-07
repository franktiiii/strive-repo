import os
from azure.cosmos import CosmosClient, exceptions


class CosmosDBClient:
    """Client for interacting with Azure Cosmos DB to manage visitor counts."""

    CONTAINER_ID = "visitors"
    DATABASE_ID = "cloud-resume"
    COUNTER_ID = "visitor_counter"

    def __init__(self, endpoint: str, key: str):
        if not endpoint or not key:
            raise ValueError("Cosmos DB endpoint and key are required")
        self._client = CosmosClient(endpoint, credential=key)
        self._container = (
            self._client.get_database_client(self.DATABASE_ID)
            .get_container_client(self.CONTAINER_ID)
        )

    @classmethod
    def from_environment(cls) -> "CosmosDBClient":
        """Create a client from environment variables."""
        endpoint = os.environ.get("COSMOS_ENDPOINT")
        key = os.environ.get("COSMOS_KEY")
        if not endpoint or not key:
            raise ValueError(
                "COSMOS_ENDPOINT and COSMOS_KEY environment variables must be set"
            )
        return cls(endpoint, key)

    def get_visitor_count(self) -> int:
        """Retrieve the current visitor count."""
        try:
            item = self._container.read_item(
                item=self.COUNTER_ID, partition_key=self.COUNTER_ID
            )
            return item.get("count", 0)
        except exceptions.CosmosResourceNotFoundError:
            return 0

    def increment_visitor_count(self) -> int:
        """Increment the visitor count by 1 and return the new count."""
        try:
            item = self._container.read_item(
                item=self.COUNTER_ID, partition_key=self.COUNTER_ID
            )
            item["count"] = item.get("count", 0) + 1
        except exceptions.CosmosResourceNotFoundError:
            item = {"id": self.COUNTER_ID, "count": 1}

        self._container.upsert_item(item)
        return item["count"]

    def reset_visitor_count(self) -> None:
        """Reset the visitor count to zero (for testing)."""
        item = {"id": self.COUNTER_ID, "count": 0}
        self._container.upsert_item(item)
