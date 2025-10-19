# Stop and remove the old container

docker stop tours-frontend-container
docker rm tours-frontend-container

# Rebuild with the new Dockerfile

docker build -t tours-frontend .

# Run production server

docker run -d -p 3002:4321 --name tours-frontend-container tours-frontend

# Debugging

docker ps

docker ps -a

docker logs <id>

###

###

###

# Rebuid after changes

# 1. Stop the running container

docker-compose down

# 2. rebuild the container

docker-compose up --build

####

##

###
