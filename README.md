This project is a **Health Check Application**, designed to streamline healthcare services by enabling seamless interaction between patients and doctors. It provides features like user authentication, appointment scheduling, real-time communication, and robust DevOps integration for scalability and reliability.

### Features

- **User Authentication**: Secure login/logout functionality using **JWT (JSON Web Tokens)** for session management.
- **Appointment Management**: Patients can schedule, view, and manage appointments with doctors.
- **Real-Time Communication**: Integrated **WebSocket** support for live meetings between doctors and patients, enabling remote consultations.
- **Date Utilities**: Helper functions for date formatting and calculations to enhance user experience.
- **Microservices Architecture**: Backend services are modular and routed via **Spring Cloud Gateway**.
- **CORS Management**: Configured to allow secure cross-origin requests for frontend-backend communication.

### DevOps Features

- **CI/CD Pipeline**: Automated build and deployment pipelines using **Jenkins** for continuous integration and delivery.
- **Configuration Management**: **Ansible** is used for automating infrastructure provisioning and configuration.
- **Containerization**: The application is containerized using **Docker** to ensure consistency across environments. Each service (frontend, backend, and gateway) is packaged into its own Docker image.
- **Docker Compose**: Used to define and run multi-container Docker applications. It simplifies the orchestration of services by managing dependencies and networking between containers.
- **Orchestration**: **Kubernetes** is used for managing containerized applications, ensuring scalability, high availability, and fault tolerance.
- **Monitoring and Logging**: Integrated tools for monitoring and logging to ensure system reliability and performance.

### Technologies Used

#### Frontend
- **React** – For building interactive UIs
- **Redux Toolkit** – For efficient state management
- **JavaScript (ES6+)**
- **npm** – Package manager for frontend dependencies

#### Backend
- **Java** – Core backend logic
- **Spring Boot** – RESTful APIs and service layer
- **Spring Cloud Gateway** – Routing for microservices
- **WebSocket** – Real-time communication

#### Authentication
- **JWT (JSON Web Tokens)** – Stateless user sessions

#### Build Tools
- **Maven** – Dependency and build management for Java backend
- **npm** – Frontend package and script management

#### DevOps & Deployment
- **Jenkins** – CI/CD automation
- **Ansible** – Infrastructure automation
- **Docker** – Containerization for consistent environments
- **Docker Compose** – Multi-container orchestration
- **Kubernetes** – Orchestration, auto-scaling, and failover handling
