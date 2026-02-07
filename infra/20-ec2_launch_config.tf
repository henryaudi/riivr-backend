resource "aws_launch_template" "asg_launch_template" {
  name_prefix   = "${local.prefix}-launch-template-"
  image_id      = data.aws_ami.ec2_ami.id
  instance_type = var.ec2_instance_type
  key_name      = "riivrKeyPair"

  iam_instance_profile {
    name = aws_iam_instance_profile.ec2_instance_profile.name
  }

  vpc_security_group_ids = [aws_security_group.autoscaling_group_sg.id]
  user_data              = filebase64("${path.module}/scripts/user-data.sh")

  lifecycle {
    create_before_destroy = true
  }
}
