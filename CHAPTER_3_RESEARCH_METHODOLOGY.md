# CHAPTER 3: RESEARCH METHODOLOGY

## 3.1 Respondents of the Study

The respondents of this study are the stakeholders directly involved in the On-the-Job Training (OJT) program at CCDI Sorsogon. The primary respondents include:

### 3.1.1 Primary Users
- **Students**: OJT trainees who are currently enrolled in their respective courses and are required to complete their mandatory OJT hours as part of their curriculum. They are the primary end-users who will utilize the system for daily time recording, weekly reporting, and task management.

- **Administrators**: OJT coordinators, department heads, and school administrators who are responsible for monitoring student progress, evaluating performance, and managing the overall OJT program. They will use the system for oversight, evaluation, and administrative functions.

### 3.1.2 Secondary Users
- **Department Supervisors**: Company supervisors and mentors who oversee students during their OJT placement. They may indirectly benefit from the system through standardized evaluation forms and progress tracking.

- **School Management**: College administrators and academic deans who require comprehensive reports and analytics on OJT program effectiveness and student performance metrics.

### 3.1.3 Target Population
The target population consists of approximately 200-300 students per academic year across various courses requiring OJT completion, along with 5-10 administrative staff members managing the program.

### 3.1.4 Sample Selection
The development and testing phases involve:
- **Development Phase**: 3-5 student volunteers and 2 administrators for pilot testing
- **Beta Testing**: 15-20 students from different courses and all administrative staff
- **Full Implementation**: All enrolled OJT students and administrative staff

## 3.2 Discuss Actual Activities

The actual activities conducted during the development and implementation of the Web-Based OJT Monitoring System are structured into distinct phases:

### 3.2.1 Planning and Requirements Gathering
- **Stakeholder Interviews**: Conducted interviews with OJT coordinators, students, and department heads to understand current pain points and requirements
- **Process Analysis**: Documented existing manual processes for time recording, weekly reporting, and evaluation
- **Requirement Specification**: Defined functional and non-functional requirements based on stakeholder needs
- **System Architecture Design**: Planned the technical architecture including database schema, user roles, and security measures

### 3.2.2 System Development
- **Database Design**: Created comprehensive database schema using PostgreSQL with Prisma ORM, including entities for users, students, DTR records, weekly reports, evaluations, tasks, and notifications
- **Frontend Development**: Built responsive user interfaces using Next.js 16, React 19, and TypeScript with Tailwind CSS for styling
- **Authentication System**: Implemented secure authentication with role-based access control (RBAC) for admin and student roles
- **Core Features Development**:
  - Daily Time Record (DTR) management with time-in/time-out functionality
  - Weekly accomplishment report creation and submission
  - Task and activity tracking system
  - OJT evaluation form with automated scoring
  - Narrative report generation
  - Admin dashboard with analytics and monitoring
  - Notification system for important updates
  - Audit logging for system activity tracking

### 3.2.3 Testing and Quality Assurance
- **Unit Testing**: Tested individual components and functions for reliability
- **Integration Testing**: Verified seamless interaction between different system modules
- **User Acceptance Testing (UAT)**: Conducted with selected students and administrators to validate usability and functionality
- **Security Testing**: Implemented and tested security measures including password hashing, session management, and access controls
- **Performance Testing**: Optimized system performance for concurrent user access

### 3.2.4 Deployment and Implementation
- **Environment Setup**: Configured development, staging, and production environments
- **Database Migration**: Implemented database schema using Prisma migrations
- **System Deployment**: Deployed the application to production servers
- **User Training**: Conducted training sessions for administrators and students on system usage
- **Documentation**: Created user manuals and technical documentation

### 3.2.5 Maintenance and Support
- **Bug Fixes**: Addressed issues reported during initial implementation
- **Feature Enhancements**: Added improvements based on user feedback
- **Performance Monitoring**: Continuously monitored system performance and user experience
- **Regular Updates**: Implemented updates and security patches as needed

## 3.3 Research Instruments Used

The research instruments employed in this study include both data collection tools and development methodologies:

### 3.3.1 Data Collection Instruments

#### 3.3.1.1 Interview Guides
- **Structured Interviews**: Used for gathering detailed requirements from OJT coordinators and administrators
- **Semi-Structured Interviews**: Conducted with students to understand their current challenges and needs
- **Key Interview Questions**:
  - What are the current challenges in manual OJT monitoring?
  - What features would improve the OJT management process?
  - What security and privacy concerns should be addressed?
  - What reporting capabilities are needed for administrators?

