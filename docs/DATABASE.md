# Database Design

MongoDB with Mongoose. Nine collections.

## Collections & relationships

```
User (1) ── (1) StudentProfile
User (1) ── (1) AlumniProfile
User (1) ── (*) Notification
User (1) ── (*) Application      [as student]
User (1) ── (*) Job              [as postedBy]
User (1) ── (*) Event            [as organizer]
User (1) ── (*) MentorshipRequest[as student or alumni]

Company (1) ── (*) Job
Job     (1) ── (*) Application
Event   (*) ── (1) Company
```

## Schemas

### User
| Field | Type | Notes |
|-------|------|-------|
| name | String | required |
| email | String | required, unique, lowercase |
| password | String | bcrypt-hashed, `select: false` |
| role | String | `student` \| `alumni` \| `admin` |
| phone, avatar | String | |
| isApproved | Boolean | alumni must be approved by admin |
| isActive | Boolean | soft-disable accounts |
| lastLoginAt | Date | |

### StudentProfile
`user` (ref User, unique), `rollNo`, `department`, `degree`, `batch` (grad
year), `cgpa`, `backlogs`, `skills[]`, `about`, `resumeUrl`, `github`,
`linkedin`, `placedAt` (ref Job).
Index: `{ department, batch }`.

### AlumniProfile
`user` (ref User, unique), `graduationYear`, `department`, `company`,
`designation`, `location`, `experienceYears`, `skills[]`, `bio`, `linkedin`,
`isMentor`, `mentoringDomains[]`.
Index: `{ company, department, graduationYear }`.

### Company
`name` (unique), `website`, `industry`, `description`, `logo`, `location`,
`createdBy` (ref User).

### Job
`title`, `company` (ref Company), `type` (`fulltime` \| `internship`),
`description`, `responsibilities[]`, `location`, `workMode`
(`onsite`/`remote`/`hybrid`), `ctc` (LPA or monthly stipend), `skills[]`,
`openings`, `eligibility { minCGPA, maxBacklogs, departments[], batches[] }`,
`deadline`, `postedBy` (ref User), `postedByRole`, `isReferral`, `status`
(`open`/`closed`), `applicantsCount`.
Text index on `title, description, skills`.

### Application
`student` (ref User), `job` (ref Job), `resumeUrl`, `coverLetter`, `status`
(`applied`/`shortlisted`/`interview`/`selected`/`rejected`/`withdrawn`),
`timeline [{ status, note, at, by }]`.
Unique index `{ student, job }` — one application per job per student.

### MentorshipRequest
`student` (ref User), `alumni` (ref User), `topic`, `message`, `status`
(`pending`/`accepted`/`declined`/`completed`), `scheduledAt`, `response`.

### Event
`title`, `description`, `type` (`drive`/`webinar`/`workshop`/`reunion`/`other`),
`date`, `endDate`, `location`, `mode` (`online`/`offline`), `meetingLink`,
`organizer` (ref User), `company` (ref Company), `registrations[]` (ref User),
`isPublished`.

### Notification
`user` (ref User), `title`, `message`, `type`
(`application`/`job`/`mentorship`/`event`/`system`), `link`, `read`.
Index `{ user, read }`.

## Entity-Relationship (textual)

```
STUDENT ──has one──► STUDENT_PROFILE ──placed via──► JOB
ALUMNI  ──has one──► ALUMNI_PROFILE
USER    ──posts────► JOB ──belongs to──► COMPANY
STUDENT ──submits──► APPLICATION ──for──► JOB
STUDENT ──requests─► MENTORSHIP_REQUEST ──from──► ALUMNI
USER    ──receives─► NOTIFICATION
USER    ──organizes► EVENT ──at──► COMPANY
```

## Indexing summary
- `User.email` — unique login lookup
- `Application { student, job }` — unique, prevents duplicate applications
- `Job` text index — keyword search
- `StudentProfile { department, batch }`, `AlumniProfile { company, department, graduationYear }` — filtered listings
- `Notification { user, read }` — fast unread queries
