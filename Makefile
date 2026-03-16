.PHONY: dev dev-api dev-all build deploy deploy-api deploy-frontend db-up db-down db-migrate db-seed setup

# ─── Local Development ──────────────────────────────────────────
setup: ## First-time setup: install deps, start DB, migrate, seed
	npm ci
	$(MAKE) db-up
	sleep 3
	$(MAKE) db-migrate
	$(MAKE) db-seed

dev: ## Start frontend dev server (port 5174)
	npm run dev

dev-api: ## Start API dev server (port 3001)
	npm run dev:api

dev-all: ## Start both frontend + API concurrently
	npm run dev:all

# ─── Database ───────────────────────────────────────────────────
db-up: ## Start PostgreSQL via Docker Compose
	docker compose up -d

db-down: ## Stop PostgreSQL
	docker compose down

db-migrate: ## Run Prisma migrations
	npx prisma migrate dev --schema=packages/api/prisma/schema.prisma

db-seed: ## Seed database with demo data
	npx prisma db seed --schema=packages/api/prisma/schema.prisma

db-studio: ## Open Prisma Studio
	npx prisma studio --schema=packages/api/prisma/schema.prisma

# ─── Build ──────────────────────────────────────────────────────
build: ## Build all packages
	npm run build

build-api: ## Build API Docker image
	docker build -f packages/api/Dockerfile -t rgm-command-centre:local .

build-frontend: ## Build frontend
	npm run build:frontend

# ─── AWS Deploy ─────────────────────────────────────────────────
deploy: ## Deploy everything via CDK
	cd infra && npx cdk deploy --all --require-approval never

deploy-api: ## Build and push API image to ECR, then force ECS redeploy
	@echo "→ Logging into ECR..."
	aws ecr get-login-password --region eu-west-1 | docker login --username AWS --password-stdin $$(aws sts get-caller-identity --query Account --output text).dkr.ecr.eu-west-1.amazonaws.com
	@echo "→ Building Docker image..."
	docker build -f packages/api/Dockerfile -t rgm-command-centre:latest .
	@echo "→ Tagging and pushing..."
	docker tag rgm-command-centre:latest $$(aws sts get-caller-identity --query Account --output text).dkr.ecr.eu-west-1.amazonaws.com/rgm-command-centre:latest
	docker push $$(aws sts get-caller-identity --query Account --output text).dkr.ecr.eu-west-1.amazonaws.com/rgm-command-centre:latest
	@echo "→ Forcing ECS redeployment..."
	aws ecs update-service --cluster RgmCluster --service $$(aws cloudformation describe-stacks --stack-name RgmApi --query "Stacks[0].Outputs[?OutputKey=='EcsServiceName'].OutputValue" --output text) --force-new-deployment --region eu-west-1

deploy-frontend: ## Build frontend and sync to S3 + invalidate CloudFront
	npm run build:frontend
	@S3_BUCKET=$$(aws cloudformation describe-stacks --stack-name RgmFrontend --query "Stacks[0].Outputs[?OutputKey=='SiteBucketName'].OutputValue" --output text) && \
	CF_DIST=$$(aws cloudformation describe-stacks --stack-name RgmFrontend --query "Stacks[0].Outputs[?OutputKey=='DistributionId'].OutputValue" --output text) && \
	echo "→ Syncing to s3://$$S3_BUCKET..." && \
	aws s3 sync packages/frontend/dist/ s3://$$S3_BUCKET/ --delete --cache-control "public, max-age=31536000, immutable" --exclude "index.html" --exclude "*.json" && \
	aws s3 cp packages/frontend/dist/index.html s3://$$S3_BUCKET/index.html --cache-control "no-cache, no-store, must-revalidate" && \
	echo "→ Invalidating CloudFront $$CF_DIST..." && \
	aws cloudfront create-invalidation --distribution-id $$CF_DIST --paths "/*"

# ─── AWS First-time Setup ──────────────────────────────────────
aws-setup: ## One-time: bootstrap CDK + enable Bedrock model access
	@echo "→ Bootstrapping CDK..."
	cd infra && npx cdk bootstrap
	@echo ""
	@echo "✓ CDK bootstrapped. Next steps:"
	@echo "  1. Enable Claude Sonnet 4 in Bedrock console (eu-west-1)"
	@echo "  2. (Optional) Create a Knowledge Base in Bedrock console"
	@echo "     and set BEDROCK_KNOWLEDGE_BASE_ID in the ECS task environment"
	@echo "  3. Run: make deploy"

# ─── Help ───────────────────────────────────────────────────────
help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

.DEFAULT_GOAL := help