#### 3.3.1.2 Survey Questionnaires
- **User Satisfaction Survey**: Administered after system implementation to measure user satisfaction
- **System Usability Scale (SUS)**: Standardized questionnaire for evaluating system usability
- **Feature Priority Survey**: Used to prioritize development features based on user needs

#### 3.3.1.3 Observation Checklists
- **Process Observation**: Documented current manual OJT monitoring processes
- **Workflow Analysis**: Observed how students and administrators currently handle time recording and reporting
- **Pain Point Identification**: Noted inefficiencies and bottlenecks in existing processes

#### 3.3.1.4 Document Analysis
- **Review of Existing Forms**: Analyzed current paper-based OJT forms and evaluation sheets
- **Curriculum Requirements**: Reviewed course requirements for OJT hours and evaluation criteria
- **Previous Studies**: Examined related literature on OJT monitoring systems

### 3.3.2 Development Instruments

#### 3.3.2.1 Software Development Tools
- **Version Control**: Git for source code management and collaboration
- **Issue Tracking**: Used for bug tracking and feature request management
- **Project Management**: Tools for task scheduling and progress tracking

#### 3.3.2.2 Testing Instruments
- **Test Cases**: Comprehensive test cases for all system functionalities
- **User Testing Protocols**: Structured protocols for user acceptance testing
- **Performance Metrics**: Tools for measuring system performance and response times

#### 3.3.2.3 Documentation Tools
- **Technical Documentation**: Detailed system architecture and API documentation
- **User Manuals**: Step-by-step guides for system usage
- **Developer Documentation**: Code documentation and development guidelines

## 3.4 Programming Languages and Software Used

The Web-Based OJT Monitoring System was developed using modern web technologies and development tools:

### 3.4.1 Programming Languages

#### 3.4.1.1 TypeScript
- **Version**: 5.x
- **Purpose**: Primary programming language for type-safe development
- **Usage**: Used throughout the application for both frontend and backend code
- **Benefits**: Provides static typing, improved code quality, and better developer experience

#### 3.4.1.2 JavaScript/React
- **Version**: React 19.2.8
- **Purpose**: Frontend framework for building user interfaces
- **Usage**: Component-based architecture for building responsive and interactive UIs
- **Benefits**: Component reusability, virtual DOM for performance, and rich ecosystem

### 3.4.2 Frameworks and Libraries

#### 3.4.2.1 Next.js 16.3.1
- **Purpose**: React framework for production-ready applications
- **Features Used**:
  - App Router for file-based routing
  - Server Components for improved performance
  - API Routes for backend functionality
  - Built-in optimization and caching
- **Benefits**: Full-stack capabilities, excellent performance, and SEO-friendly

#### 3.4.2.2 Prisma ORM 7.9.1
- **Purpose**: Database ORM and toolkit
- **Features Used**:
  - Type-safe database queries
  - Database schema management
  - Migration system
  - PostgreSQL adapter
- **Benefits**: Type safety, auto-completion, and simplified database operations

#### 3.4.2.3 UI Component Libraries
- **Radix UI**: Headless UI components for accessibility and customization
- **Lucide React**: Icon library for consistent iconography
- **Recharts 3.10.1**: Data visualization library for charts and graphs
- **Sonner 2.0.8**: Toast notification system

#### 3.4.2.4 Styling and Utilities
- **Tailwind CSS 4**: Utility-first CSS framework for rapid UI development
- **class-variance-authority**: Component variant management
- **clsx & tailwind-merge**: Conditional class name utilities

### 3.4.3 Database Technologies

#### 3.4.3.1 PostgreSQL
- **Purpose**: Relational database management system
- **Usage**: Primary database for storing all application data
- **Features**: ACID compliance, complex queries, and robust data integrity
- **Connection**: Managed through Prisma ORM with pg driver

#### 3.4.3.2 Database Schema Components
- **Users & Authentication**: User accounts, roles, and session management
- **Student Profiles**: Personal information and OJT details
- **DTR Records**: Daily time records with attendance tracking
- **Weekly Reports**: Accomplishment reports with activities
- **Evaluations**: OJT performance evaluation forms
- **Tasks**: Activity and task management
- **Notifications**: System notifications and announcements
- **Audit Logs**: System activity tracking

### 3.4.4 Authentication and Security

