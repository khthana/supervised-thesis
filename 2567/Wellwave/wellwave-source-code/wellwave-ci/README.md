I'll create a proper README for your WellWave project that's different from your friend's template. Let me craft something clear and specific to your project:

# WellWave

![WellWave Logo](https://github.com/WellWave-App/wellwave-ci)

WellWave is a comprehensive wellness application designed to help users track and improve their physical and mental wellbeing.

## Setup Instructions

### Prerequisites
- Docker and Docker Compose
- Git
- Node.js (for local development)

### 1. Clone the Repository

```sh
git clone --recurse-submodules https://github.com/WellWave-App/wellwave-ci.git 
cd wellwave-ci
```

If you have already cloned the repository without submodules, you can initialize and update them manually:
```sh
git submodule update --init --recursive
```
or
```sh
git submodule update --remote --recursive
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```sh
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
# DB
POSTGRES_HOST=
POSTGRES_PORT=
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DATABASE= 

# AUTH
JWT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# PORTS
FRONTEND_PORT=
FLUTTER_PORT=
API_PORT=
NGINX_PORT=
DB_PORT=

```

### 3. Build and Start the Application

For production:

```sh
docker-compose -f docker-compose.prod.yml up -d --build
```

### 4. Access the Application

- Web application: http://hostname:${FRONTEND_PORT}
- API documentation: http://hostname:${API_PORT}/api/v1

## Project Structure

```
wellwave-ci/
├── wellwave-website/   # Frontend Next application
├── wellwave-backed/    # Backend NestJs API
├── wellwave-frontend/  # Mobile application (Flutter)
├── proxy/              # Nginx configuration
└── docker-compose.prod.yml 
```

## Acknowledgments

- [Next](https://nexyjs.org/)
- [Nest](https://nestjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Docker](https://www.docker.com/)
- [Flutter](https://flutter.dev/)
