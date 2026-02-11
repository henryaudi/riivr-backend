# Riivr Social App Backend

Riivr is a distributed backend service for a social networking platform, built with **Node.js and TypeScript**. It provides RESTful APIs and a real-time event layer to power authentication, social interactions, messaging, and notifications.

The system is designed with modular domain boundaries, cache-first data access patterns, asynchronous job processing, and infrastructure-as-code deployment.

---

## Architecture Overview

- Domain-driven modular structure (9 bounded contexts)
- 60+ REST endpoints
- 10 persistence models
- Cache-first Redis-over-MongoDB strategy
- System-wide real-time event layer (Socket.IO)
- Asynchronous job processing (BullMQ)
- AWS infrastructure provisioned via Terraform
- Test-driven development with Jest

---
## Core Features

- JWT-based authentication and authorization
- User management and profile services
- Social graph (follow/unfollow)
- Posts, comments, and reactions
- Real-time messaging and notifications
- Media (images and videos) upload handling
- Event broadcasting across service domains
- Infrastructure-as-code deployment

---

## Project Structure

```text
riivr-backend/
├── src/
│   ├── app.ts                 # App entry point
│   ├── config.ts              # Environment + app configuration
│   ├── routes.ts              # Root route registration
│   ├── setupDatabase.ts       # MongoDB connection setup
│   ├── setupServer.ts         # Express + Socket.IO server initialization
│   ├── features/              # Domain modules (feature-first architecture)
│   │   ├── auth/              # Signup/signin/signout, JWT auth, current user
│   │   ├── chat/              # Real-time chat, message CRUD, reactions (Socket.IO)
│   │   ├── comments/          # Comment creation and retrieval
│   │   ├── followers/         # Follow/unfollow/block user, follower lists
│   │   ├── images/            # Image/media management and retrieval
│   │   ├── notifications/     # Notification CRUD (comments/messages/reactions)
│   │   ├── post/              # Post creation/update/delete, feed retrieval
│   │   ├── reactions/         # Reaction add/remove/query for posts/comments
│   │   └── user/              # User search, profile, settings, password updates
│   ├── shared/                # Shared middleware/services/utilities across features
│   └── mocks/                 # Mock payloads/helpers for Jest testing
├── infra/                     # Infrastructure as code (Terraform)
├── scripts/                   # Deployment and environment scripts
├── endpoints/                 # Sample HTTP requests per feature (*.http)
├── package.json               # NPM dependencies and scripts
├── tsconfig.json              # TypeScript configuration
├── jest.config.ts             # Jest configuration
└── README.md                  # Project documentation

```
### Example Feature Module (Chat)

```
features/chat/
├── controllers/
│   ├── add-chat-message.ts
│   ├── update-chat-message.ts
│   ├── delete-chat-message.ts
│   ├── get-chat-message.ts
│   └── add-message-reaction.ts
├── models/
│   ├── chat.schema.ts
│   └── conversation.schema.ts
├── routes/
│   └── chatRoutes.ts
├── interfaces/
│   └── chat.interface.ts
└── validations/
    └── chat.validation.ts
```
Each feature module encapsulates:

- Controllers  
- Routes  
- Models  
- Interfaces  
- Validation logic  

This structure enforces modular boundaries and allows independent feature evolution.

---

## Technology Stack

- **Backend:** Node.js, TypeScript, Express  
- **Database:** MongoDB  
- **Caching & Queues:** Redis, BullMQ  
- **Real-Time Layer:** Socket.IO  
- **Infrastructure:** AWS (EC2, ALB, ElastiCache, NAT, Bastion), Terraform  
- **Testing:** Jest  

---

## Data & Performance Design

### Cache-First Strategy

Reads are served through Redis where possible, with MongoDB as the persistence layer.  
Writes follow a write-through consistency model to ensure cache and database coherence.

### Asynchronous Processing

BullMQ is used to offload non-blocking workflows and decouple background processing from request handling.

### Real-Time Event Layer

Socket.IO provides bidirectional communication and event broadcasting across chat, posts, reactions, and notifications.

## Infrastructure (Terraform)

Infrastructure is provisioned and orchestrated using **Terraform** under the `infra/` directory. The goal is to deploy the backend in a production-style AWS topology with **network isolation, controlled ingress, and horizontal scalability**.

### High-Level Topology

- **Multi-AZ networking:** resources are distributed across two Availability Zones for resilience.
- **Public subnets:** host internet-facing components (e.g., ALB) and controlled access points (e.g., Bastion).
- **Private subnets:** host backend compute (EC2 instances) and internal services (e.g., ElastiCache).
- **Secure ingress:** public traffic terminates at the ALB (HTTPS); backend instances remain private.
- **Controlled egress:** private instances reach the internet through NAT (e.g., OS updates, dependency pulls).
- **Remote state:** Terraform state is stored in an encrypted S3 backend for safe collaboration and reproducible deployments.

### VPC and Subnet Layout

Terraform provisions a custom VPC with DNS support enabled. Within the VPC:

- **Two public subnets** (one per AZ)  
  Used for ALB and bastion access patterns.
- **Two private subnets** (one per AZ)  
  Used for backend EC2 instances and Redis (ElastiCache).

Route tables are configured so that:
- Public subnets route outbound traffic via an Internet Gateway.
- Private subnets route outbound traffic via a NAT Gateway (egress only).

### Load Balancer and Traffic Flow

An **Application Load Balancer (ALB)** is deployed into the public subnets and acts as the single internet-facing entry point:

- **HTTP (80)** redirects to **HTTPS (443)**
- **HTTPS (443)** terminates TLS using an ACM certificate
- Requests are forwarded to an internal **target group** backed by EC2 instances in private subnets

This keeps application instances off the public internet while still serving traffic globally.

### Compute (EC2 + Auto Scaling)

Backend instances are deployed in **private subnets** using an **Auto Scaling Group (ASG)** and a launch template:

- Instances register into the ALB target group
- Health checks are performed through the load balancer (ELB health checks)
- Capacity can scale horizontally based on demand and health signals
- Instances run the Node.js backend process (managed via PM2)

### Bastion and Secure Access Pattern

To support secure operational access without exposing private instances:

- A **bastion host** is deployed in a public subnet
- SSH access is restricted via security groups (and typically IP allow-listing)
- Private EC2 instances only allow SSH inbound from the bastion security group

> Note: In multi-AZ setups, a bastion can be placed per AZ for redundancy. In this project, the bastion access pattern is used to ensure private backend isolation while still allowing controlled administrative access.

### Caching and Background Processing

- **ElastiCache (Redis)** is deployed in private subnets for low-latency caching and queue backing.
- **BullMQ** uses Redis to run asynchronous job queues, decoupling background workflows from request handling.

### Typical Request Path

Client → **ALB (HTTPS)** → Target Group → **EC2 (private subnet)** → Redis/MongoDB → response  
Admin → SSH → **Bastion (public subnet)** → SSH → **EC2 (private subnet)**


---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- MongoDB (local or cloud)
- Redis

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- MongoDB (local or cloud)
- Redis

---

### Installation

```bash
git clone https://github.com/your-org/riivr-backend.git
cd riivr-backend
npm install
```

Create environment file:

```bash
cp .env.development.example .env
```

Update `.env` with required credentials.

---

### Running the Application

Development:

```bash
npm run dev
```

Production:

```bash
npm run build
npm start
```

---

### Running Tests

```bash
npm test
```

To generate coverage:

```bash
npm test -- --coverage
```

---

## Infrastructure (Terraform)

Infrastructure is defined under `/infra` and provisions AWS resources including VPC, subnets, ALB, Auto Scaling Group (EC2), NAT Gateway, Bastion host, and ElastiCache (Redis).

To deploy infrastructure:

```bash
cd infra
terraform init
terraform apply 
```

---

## Environment Configuration (.env)

🖐️ The backend requires an environment file (.env) for secrets and runtime configuration. Do not commit .env to Git!

There are two recommended approaches to provide the .env file to EC2 instances.

### Option A: Upload .env to AWS S3 (Recommended for ASG)

1. Upload your `.env` file to S3:

```bash
aws s3 cp .env s3://<YOUR_BUCKET_NAME>/env/.env
```
2. Ensure your EC2 instance role (IAM) has permission to read the object"

Example IAM Policy

```json
{
  "Effect": "Allow",
  "Action": "s3:GetObject",
  "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/env/.env"
}
```

3. In your EC2 user-data script (launch template), download the file during instance startup:
```bash
aws s3 cp s3://<YOUR_BUCKET_NAME>/env/.env /home/ec2-user/app/.env
```
This approach works well with Auto Scaling Groups (ASG), since newly launched instances automatically retrieve the correct environment configuration.
> Recommended: Enable S3 server-side encryption (SSE-S3 or SSE-KMS).

### Option B: Manually Sync .env via SSH (Quick Setup)

For manual deployment or testing, copy the .env file using scp.

Copy to bastion host:

```bash
scp -i <KEY.pem> .env ec2-user@<BASTION_PUBLIC_IP>:/home/ec2-user/
```

Transfer the file from bastion to private instance:

```bash
scp -i <KEY.pem> .env ec2-user@<PRIVATE_INSTANCE_IP>:/home/ec2-user/riivr-backend/
```

Restart the backend service to apply the updated environment variables 
> Note: PM2 is used to manage running backend processes in production.

```bash
pm2 restart riivr-backend
# or if starting manually
pm2 start dist/app.js --name riivr-backend
```

---

## Deployment

Deployment scripts are located in `/scripts` and implement AWS CodeDeploy lifecycle hooks:

- `before_install.sh` – Cleans existing deployment directory
- `after_install.sh` – Retrieves environment configuration and installs dependencies
- `application_start.sh` – Builds and starts the backend service

AWS CodeDeploy is configured via `appspec.yaml` to orchestrate these hooks during deployment.

---

*This project is maintained by the Riivr team AKA myself :)*
