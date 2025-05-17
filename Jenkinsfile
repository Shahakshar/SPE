// pipeline {
//     agent any
//
//     environment {
//         DOCKERHUB_CREDENTIALS = credentials('dockerhub-creds')
//         DOCKERHUB_USERNAME = DOCKERHUB_CREDENTIALS_USR
//         DOCKERHUB_PASSWORD = DOCKERHUB_CREDENTIALS_PSW
//         IMAGE_TAG = "latest"
//     }
//
//     stages {
//         stage('Checkout') {
//             steps {
//                 echo 'Checking out source code...'
//                 git credentialsId: 'github-creds', url: 'https://github.com/Shahakshar/SPE.git', branch: 'main'
//             }
//         }
//
//
//         stage('Prepare') {
//             steps {
//                 script {
//                     // Services that use Maven wrapper and need chmod +x
//                     def mavenServices = [
//                         'appointment-service',
// //                         'AuthenticationAndAuthorizationMicroService',
// //                         'gateway-service',
// //                         'user-service'
//                     ]
//
//                     mavenServices.each { service ->
//                         echo "Setting executable permission on mvnw for ${service}"
//                         sh "chmod +x ${service}/mvnw"
//                     }
//                 }
//             }
//         }
//
//         stage('Build Microservices') {
//             steps {
//                 script {
//                     def SERVICES = [
//                         'appointment-service',
// //                         'AuthenticationAndAuthorizationMicroService',
// //                         'gateway-service',
// //                         'user-service',
// //                         'websocket',
//                         'front-end'
//                     ]
//
//                     SERVICES.each { service ->
//                         echo "Running build step for ${service}..."
//
//                         def buildScript = ''
//                         if (service == 'front-end') {
//                             buildScript = "cd ${service} && npm install && npm run dev"
//                         }
//                         else {
//                             // Maven-based microservices
//                             buildScript = "cd ${service} && ./mvnw clean package -DskipTests"
//                         }
//
// //                         else if (service == 'websocket') {
//                         //                             buildScript = "cd ${service} && npm install"
//                         //                         }
//
//                         sh buildScript
//                     }
//                 }
//             }
//         }
//
//         stage('Build Docker Images') {
//             steps {
//                 script {
//                     def SERVICES = [
//                         'appointment-service',
// //                         'AuthenticationAndAuthorizationMicroService',
// //                         'gateway-service',
// //                         'user-service',
// //                         'websocket',
//                         'front-end'
//                     ]
//
//                     SERVICES.each { service ->
//                         def imageName = "${DOCKERHUB_USERNAME}/${service.toLowerCase()}"
//                         echo "Building Docker image for ${service}..."
//                         sh "docker build -t ${imageName}:${IMAGE_TAG} ${service}"
//                     }
//                 }
//             }
//         }
//
//         stage('Push Docker Images') {
//             steps {
//                 script {
//                     // Login to Docker Hub
//                     sh "echo ${DOCKERHUB_PASSWORD} | docker login -u ${DOCKERHUB_USERNAME} --password-stdin"
//
//                     def SERVICES = [
//                         'appointment-service',
// //                         'AuthenticationAndAuthorizationMicroService',
// //                         'gateway-service',
// //                         'user-service',
// //                         'websocket',
//                         'front-end'
//                     ]
//
//                     SERVICES.each { service ->
//                         def imageName = "${DOCKERHUB_USERNAME}/${service.toLowerCase()}"
//                         echo "Pushing ${imageName}:${IMAGE_TAG} to Docker Hub..."
//                         sh "docker push ${imageName}:${IMAGE_TAG}"
//                     }
//                 }
//             }
//         }
//
//         stage('Cleanup') {
//             steps {
//                 echo 'Cleaning up local Docker images and cache...'
//                 sh 'docker system prune -f'
//             }
//         }
//     }
//
//     post {
//         always {
//             echo 'Pipeline execution completed.'
//         }
//     }
// }



pipeline {
    agent any

    environment {
        JAVA_HOME = '/usr/lib/jvm/java-17-openjdk-amd64'  // Set this path according to your Jenkins server's Java 17 installation
        PATH = "${JAVA_HOME}/bin:${env.PATH}"
        HOME = "${env.WORKSPACE}"
        IMAGE_TAG = "latest"
    }

    stages {
        stage('Check Java Path') {
            steps {
                sh 'which java'
                sh 'java -version'
                sh "echo JAVA_HOME is set to ${JAVA_HOME}"
            }
        }

        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                git credentialsId: 'github-creds', url: 'https://github.com/Shahakshar/SPE.git', branch: 'main'
            }
        }

        stage('Prepare') {
            steps {
                script {
                    def mavenServices = ['appointment-service']
                    mavenServices.each { service ->
                        echo "Setting executable permission on mvnw for ${service}"
                        sh "chmod +x ${service}/mvnw"
                    }
                }
            }
        }

        stage('Build Microservices') {
            steps {
                script {
                    def SERVICES = ['appointment-service', 'front-end']
                    SERVICES.each { service ->
                        echo "Running build step for ${service}..."

                        def buildScript = ''
                        if (service == 'front-end') {
                            buildScript = "cd ${service}/health-check-app && npm install && npm run build"
                        } else {
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
                    def SERVICES = ['appointment-service', 'front-end']
                    SERVICES.each { service ->
                        def imageName = "yourdockerhubusername/${service.toLowerCase()}"
                        echo "Building Docker image for ${service}..."
                        sh "docker build -t ${imageName}:${IMAGE_TAG} ${service}"
                    }
                }
            }
        }

        stage('Push Docker Images') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKERHUB_USERNAME', passwordVariable: 'DOCKERHUB_PASSWORD')]) {
                    script {
                        sh "echo ${DOCKERHUB_PASSWORD} | docker login -u ${DOCKERHUB_USERNAME} --password-stdin"

                        def SERVICES = ['appointment-service', 'front-end']
                        SERVICES.each { service ->
                            def imageName = "${DOCKERHUB_USERNAME}/${service.toLowerCase()}"
                            echo "Pushing ${imageName}:${IMAGE_TAG} to Docker Hub..."
                            sh "docker push ${imageName}:${IMAGE_TAG}"
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
        always {
            echo 'Pipeline execution completed.'
        }
    }
}
