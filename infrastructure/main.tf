provider "azurerm" {
  features {}
}

locals {
  vaultName = "${var.product}-${var.env}"
  tagEnv    = var.env == "aat" ? "staging" : var.env == "perftest" ? "testing" : var.env
  tags = merge(var.common_tags,
    tomap({
      "environment"  = local.tagEnv,
      "managedBy"    = "Employment Tribunals",
      "Team Contact" = "#et-ci-devs",
      "application"  = "employment-tribunals",
      "businessArea" = "CFT",
      "builtFrom"    = "et-syr"
    })
  )
}

data "azurerm_key_vault" "key_vault" {
  name                = local.vaultName
  resource_group_name = local.vaultName
}
