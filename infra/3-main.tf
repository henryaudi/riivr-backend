terraform {
  backend "s3" {
    bucket  = "riivr-app-terraform-state"
    key     = "dev/riivr.tfstate"
    region  = "us-east-1"
    encrypt = true
  }
}

locals {
  prefix = "${var.prefix}-${terraform.workspace}"

  common_tags = {
    Environment = terraform.workspace
    Project     = var.project
    ManagedBy   = "Terraform"
    Owner       = "Shangjie Zheng"
  }
}
