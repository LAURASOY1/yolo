## 1. Base Image Choice  
- **Alpine Linux**: Minimal size and security-focused.  
- **Node:14-alpine**: Lightweight Node.js runtime.  

## 2. Dockerfile Directives  
- Multi-stage builds to exclude dev dependencies.  
- `COPY --from=build` to reduce final image size.  

## 3. Docker Compose Networking  
- Custom bridge network (`app-net`) for isolated communication.  
- Subnet `172.20.0.0/16` to avoid IP conflicts.  

## 4. Volume Usage  
- `app-mongo-data`: Persists MongoDB data across container restarts.  

## 5. Git Workflow  
- Feature branches for Dockerfile optimization.  
- Descriptive commits messsages 

## 6. Debugging  
- Resolved `unauthorized: access token` by creating a PAT with write permissions.  
- Fixed MongoDB connection using service name `app-ip-mongo`.  