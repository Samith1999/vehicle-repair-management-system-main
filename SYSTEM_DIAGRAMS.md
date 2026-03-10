# Vehicle Repair Management System - UML & Database Diagrams

## 1. Entity-Relationship (ER) Diagram

```mermaid
erDiagram
    OFFICERS ||--o{ REPAIR_REQUESTS : creates
    OFFICERS ||--o{ STATUS_UPDATES : updates
    VEHICLES ||--o{ REPAIR_REQUESTS : submits
    REPAIR_REQUESTS ||--o{ STATUS_UPDATES : tracks

    OFFICERS {
        int id PK
        string name
        string email UK
        string password
        enum role "engineer|subject_officer|rdhs|admin"
        timestamp created_at
    }

    VEHICLES {
        int id PK
        string registration_number UK
        string vehicle_type
        string hospital_name
        enum current_status "operational|under_repair|repaired|approved"
        timestamp created_at
    }

    REPAIR_REQUESTS {
        int id PK
        int vehicle_id FK
        int engineer_id FK
        text repair_details
        date inspection_date
        string engineer_signature
        enum status "pending|inspection_completed|sent_to_officer|sent_to_rdhs_director|approved|rejected"
        timestamp created_at
    }

    STATUS_UPDATES {
        int id PK
        int repair_request_id FK
        int officer_id FK
        string status
        text comments
        timestamp updated_at
    }
```

---

## 2. Use Case Diagram

```mermaid
graph TB
    subgraph Users
        Engineer["👨‍🔧 Engineer"]
        Officer["👮 Subject Officer"]
        RDHS["📊 RDHS Director"]
        Admin["👨‍💼 Admin"]
    end

    subgraph System["Vehicle Repair Management System"]
        UC1["Submit Repair Request"]
        UC2["Inspect Vehicle"]
        UC3["Sign Inspection Report"]
        UC4["Review & Approve"]
        UC5["Forward to Officer"]
        UC6["Forward to RDHS"]
        UC7["Manage Users"]
        UC8["Manage Vehicles"]
        UC9["View Reports"]
        UC10["View Dashboard"]
        UC11["Track Status"]
        UC12["Update Status"]
    end

    Engineer -->|uses| UC1
    Engineer -->|uses| UC2
    Engineer -->|uses| UC3
    Engineer -->|uses| UC10
    Engineer -->|uses| UC11

    Officer -->|uses| UC4
    Officer -->|uses| UC5
    Officer -->|uses| UC10
    Officer -->|uses| UC11

    RDHS -->|uses| UC6
    RDHS -->|uses| UC9
    RDHS -->|uses| UC10

    Admin -->|uses| UC7
    Admin -->|uses| UC8
    Admin -->|uses| UC10
    Admin -->|uses| UC12
```

---

## 3. Class Diagram

```mermaid
classDiagram
    class Officer {
        -int id
        -String name
        -String email
        -String password
        -Role role
        -DateTime createdAt
        +login(email, password)
        +getRole()
        +updateProfile()
    }

    class Role {
        <<enumeration>>
        ENGINEER
        SUBJECT_OFFICER
        RDHS
        ADMIN
    }

    class Vehicle {
        -int id
        -String registrationNumber
        -String vehicleType
        -String hospitalName
        -Status currentStatus
        -DateTime createdAt
        +updateStatus(status)
        +getDetails()
    }

    class VehicleStatus {
        <<enumeration>>
        OPERATIONAL
        UNDER_REPAIR
        REPAIRED
        APPROVED
    }

    class RepairRequest {
        -int id
        -int vehicleId
        -int engineerId
        -String repairDetails
        -Date inspectionDate
        -String engineerSignature
        -RepairStatus status
        -DateTime createdAt
        +submitRequest()
        +updateStatus(newStatus)
        +getHistory()
        +approve()
        +reject()
    }

    class RepairStatus {
        <<enumeration>>
        PENDING
        INSPECTION_COMPLETED
        SENT_TO_OFFICER
        SENT_TO_RDHS_DIRECTOR
        APPROVED
        REJECTED
    }

    class StatusUpdate {
        -int id
        -int repairRequestId
        -int officerId
        -String status
        -String comments
        -DateTime updatedAt
        +recordUpdate(comments)
        +getTimeline()
    }

    Officer --> Role
    Vehicle --> VehicleStatus
    RepairRequest --> RepairStatus
    RepairRequest --> Vehicle
    RepairRequest --> Officer
    StatusUpdate --> RepairRequest
    StatusUpdate --> Officer
```

