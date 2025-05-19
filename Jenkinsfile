pipeline {
    agent any

    environment {
        GITHUB_CRED_ID = 'github-creds'
        DOCKERHUB_CRED_ID = 'dockerhub-creds'
        GITHUB_REPO_URL = 'https://github.com/Shahakshar/SPE.git'

        DOCKER_USER = 'akdev6298'  // replace with your Docker Hub username
        IMAGE_TAG = "latest"

        APPOINTMENT_IMAGE = "${DOCKER_USER}/appointment-service:${IMAGE_TAG}"
        AUTH_IMAGE = "${DOCKER_USER}/authenticationandauthorizationmicroservice:${IMAGE_TAG}"
        GATEWAY_IMAGE = "${DOCKER_USER}/gateway-service:${IMAGE_TAG}"
        USER_IMAGE = "${DOCKER_USER}/user-service:${IMAGE_TAG}"
        FRONTEND_IMAGE = "${DOCKER_USER}/front-end:${IMAGE_TAG}"
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    git branch: 'main', url: "${GITHUB_REPO_URL}", credentialsId: "${GITHUB_CRED_ID}"
                }
            }
        }

        stage('Prepare Maven Wrapper') {
            steps {
                script {
                    def mavenServices = [
                        'appointment-service',
                        'AuthenticationAndAuthorizationMicroService',
                        'gateway-service',
                        'user-service'
                    ]
                    mavenServices.each { service ->
                        dir(service) {
                            sh 'chmod +x mvnw'
                        }
                    }
                }
            }
        }

        stage('Build Microservices') {
            steps {
                script {
                    dir('appointment-service') {
                        sh './mvnw clean package -DskipTests'
                    }
                    dir('AuthenticationAndAuthorizationMicroService') {
                        sh './mvnw clean package -DskipTests'
                    }
                    dir('gateway-service') {
                        sh './mvnw clean package -DskipTests'
                    }
                    dir('user-service') {
                        sh './mvnw clean package -DskipTests'
                    }
                    dir('front-end') {
                        sh 'npm install'
                        sh 'npm run dev'
                    }
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    dir('appointment-service') {
                        sh "docker build -t ${APPOINTMENT_IMAGE} ."
                    }
                    dir('AuthenticationAndAuthorizationMicroService') {
                        sh "docker build -t ${AUTH_IMAGE} ."
                    }
                    dir('gateway-service') {
                        sh "docker build -t ${GATEWAY_IMAGE} ."
                    }
                    dir('user-service') {
                        sh "docker build -t ${USER_IMAGE} ."
                    }
                    dir('front-end') {
                        sh "docker build -t ${FRONTEND_IMAGE} ."
                    }
                }
            }
        }

        stage('Push Docker Images') {
            steps {
                script {
                    docker.withRegistry('', "${DOCKERHUB_CRED_ID}") {
                        sh "docker push ${APPOINTMENT_IMAGE}"
                        sh "docker push ${AUTH_IMAGE}"
                        sh "docker push ${GATEWAY_IMAGE}"
                        sh "docker push ${USER_IMAGE}"
                        sh "docker push ${FRONTEND_IMAGE}"
                    }
                }
            }
        }

        stage('Deploy with Ansible') {
            steps {
                script {
                    // Assuming your Ansible playbook is at repo root, named deploy.yml
                    // Passing docker image tags as extra-vars for dynamic deployment
                    sh """
                    ansible-playbook deploy.yml --extra-vars \\
                        appointment_image=${APPOINTMENT_IMAGE} \\
                        auth_image=${AUTH_IMAGE} \\
                        gateway_image=${GATEWAY_IMAGE} \\
                        user_image=${USER_IMAGE} \\
                        frontend_image=${FRONTEND_IMAGE}
                    """
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
        success {
            mail to: "${DEV_EMAIL}",
                 subject: "Deployment SUCCESS: Build ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                 body: "The build, push, and deployment pipeline completed successfully."
        }
        failure {
            mail to: "${DEV_EMAIL}",
                 subject: "Deployment FAILURE: Build ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                 body: "The build, push, or deployment failed. Please check the Jenkins logs."
        }
        always {
            cleanWs()
        }
    }
}

