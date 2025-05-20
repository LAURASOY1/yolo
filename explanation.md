# YOLO Application Deployment Explanation

This document explains the architecture, implementation details and execution order of our containerized e-commerce application deployment using Ansible.

## Docker Implementation

### 1. Base Image Choice
- **Alpine Linux**: Selected for its minimal size (5-10MB) and security-focused approach.
- **Node:14-alpine**: Lightweight Node.js runtime that reduces resource consumption and attack surface.

### 2. Dockerfile Directives
- Multi-stage builds to exclude dev dependencies from final images.
- `COPY --from=build` pattern to reduce final image size by only including production assets.

### 3. Docker Compose Networking
- Custom bridge network (`app-net`) for isolated container communication.
- Subnet `172.20.0.0/16` to avoid IP conflicts with host networks.

### 4. Volume Usage
- `app-mongo-data`: Persists MongoDB data across container restarts and recreations.

### 5. Git Workflow
- Feature branches for Dockerfile optimization.
- Descriptive commit messages tracking project evolution.

### 6. Debugging Solutions
- Resolved `unauthorized: access token` by creating a PAT with write permissions.
- Fixed MongoDB connection using service name `app-ip-mongo`.

## Ansible Playbook Structure and Execution Order

The playbook executes roles in a specific sequential order to ensure proper dependencies and application setup:

1. **Common Role** → 2. **Docker Role** → 3. **Setup-MongoDB Role** → 4. **Backend-Deployment Role** → 5. **Frontend-Deployment Role**

This order is critical because:
- Docker must be installed before any containers can be created
- The database must be running before the backend can connect to it
- The backend API must be available for the frontend to communicate with it

## Role Functions and Ansible Modules

### Common Role
- **Purpose**: Initialize the environment and get application code
- **Positioning**: First in the playbook to establish foundation
- **Key Modules**:
  - `apt`: Install required system packages
  - `pip`: Install Python dependencies
  - `git`: Clone the application repository

### Docker Role
- **Purpose**: Set up Docker environment for containerization
- **Positioning**: Second in the playbook as Docker is required for all containers
- **Key Modules**:
  - `apt_key` and `apt_repository`: Add Docker's official repository
  - `apt`: Install Docker packages
  - `get_url`: Download Docker Compose binary
  - `service`: Ensure Docker daemon is running
  - `user`: Add vagrant user to Docker group for permissions
  - `docker_network`: Create custom network with the specified subnet

### Setup-MongoDB Role
- **Purpose**: Create and configure the MongoDB database container
- **Positioning**: Third in the playbook as the database is required by the backend
- **Key Modules**:
  - `file`: Create data persistence directory
  - `docker_container`: Run MongoDB container with proper volume mapping
  - `wait_for`: Ensure MongoDB is fully operational before proceeding

### Backend-Deployment Role
- **Purpose**: Build and deploy the Node.js backend API
- **Positioning**: Fourth in the playbook as it depends on MongoDB
- **Key Modules**:
  - `docker_image`: Build custom Docker image from backend Dockerfile using Alpine base
  - `docker_container`: Run backend container with proper environment variables
  - `uri`: Test API endpoints to verify successful deployment

### Frontend-Deployment Role
- **Purpose**: Build and deploy the React frontend application
- **Positioning**: Last in the playbook as it depends on backend services
- **Key Modules**:
  - `docker_image`: Build custom Docker image from frontend Dockerfile using Alpine
  - `docker_container`: Run frontend container with proper API connection settings
  - `wait_for`: Ensure frontend service is available

## Block Implementation

Blocks are used throughout the playbook to logically group related tasks and provide error handling:

```yaml
- name: Docker Installation Block
  block:
    - name: Install Docker packages
      # Tasks here
  rescue:
    - name: Handle Docker installation failure
      # Recovery task
  always:
    - name: Clean up temporary files
      # Cleanup task