---

## 4. Sequence Diagram - Repair Request Workflow

```mermaid
sequenceDiagram
    participant Engineer as Engineer
    participant System as System
    participant Database as Database
    participant Officer as Subject Officer
    participant RDHS as RDHS Director

    Engineer->>System: 1. Login
    System->>Database: Verify credentials
    Database-->>System: User data
    System-->>Engineer: Authentication token

    Engineer->>System: 2. Select Vehicle & Submit Repair Request
    System->>Database: Create repair request (status: pending)
    Database-->>System: Request ID
    System-->>Engineer: Confirmation

    Engineer->>System: 3. Perform Inspection
    System->>Database: Update inspection date
    Database-->>System: Updated
    System-->>Engineer: Inspection recorded

    Engineer->>System: 4. Sign Inspection Report
    System->>Database: Update status to inspection_completed
    System->>Database: Record engineer signature
    Database-->>System: Confirmed
    System-->>Engineer: Report signed

    System->>Officer: 5. Notify - Repair ready for review
    Officer->>System: 6. Login & Review Request
    System->>Database: Fetch repair request details
    Database-->>Officer: Repair details & inspection report

    Officer->>System: 7. Add Comments & Forward to RDHS
    System->>Database: Update status to sent_to_rdhs_director
    System->>Database: Create status update record
    Database-->>System: Updated
    System-->>Officer: Forwarded successfully

    System->>RDHS: 8. Notify - Repair awaiting approval
    RDHS->>System: 9. Login & Review
    System->>Database: Fetch complete repair history
    Database-->>RDHS: All repair & status updates

    alt Repair Approved
        RDHS->>System: 10a. Approve Repair
        System->>Database: Update status to approved
        System->>Database: Record approval comments
        Database-->>System: Confirmed
        System-->>RDHS: Approval recorded
        System->>Database: Update vehicle status to approved
        System->>Engineer: Send approval notification
        System->>Officer: Send approval notification
    else Repair Rejected
        RDHS->>System: 10b. Reject Repair
        System->>Database: Update status to rejected
        System->>Database: Record rejection reason
        Database-->>System: Updated
        System->>Engineer: Send rejection notification
    end
```

---

## 5. Business Process Diagram - Repair Request Workflow (CORRECTED)

```mermaid
graph TD
    Start([Vehicle needs repair]) --> CreateReq["📝 Engineer Creates<br/>Repair Request<br/><br/>Status: PENDING"]
    
    CreateReq --> Inspect["🔍 Engineer Inspects<br/>Vehicle"]
    
    Inspect --> DocDetails["📄 Document Repair<br/>Details & Findings"]
    
    DocDetails --> Sign["✍️ Engineer Signs<br/>Inspection Report<br/><br/>Status: INSPECTION_COMPLETED"]
    
    Sign --> OfficerNotif["🔔 System Notifies<br/>Subject Officer"]
    
    OfficerNotif --> OfficerReview["👮 Subject Officer<br/>Reviews Complete Report<br/><br/>Status: SENT_TO_OFFICER"]
    
    OfficerReview --> OfficerDecide{Officer<br/>Reviews &<br/>Forwards?}
    
    OfficerDecide -->|Rejects| RejectOfficer["❌ Reject Repair<br/>Status: REJECTED"]
    OfficerDecide -->|Approves & Forwards| ToRDHS["➡️ Forward to<br/>RDHS Director<br/><br/>Status: SENT_TO_RDHS_DIRECTOR"]
    
    RejectOfficer --> RejectEnd1(["❌ Repair Rejected<br/>by Officer"])
    
    ToRDHS --> RDHSNotif["🔔 System Notifies<br/>RDHS Director"]
    
    RDHSNotif --> RDHSReview["📊 RDHS Reviews<br/>Complete Request<br/>& Officer Comments"]
    
    RDHSReview --> RDHSDecide{RDHS<br/>Approves?}
    
    RDHSDecide -->|Rejects| RejectRDHS["❌ Reject Repair<br/>Status: REJECTED"]
    RDHSDecide -->|Approves| Approve["✅ Approve Repair<br/>Status: APPROVED"]
    
    RejectRDHS --> RejectEnd2(["❌ Repair Rejected<br/>by RDHS Director"])
    
    Approve --> UpdateVehicle["🚗 Update Vehicle<br/>Status to APPROVED"]
    
    UpdateVehicle --> NotifyAll["📬 Notify Engineer<br/>& Subject Officer"]
    
    NotifyAll --> End(["✅ Repair Process<br/>Completed & Approved"])
    
    style Start fill:#e1f5ff
    style End fill:#c8e6c9
    style RejectEnd1 fill:#ffcdd2
    style RejectEnd2 fill:#ffcdd2
    style Approve fill:#a5d6a7
    style RejectOfficer fill:#ef9a9a
    style RejectRDHS fill:#ef9a9a
    style Sign fill:#fff9c4
    style OfficerReview fill:#f0f4c3
    style RDHSReview fill:#ffe0b2
```

