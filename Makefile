# Makefile for Docker Compose Development Environment

# Variables
DOCKER_COMPOSE_FILE = docker-compose.dev.yml
PROJECT_NAME = voyagr

# Default target
.PHONY: help
help:
	@echo "Usage: make [target]"
	@echo ""
	@echo "Targets:"
	@echo "  build       Build the Docker images"
	@echo "  up          Start the Docker containers"
	@echo "  down        Stop the Docker containers"
	@echo "  restart     Restart the Docker containers"
	@echo "  logs        View logs from the Docker containers"
	@echo "  clean       Remove stopped containers and unused images"

# Build the Docker images
.PHONY: build
build:
	docker compose --verbose -f $(DOCKER_COMPOSE_FILE) -p $(PROJECT_NAME) build

# Start the Docker containers
.PHONY: up
up:
	docker compose --verbose -f $(DOCKER_COMPOSE_FILE) -p $(PROJECT_NAME) up -d

# Stop the Docker containers
.PHONY: down
down:
	docker compose --verbose -f $(DOCKER_COMPOSE_FILE) -p $(PROJECT_NAME) down

# Restart the Docker containers
.PHONY: restart
restart: down up

# View logs from the Docker containers
.PHONY: logs
logs:
	docker compose --verbose -f $(DOCKER_COMPOSE_FILE) -p $(PROJECT_NAME) logs -f

# Clean up stopped containers and unused images
.PHONY: clean
clean:
	docker system prune -f