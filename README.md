# Overview
This project involved the containerization and deployment of a full-stack yolo application using Docker.




## How to launch the application 
# Project Setup
1. Clone repo: `git clone https://github.com/Vinge1718/yolo`
2. Install
   Install the docker engine here:
- [Docker](https://docs.docker.com/engine/install/)  & Docker Compose
3. Run: `docker-compose up --build`
4. Access client at `http://localhost:3000`

- **Frontend**: React app on port 3000
- **Backend**: Node.js API on port 5000
- **MongoDB**: Persists data via volume `app-mongo-data`

## Image Versions
- Client: `laurasoy1/brian-yolo-client:v1.0.0`
- Backend: `laurasoy1/brian-yolo-backend:v1.0.0`

![Alt text](image.png)

## How to run the app
Use vagrant up --provison command