---

## 6. State Diagram - Repair Request Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Pending: Create Request

    Pending --> InspectionCompleted: Inspection Done
    Pending --> Pending: Add Details

    InspectionCompleted --> SentToOfficer: Engineer Signs
    InspectionCompleted --> Pending: Re-evaluate

    SentToOfficer --> SentToRDHS: Officer Approves
    SentToOfficer --> Rejected: Officer Rejects

    SentToRDHS --> Approved: RDHS Approves
    SentToRDHS --> Rejected: RDHS Rejects
    SentToRDHS --> SentToOfficer: Feedback Required

    Approved --> [*]: Completed
    Rejected --> [*]: Completed

    note right of Pending
        Awaiting inspection
        and initial details
    end note

    note right of InspectionCompleted
        Inspection finished
        ready for approval
    end note

    note right of SentToOfficer
        Subject Officer reviewing
    end note

    note right of SentToRDHS
        RDHS Director reviewing
    end note

    note right of Approved
        Repair approved by all
        Vehicle can proceed
    end note

    note right of Rejected
        Rejected by Officer or RDHS
        Reason recorded
    end note
```

---

## 7. Activity Diagram - Engineer Workflow

```mermaid
graph TD
    Start([Start Shift]) --> Login["🔐 Login to System"]
    
    Login --> Dashboard["📊 View Engineer<br/>Dashboard"]
    
    Dashboard --> CheckRepairs["✅ Check Pending<br/>Repair Requests"]
    
    CheckRepairs --> HasRequests{Repair<br/>Requests?}
    
    HasRequests -->|No| Idle["⏳ Wait for<br/>New Requests"]
    HasRequests -->|Yes| SelectRepair["🔍 Select Repair<br/>Request"]
    
    SelectRepair --> Review["📋 Review Vehicle<br/>Details"]
    
    Review --> Inspect["🔧 Inspect Vehicle"]
    
    Inspect --> Document["📝 Document Issues<br/>& Findings"]
    
    Document --> Photos["📸 Add Photos/Evidence"]
    
    Photos --> Details["✏️ Enter Repair<br/>Details"]
    
    Details --> Estimate["💰 Provide Cost<br/>Estimate"]
    
    Estimate --> Signature["✍️ Digital Signature"]
    
    Signature --> Submit["📤 Submit Report<br/>for Review"]
    
    Submit --> Notify["🔔 System Notifies<br/>Subject Officer"]
    
    Notify --> Checklist{More<br/>Repairs?}
    
    Checklist -->|Yes| CheckRepairs
    Checklist -->|No| Idle
    
    Idle --> CheckRepairs
    
    style Start fill:#e3f2fd
    style Login fill:#bbdefb
    style Inspect fill:#81c784
    style Submit fill:#ffb74d
    style Notify fill:#64b5f6
```

---

## System Overview

### Database Tables

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| **OFFICERS** | User management | id, name, email, role, created_at |
| **VEHICLES** | Vehicle inventory | id, registration_number, vehicle_type, hospital_name, current_status |
| **REPAIR_REQUESTS** | Repair request tracking | id, vehicle_id, engineer_id, repair_details, status |
| **STATUS_UPDATES** | Repair history tracking | id, repair_request_id, officer_id, status, comments |

### User Roles & Permissions

| Role | Permissions |
|------|-------------|
| **Engineer** | Submit repairs, Inspect vehicles, Sign reports, View own repairs |
| **Subject Officer** | Review repairs, Approve/Reject, Forward to RDHS, View reports |
| **RDHS Director** | Final approval/rejection, View analytics, Generate reports |
| **Admin** | Manage users, Manage vehicles, System configuration |

### Repair Status Workflow

```
PENDING → INSPECTION_COMPLETED → SENT_TO_OFFICER → SENT_TO_RDHS_DIRECTOR → APPROVED ✅
                                                                          ✗ REJECTED ❌
```

