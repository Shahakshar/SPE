pipeline {
    agent any

    environment {
        GITHUB_CRED_ID = 'GITHUB_CRED'
        DOCKERHUB_CRED_ID = 'docker-hub-credentials'
        GITHUB_REPO_URL = 'https://github.com/Shahakshar/SPE.git'
        DEV_EMAIL = 'akshau0123@gmail.com'

        DOCKER_USER = 'akdev6298'
        IMAGE_TAG = "latest"

        APPOINTMENT_IMAGE = "${DOCKER_USER}/appointment-service:${IMAGE_TAG}"
        AUTH_IMAGE = "${DOCKER_USER}/authenticationandauthorizationmicroservice:${IMAGE_TAG}"
        GATEWAY_IMAGE = "${DOCKER_USER}/gateway-service:${IMAGE_TAG}"
        USER_IMAGE = "${DOCKER_USER}/user-service:${IMAGE_TAG}"
        FRONTEND_IMAGE = "${DOCKER_USER}/frontend-app:${IMAGE_TAG}"
        WEBSOCKET_IMAGE = "${DOCKER_USER}/websocket:${IMAGE_TAG}"
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
                    dir('front-end/health-check-app') {
                        sh "docker build -t ${FRONTEND_IMAGE} ."
                    }
                    dir('websocket') {
                        sh "docker build -t ${WEBSOCKET_IMAGE} ."
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
                        sh "docker push ${WEBSOCKET_IMAGE}"
                    }
                }
            }
        }

        stage('Deploy with Ansible') {
            steps {
                script {
                    withEnv(["ANSIBLE_HOST_KEY_CHECKING=False"]) {
                        dir('ansible') {
                            sh """
                                ansible-playbook -i inventory.ini playbook.yaml
                            """
                        }
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
