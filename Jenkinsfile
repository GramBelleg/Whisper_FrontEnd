pipeline {
    agent any
    environment {
        JOB_PATH = "/home/azureuser/Whisper_Devops/jenkins/jenkins_home/workspace/whisperFrontend_${BRANCH_NAME}"
        DOCKER_PASS = credentials('dockerPassword') 
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('building') {
            steps {
                sh """
                echo "******* building ********"

                docker run --rm -v "$JOB_PATH:/app" -w /app node:18 /bin/bash -c "npm install && npm run build"
                """
            }
        }


        stage('testing') {
            steps {
                sh """
                echo "******* testing ********"
                """
            }
        }

        stage('pushing Image To Dockerhub') {
            when {
                branch 'production'
            }
            steps {
                sh 'echo "******* pushing image ********"'
                sh 'echo $DOCKER_PASS | docker login -u grambell003 --password-stdin'
                sh 'docker-compose build front'
                sh 'docker-compose push front'
            }
        }

        stage('Deploying') {
            when {
                branch 'production'
            }
            steps {
                sh """
                 echo "******* deploying ********"
                """
            }
        }

    }
    post {
        always {
            echo 'Cleaning up the workspace...'
            cleanWs()
        }
    }   
}