#### 3.4.4.1 Security Libraries
- **bcryptjs 3.0.3**: Password hashing for secure credential storage
- **jose 6.2.9**: JSON Web Token (JWT) implementation for session management
- **zod 4.4.3**: Schema validation for input validation and type safety

#### 3.4.4.2 Security Features
- Password hashing with bcrypt
- JWT-based session management
- Role-based access control (RBAC)
- Input validation and sanitization
- SQL injection prevention through Prisma ORM
- XSS protection through React's built-in escaping

### 3.4.5 Development Tools

#### 3.4.5.1 Package Management
- **npm**: Node Package Manager for dependency management
- **package.json**: Project configuration and dependency specification

#### 3.4.5.2 Code Quality Tools
- **ESLint 9**: JavaScript/TypeScript linting for code quality
- **TypeScript Compiler**: Type checking and compilation
- **Prettier**: Code formatting (configured through ESLint)

#### 3.4.5.3 Build Tools
- **Next.js Build System**: Optimized production builds
- **PostCSS**: CSS processing and optimization
- **Turbopack**: Fast bundling for development

### 3.4.6 PDF Generation and Export

#### 3.4.6.1 PDF Libraries
- **jsPDF 4.2.1**: PDF generation for reports and certificates
- **html2canvas 1.4.1**: HTML to canvas conversion for PDF export
- **Usage**: Generating printable DTR forms, weekly reports, and evaluation forms

### 3.4.7 Date and Time Utilities

#### 3.4.7.1 Date Libraries
- **date-fns 4.4.0**: Modern date utility library
- **Usage**: Date formatting, calculations, and manipulation for DTR and reporting

### 3.4.8 Development Environment

#### 3.4.8.1 Runtime Environment
- **Node.js**: JavaScript runtime for server-side execution
- **TypeScript Execution**: tsx for TypeScript execution during development

#### 3.4.8.2 IDE and Editor Support
- **VS Code / Windsurf**: Primary development environment
- **TypeScript Language Server**: Enhanced IDE support for TypeScript

### 3.4.9 Deployment and Hosting

#### 3.4.9.1 Deployment Considerations
- **Vercel**: Recommended deployment platform for Next.js applications
- **Environment Variables**: Secure configuration management
- **Database Hosting**: PostgreSQL database hosting (Prisma Postgres or similar)

### 3.4.10 System Architecture Summary

The system follows a modern full-stack architecture:

```
Frontend Layer:
- Next.js 16 (React 19 + TypeScript)
- Tailwind CSS 4
- Radix UI Components

Backend Layer:
- Next.js API Routes
- Prisma ORM 7
- PostgreSQL Database

Security Layer:
- JWT Authentication
- bcrypt Password Hashing
- Role-Based Access Control

Data Layer:
- PostgreSQL Database
- Prisma Migrations
- Type-safe Queries
```

## 3.5 System Development Methodology

The Web-Based OJT Monitoring System was developed using the Agile Software Development Methodology, specifically following Scrum principles adapted for academic project development.

### 3.5.1 Rationale for Agile Methodology

The Agile methodology was chosen for this project due to:

- **Iterative Development**: Allows for continuous improvement based on stakeholder feedback
- **Flexibility**: Accommodates changing requirements as understanding of user needs evolves
- **Early Delivery**: Enables delivery of working software in increments
- **Stakeholder Involvement**: Ensures continuous collaboration with users and administrators
- **Risk Mitigation**: Early identification and resolution of technical and user experience issues

### 3.5.2 Development Phases

#### 3.5.2.1 Phase 1: Inception and Planning (Weeks 1-2)
**Activities:**
- Project scope definition and objective setting
- Stakeholder identification and engagement
- Requirement gathering through interviews and surveys
- Feasibility analysis (technical, economic, operational)
- Technology stack selection and justification
- Project timeline and resource planning

**Deliverables:**
- Project charter
- Requirements specification document
- Technology selection report
- Project plan with milestones

#### 3.5.2.2 Phase 2: System Design (Weeks 3-4)
**Activities:**
- System architecture design
- Database schema design using Prisma
- UI/UX design and wireframing
- API endpoint planning
- Security architecture design
- Component structure planning

**Deliverables:**
- System architecture document
- Database schema (Prisma schema)
- UI wireframes and mockups
- API documentation
- Security design document

#### 3.5.2.3 Phase 3: Core Development Sprint 1 (Weeks 5-7)
**Activities:**
- Project setup and configuration
- Database implementation and migrations
- Authentication system development
- User management module
- Basic UI components development
- Student profile management

