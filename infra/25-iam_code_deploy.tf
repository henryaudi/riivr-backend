resource "aws_iam_role" "code_deploy_iam_role" {
  name = var.code_deploy_role_name
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "codedeploy.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "AWSCodeDeployRole" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSCodeDeployRole"
  role       = aws_iam_role.code_deploy_iam_role.name
}

resource "aws_iam_role_policy_attachment" "code_deploy_autoscaling" {
  role       = aws_iam_role.code_deploy_iam_role.name
  policy_arn = "arn:aws:iam::aws:policy/AutoScalingFullAccess"
}

resource "aws_iam_role_policy" "code_deploy_passrole" {
  name = "${local.prefix}-codedeploy-passrole"
  role = aws_iam_role.code_deploy_iam_role.name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid      = "AllowPassEc2RoleForBlueGreen"
        Effect   = "Allow"
        Action   = "iam:PassRole"
        Resource = aws_iam_role.ec2_iam_role.arn
        Condition = {
          StringEquals = {
            "iam:PassedToService" = "ec2.amazonaws.com"
          }
        }
      }
    ]
  })
}

resource "aws_iam_role_policy" "codedeploy_autoscaling_tags" {
  name = "${local.prefix}-codedeploy-autoscaling-tags"
  role = aws_iam_role.code_deploy_iam_role.name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowAutoScalingTaggingForBlueGreen"
        Effect = "Allow"
        Action = [
          "autoscaling:CreateOrUpdateTags",
          "autoscaling:DeleteTags",
          "autoscaling:DescribeTags"
        ]
        Resource = "*"
      }
    ]
  })
}
