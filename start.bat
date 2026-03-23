@echo off
echo Starting Docker containers...
docker-compose up -d

echo Waiting for containers to be ready...
timeout /t 5 /nobreak

echo Installing Composer dependencies...
docker-compose run --rm composer install --no-interaction

echo Setup complete!
echo Web server is running at http://localhost:9080