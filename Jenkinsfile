pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-creds')
        DOCKERHUB_USERNAME = "${DOCKERHUB_CREDENTIALS_USR}"
        DOCKERHUB_PASSWORD = "${DOCKERHUB_CREDENTIALS_PSW}"
        IMAGE_TAG = "latest"
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                checkout scm
            }
        }

        stage('Build Microservices') {
            steps {
                script {
                    def SERVICES = [
                        'appointment-service',
                        'AuthenticationAndAuthorizationMicroService',
                        'gateway-service',
                        'user-service',
                        'websocket',
                        'front-end'
                    ]

                    SERVICES.each { service ->
                        echo "Running build step for ${service}..."

                        // Customize this if services have a specific build process (e.g., Maven, npm, etc.)
                        def buildScript = ''
                        if (service == 'front-end') {
                            buildScript = "cd ${service} && npm install && npm run build"
                        } else if (service == 'websocket') {
                            buildScript = "cd ${service} && npm install"
                        } else {
                            // assuming Java-based microservices use Maven
                            buildScript = "cd ${service} && ./mvnw clean package -DskipTests"
                        }

                        sh buildScript
                    }
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    SERVICES.each { service ->
                        def imageName = "${DOCKERHUB_USERNAME}/${service.toLowerCase()}"
                        echo "Building Docker image for ${service}..."

                        sh "docker build -t ${imageName}:${IMAGE_TAG} ${service}"
                    }
                }
            }
        }

        stage('Push Docker Images') {
            steps {
                script {
                    sh 'echo "${DOCKERHUB_PASSWORD}" | docker login -u "${DOCKERHUB_USERNAME}" --password-stdin'

                    SERVICES.each { service ->
                        def imageName = "${DOCKERHUB_USERNAME}/${service.toLowerCase()}"
                        echo "Pushing ${imageName}:${IMAGE_TAG} to Docker Hub..."

                        sh "docker push ${imageName}:${IMAGE_TAG}"
                    }
                }
            }
        }

        stage('Cleanup') {
            steps {
                echo 'Cleaning up local Docker images and cache...'
                sh 'docker system prune -f'
            }
        }
    }

    post {
        always {
            echo 'Pipeline execution completed.'
        }
    }
}
