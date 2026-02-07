resource "aws_security_group" "bastion_host_sg" {
  name        = "${local.prefix}-bastion-sg"
  description = "Allows SSH into bastion host instance"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "TCP"
    cidr_blocks = [var.bastion_host_cidr]
    description = "Allows SSH into bastion host instance"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = [var.global_destination_cidr_block]
  }

  tags = merge(
    local.common_tags,
    tomap({ "Name" = "${local.prefix}-bastion-host-sg" })
  )
}

resource "aws_security_group" "alb_sg" {
  name        = "${local.prefix}-alb-sg"
  description = "Allows through the application load balancer"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "TCP"
    cidr_blocks = [var.global_destination_cidr_block]
    description = "Allows HTTP traffic to the load balancer"
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "TCP"
    cidr_blocks = [var.global_destination_cidr_block]
    description = "Allows HTTPS traffic to the load balancer"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = [var.global_destination_cidr_block]
  }

  tags = merge(
    local.common_tags,
    tomap({ "Name" = "${local.prefix}-alb-sg" })
  )
}

resource "aws_security_group" "elasticache_sg" {
  name        = "${local.prefix}-asg-sg"
  description = "Allows internet access for instances launched with ASG"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port       = 80
    to_port         = 80
    protocol        = "TCP"
    security_groups = [aws_security_group.alb_sg.id]
    description     = "Allows HTTP traffic into web server"
  }

  ingress {
    from_port       = 443
    to_port         = 443
    protocol        = "TCP"
    security_groups = [aws_security_group.alb_sg.id]
    description     = "Allows HTTPS traffic into web server"
  }

  ingress {
    from_port       = 22
    to_port         = 22
    protocol        = "TCP"
    security_groups = [aws_security_group.bastion_host_sg.id]
    description     = "Allows HTTPS traffic through bastion host"
  }

  ingress {
    from_port       = 5050
    to_port         = 5050
    protocol        = "TCP"
    security_groups = [aws_security_group.alb_sg.id]
    description     = "Allows access to web server through ALB"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = [var.global_destination_cidr_block]
  }

  tags = merge(
    local.common_tags,
    tomap({ "Name" = "${local.prefix}-autoscaling-group-sg" })
  )
}

resource "aws_security_group" "autoscaling_group_sg" {
  name        = "${local.prefix}-autoscaling-group-sg"
  description = "Allows internet access for instances lauched with ASG"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port       = 80
    to_port         = 80
    protocol        = "TCP"
    security_groups = [aws_security_group.alb_sg.id]
    description     = "Allows HTTP traffic into webserver"
  }

  ingress {
    from_port       = 443
    to_port         = 443
    protocol        = "TCP"
    security_groups = [aws_security_group.alb_sg.id]
    description     = "Allows HTTPS traffic into webserver"
  }

  ingress {
    from_port       = 22
    to_port         = 22
    protocol        = "TCP"
    security_groups = [aws_security_group.bastion_host_sg.id]
    description     = "Allows access to webserver through bastion host"
  }

  ingress {
    from_port       = 5050
    to_port         = 5050
    protocol        = "TCP"
    security_groups = [aws_security_group.alb_sg.id]
    description     = "Allows access to webserver through ALB"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = [var.global_destination_cidr_block]
  }

  tags = merge(
    local.common_tags,
    tomap({ "Name" = "${local.prefix}-autoscaling-group-sg" })
  )
}