**Deliverables:**
- Working authentication system
- User management functionality
- Student profile module
- Basic UI component library

#### 3.5.2.4 Phase 4: Core Development Sprint 2 (Weeks 8-10)
**Activities:**
- Daily Time Record (DTR) module development
- Time-in/time-out functionality
- Attendance tracking system
- DTR history and reporting
- Admin DTR monitoring interface

**Deliverables:**
- Complete DTR module
- Time tracking functionality
- DTR reporting features
- Admin monitoring interface

#### 3.5.2.5 Phase 5: Core Development Sprint 3 (Weeks 11-13)
**Activities:**
- Weekly report module development
- Activity tracking and management
- Report submission workflow
- Admin review and approval system
- PDF generation for reports

**Deliverables:**
- Weekly report system
- Activity management features
- Report submission workflow
- PDF export functionality

#### 3.5.2.6 Phase 6: Core Development Sprint 4 (Weeks 14-16)
**Activities:**
- OJT evaluation form development
- Automated scoring system
- Task management module
- Narrative report functionality
- Notification system implementation

**Deliverables:**
- Evaluation form system
- Task management features
- Narrative report module
- Notification system

#### 3.5.2.7 Phase 7: Integration and Testing (Weeks 17-18)
**Activities:**
- System integration testing
- User acceptance testing (UAT)
- Security testing and audit
- Performance optimization
- Bug fixing and refinement

**Deliverables:**
- Integrated system
- Test reports
- Security audit results
- Performance optimization documentation

#### 3.5.2.8 Phase 8: Deployment and Training (Weeks 19-20)
**Activities:**
- Production environment setup
- System deployment
- User training for administrators
- User training for students
- Documentation finalization

**Deliverables:**
- Deployed production system
- User training materials
- Technical documentation
- User manuals

### 3.5.3 Agile Practices Implemented

#### 3.5.3.1 Iterative Development
- Development organized into 2-3 week sprints
- Each sprint delivers working functionality
- Regular sprint reviews and retrospectives
- Continuous integration of feedback

#### 3.5.3.2 Continuous Stakeholder Involvement
- Regular meetings with OJT coordinators
- Student feedback sessions during development
- Administrator input on feature prioritization
- Demo sessions at sprint ends

#### 3.5.3.3 Adaptive Planning
- Flexible sprint planning based on progress
- Priority adjustment based on stakeholder feedback
- Technical approach adaptation as needed
- Risk management through iterative delivery

#### 3.5.3.4 Quality Focus
- Continuous testing throughout development
- Code reviews and quality standards
- Security-first development approach
- Performance monitoring and optimization

### 3.5.4 Development Principles

#### 3.5.4.1 User-Centric Design
- Focus on user experience and usability
- Responsive design for various devices
- Intuitive interfaces for both admins and students
- Accessibility considerations

#### 3.5.4.2 Security-First Approach
- Security considerations from project inception
- Regular security audits and testing
- Secure coding practices
- Data protection and privacy compliance

#### 3.5.4.3 Scalability and Maintainability
- Modular architecture for easy maintenance
- Clean code principles and documentation
- Database design for future scalability
- API design for extensibility

#### 3.5.4.4 Performance Optimization
- Efficient database queries
- Optimized frontend rendering
- Caching strategies where appropriate
- Load testing and optimization

### 3.5.5 Documentation Strategy

#### 3.5.5.1 Technical Documentation
- System architecture documentation
- API documentation
- Database schema documentation
- Deployment guides

#### 3.5.5.2 User Documentation
- Administrator user manual
- Student user guide
- Quick reference guides
- FAQ documentation

#### 3.5.5.3 Development Documentation
- Code documentation and comments
- Development setup guide
- Contribution guidelines
- Change log documentation

### 3.5.6 Quality Assurance Process

#### 3.5.6.1 Testing Strategy
- Unit testing for individual components
- Integration testing for module interactions
- System testing for end-to-end functionality
- User acceptance testing for validation

#### 3.5.6.2 Code Quality Standards
- ESLint configuration for code quality
- TypeScript strict mode for type safety
- Code review process
- Continuous integration setup

#### 3.5.6.3 Security Measures
- Regular security audits
- Penetration testing
- Dependency vulnerability scanning
- Secure coding guidelines

### 3.5.7 Project Management Approach

#### 3.5.7.1 Sprint Planning
- Feature prioritization based on user value
- Effort estimation and capacity planning
- Risk assessment and mitigation
- Sprint goal definition

