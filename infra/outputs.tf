output "website_url" {
  value       = azurerm_storage_account.frontend.primary_web_endpoint
  description = "URL of the static website"
}

output "api_url" {
  value       = "https://${azurerm_linux_function_app.main.default_hostname}/api/visitor"
  description = "URL of the visitor counter API"
}

output "cdn_url" {
  value       = "https://${azurerm_cdn_endpoint.main.fqdn}"
  description = "CDN endpoint URL"
}

output "cosmos_endpoint" {
  value       = azurerm_cosmosdb_account.main.endpoint
  description = "Cosmos DB endpoint"
  sensitive   = true
}
