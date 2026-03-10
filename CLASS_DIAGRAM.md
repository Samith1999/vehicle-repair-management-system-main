# Vehicle Repair Management System - Class Diagram

## Class Diagram

```mermaid
classDiagram
    class Officer {
        +int id
        +string name
        +string email
        +string password
        +Role role
        +timestamp created_at
        --
        +getRepairRequests()
        +updateStatus()
        +approveRepair()
        +rejectRepair()
    }

    class Vehicle {
        +int id
        +string registration_number
        +string vehicle_type
        +string hospital_name
        +Status current_status
        +timestamp created_at
        --
        +getRepairHistory()
        +updateStatus()
        +getPendingRepairs()
    }

    class RepairRequest {
        +int id
        +int vehicle_id
        +int engineer_id
        +string repair_details
        +date inspection_date
        +string engineer_signature
        +RequestStatus status
        +timestamp created_at
        --
        +submitForInspection()
        +sendToOfficer()
        +sendToRDHS()
        +approve()
        +reject()
        +getStatusHistory()
    }

    class StatusUpdate {
        +int id
        +int repair_request_id
        +int officer_id
        +string status
        +string comments
        +timestamp updated_at
        --
        +addComment()
        +updateStatus()
    }

    class User {
        <<interface>>
        +authenticate()
        +viewDashboard()
    }

    class Engineer {
        +submitRepairRequest()
        +signOff()
    }

    class SubjectOfficer {
        +reviewRequest()
        +forwardToRDHS()
    }

    class RDHSDirector {
        +approveRequest()
        +rejectRequest()
    }

    class Admin {
        +manageUsers()
        +generateReports()
        +systemSettings()
    }

    %% Relationships
    Officer "1" --> "*" RepairRequest : handles
    Officer "1" --> "*" StatusUpdate : creates
    Vehicle "1" --> "*" RepairRequest : subject_of
    RepairRequest "1" --> "*" StatusUpdate : has
    
    %% Role inheritance
    Officer --|> User
    Engineer --|> Officer
    SubjectOfficer --|> Officer
    RDHSDirector --|> Officer
    Admin --|> Officer

    %% Enumerations
    class Role {
        <<enumeration>>
        ENGINEER
        SUBJECT_OFFICER
        RDHS
        ADMIN
    }

    class Status {
        <<enumeration>>
        OPERATIONAL
        UNDER_REPAIR
        REPAIRED
        APPROVED
    }

    class RequestStatus {
        <<enumeration>>
        PENDING
        INSPECTION_COMPLETED
        SENT_TO_OFFICER
        SENT_TO_RDHS_DIRECTOR
        APPROVED
        REJECTED
    }
```

## Key Relationships

### One-to-Many (1:*)
- **Officer → RepairRequest**: One officer handles multiple repair requests
- **Officer → StatusUpdate**: One officer creates multiple status updates
- **Vehicle → RepairRequest**: One vehicle can have multiple repair requests
- **RepairRequest → StatusUpdate**: One repair request has multiple status updates

### Inheritance
- **Engineer**, **SubjectOfficer**, **RDHSDirector**, **Admin** inherit from **Officer**
- All user roles implement the **User** interface

## Entity Descriptions

### Officer
The base class for all system users. Contains authentication and role-based operations.
- **Attributes**: id, name, email, password, role, created_at
- **Methods**: getRepairRequests(), updateStatus(), approveRepair(), rejectRepair()

### Vehicle
Represents vehicles in the fleet undergoing repair management.
- **Attributes**: id, registration_number, vehicle_type, hospital_name, current_status, created_at
- **Methods**: getRepairHistory(), updateStatus(), getPendingRepairs()

### RepairRequest
The core workflow entity tracking the complete repair lifecycle.
- **Attributes**: id, vehicle_id, engineer_id, repair_details, inspection_date, engineer_signature, status, created_at
- **Methods**: submitForInspection(), sendToOfficer(), sendToRDHS(), approve(), reject(), getStatusHistory()

### StatusUpdate
Maintains an audit trail of all changes to repair requests with officer comments.
- **Attributes**: id, repair_request_id, officer_id, status, comments, updated_at
- **Methods**: addComment(), updateStatus()

### User Roles
- **Engineer**: Submits repair requests and provides technical assessments
- **SubjectOfficer**: Reviews requests and forwards to RDHS
- **RDHSDirector**: Makes final approval/rejection decisions
- **Admin**: System-wide management, user management, and reporting