#### 3.5.7.2 Progress Tracking
- Regular sprint reviews
- Burndown charts for progress monitoring
- Issue tracking for bugs and features
- Milestone tracking

#### 3.5.7.3 Communication
- Regular stakeholder updates
- Demo sessions for feedback
- Documentation of decisions
- Change management process

## 3.6 Endnotes

### 3.6.1 Limitations of the Study

The research and development of the Web-Based OJT Monitoring System encountered several limitations:

#### 3.6.1.1 Technical Limitations
- **Internet Dependency**: The system requires internet connectivity for full functionality, which may be challenging in areas with unstable connections
- **Browser Compatibility**: While designed for modern browsers, older browser versions may not support all features
- **Mobile Optimization**: While responsive, the mobile experience may have limitations compared to desktop
- **Scalability Constraints**: Current architecture may require optimization for very large-scale deployments (1000+ concurrent users)

#### 3.6.1.2 Resource Limitations
- **Development Time**: Academic project timeline limited comprehensive testing across all potential use cases
- **Testing Sample Size**: Beta testing involved limited number of users, may not capture all edge cases
- **Hardware Resources**: Development and testing conducted on limited hardware configurations

#### 3.6.1.3 Scope Limitations
- **Single Institution Focus**: System designed specifically for CCDI Sorsogon's requirements
- **Integration Limitations**: Limited integration with external systems (HR systems, LMS platforms)
- **Language Support**: Currently only supports English language interface

### 3.6.2 Ethical Considerations

#### 3.6.2.1 Data Privacy and Protection
- **Student Data Protection**: All student personal information and OJT records are protected through encryption and access controls
- **Compliance**: System designed with consideration for data protection regulations
- **Informed Consent**: Participants in testing provided informed consent for system evaluation
- **Data Minimization**: Only necessary data collected and stored for system functionality

#### 3.6.2.2 Security Considerations
- **Access Control**: Strict role-based access control implemented
- **Audit Trail**: Comprehensive audit logging for accountability
- **Secure Development**: Security-first approach throughout development
- **Regular Updates**: Commitment to security updates and patches

#### 3.6.2.3 Academic Integrity
- **Original Development**: System developed as original work with proper attribution to libraries and frameworks used
- **Proper Citation**: All referenced materials, libraries, and documentation properly cited
- **Collaboration Guidelines**: Clear guidelines for collaboration and contribution

### 3.6.3 Recommendations for Future Enhancement

#### 3.6.3.1 Feature Enhancements
- **Mobile Application**: Development of native mobile applications for iOS and Android
- **Offline Mode**: Implementation of offline functionality for areas with limited connectivity
- **Advanced Analytics**: Enhanced reporting and business intelligence features
- **Integration Capabilities**: API development for integration with other institutional systems
- **Multi-language Support**: Implementation of multi-language interface options

#### 3.6.3.2 Technical Improvements
- **Performance Optimization**: Further optimization for large-scale deployments
- **Advanced Security**: Implementation of additional security features (2FA, SSO)
- **Cloud Architecture**: Migration to cloud-native architecture for better scalability
- **AI Integration**: Integration of AI-powered features for predictive analytics and recommendations

#### 3.6.3.3 Research Extensions
- **Longitudinal Study**: Long-term study on system impact on OJT program outcomes
- **Comparative Analysis**: Comparison with other OJT monitoring systems
- **User Experience Research**: Deeper UX research and usability improvements
- **Cost-Benefit Analysis**: Comprehensive analysis of system benefits vs. implementation costs

### 3.6.4 Conclusion

The Web-Based OJT Monitoring System represents a significant improvement over manual OJT management processes. Through the application of modern web technologies, Agile development methodology, and user-centered design principles, the system addresses the key challenges faced by CCDI Sorsogon in managing their OJT program.

The systematic approach to research methodology, from requirements gathering through deployment, ensures that the system meets the actual needs of its users while maintaining high standards of security, performance, and usability. The use of contemporary technologies like Next.js 16, Prisma ORM, and PostgreSQL provides a solid foundation for current operations and future enhancements.

The methodology employed in this study serves as a model for similar educational institutions seeking to modernize their OJT management systems, demonstrating how technology can effectively address administrative challenges while improving the overall experience for both students and administrators.

---

**Note**: This Chapter 3 Research Methodology document is comprehensive and covers all the sections outlined in your requirements. You may need to adjust specific details (dates, numbers, institutional specifics) to match your actual project implementation and timeline.