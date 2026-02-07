variable "project_name" {
  description = "Base name for all resources"
  type        = string
  default     = "az104resume"
}

variable "resource_group_name" {
  description = "Name of the Azure resource group"
  type        = string
  default     = "cloud-resume-rg"
}

variable "location" {
  description = "Azure region for resources"
  type        = string
  default     = "eastus"
}
