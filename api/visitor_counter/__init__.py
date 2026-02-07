import json
import logging
import os

import azure.functions as func

from .database import CosmosDBClient


def main(req: func.HttpRequest) -> func.HttpResponse:
    """Azure Function to track and return visitor count."""
    logging.info("Visitor counter function processed a request.")

    headers = {
        "Access-Control-Allow-Origin": os.environ.get("ALLOWED_ORIGIN", "*"),
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }

    if req.method == "OPTIONS":
        return func.HttpResponse(status_code=204, headers=headers)

    try:
        db_client = CosmosDBClient.from_environment()
        count = db_client.increment_visitor_count()

        return func.HttpResponse(
            body=json.dumps({"visitor_count": count}),
            status_code=200,
            mimetype="application/json",
            headers=headers,
        )
    except ValueError as e:
        logging.error(f"Configuration error: {e}")
        return func.HttpResponse(
            body=json.dumps({"error": "Service misconfigured"}),
            status_code=500,
            mimetype="application/json",
            headers=headers,
        )
    except ConnectionError as e:
        logging.error(f"Database connection error: {e}")
        return func.HttpResponse(
            body=json.dumps({"error": "Database unavailable"}),
            status_code=503,
            mimetype="application/json",
            headers=headers,
        )
    except Exception as e:
        logging.error(f"Unexpected error: {e}")
        return func.HttpResponse(
            body=json.dumps({"error": "Internal server error"}),
            status_code=500,
            mimetype="application/json",
            headers=headers,
        )
