# CHANGELOG

All notable changes to this backend project will be documented in this file.

## [Unreleased]
## Week of 11.11.2024
### Added
- User functionality: Add favorite workers (SCRUM 45)
- Changed user.schema.
- Changed findUser such that it displays now favorite workers for each user.
- Created API `/add-favorite/:id`.

### Merged
- Merge pull request #36 from victoriaaa111 (SCRUM 45).

---

## Study Process (October 2024 - November 2024)
### Research and Skill Development
- **SSL Certificates**: Studied and researched SSL certificates to enhance security protocols. (https://medium.com/@m.fareed607/how-to-set-up-an-nginx-reverse-proxy-server-and-enable-https-with-certbot-bbab9feb6338, https://www.digitalocean.com/community/tutorials/how-to-create-a-self-signed-ssl-certificate-for-nginx-on-centos-7#step-1-create-the-ssl-certificate)
- **Coding Skills Improvement**: Completed various courses on Udemy to improve backend development skills.
- **Advanced Git Course**: Completed an advanced course on Gitflow Workflow (https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow).
- **Midterm Report**: Enhanced the quality and structure of the midterm report.
- **Market Research**: Conducted further market research to better understand target audiences and requirements.

## Week of 23.09.2024
### Added
- Admin functionality: retrieve orders, change status, and reschedule orders (SCRUM 47).
- Reviews functionality: edit rating review, delete review, and retrieve workers with no ratings (SCRUM 7).
- Retrieve all reviews for a worker.

### Fixed
- Fixed bug in guards.
- Resolved bug with `accessToken`.

### Merged
- Merge pull requests #34, #33, and #32 from victoriaaa111 (SCRUM 47, SCRUM 7).
- Merge pull request #31 and #30: fixed guards bug and updated `refreshToken` API for all user types, guarded all routes with auth.

---

## Week of 16.09.2024
### Added
- Auth guard for admin APIs.
- SSL certificate integration for enhanced security.
- Duplicate service prevention for the same worker.
- Retrieve orders excluding canceled or declined orders.
- Periodic calculation of worker ratings (every Sunday).
- API for users to add reviews, retrieve worker availability, and cancel orders.
- Workers can now change the status of an order (SCRUM 60).
- Retrieve and display orders for improved order management (SCRUM 58).
- `createOrder` functionality added; replaced `username` with `uniqueId` for workers/users.

### Changed
- Modified service search route from `POST` to `GET`.
- Reorganized service search functionality with service type, rating, and combined search options.

### Fixed
- Checked non-empty fields for updates to worker/service.
- Fixed `serviceId` alignment issue when retrieving a worker.

### Merged
- Merge pull requests #29, #28, #27, #26, and #25 from victoriaaa111 (SCRUM 56, SCRUM 61, SCRUM 32).
- Merge pull requests #24, #22, and #21: resolved rating calculation and bug fixes for serviceId, periodic rating updates.

---

## Week of 09.09.2024
### Added
- CI/CD workflow for build and deploy to EC2 instance.
- Adjusted port mapping to match app requirements.
- Password management functions: change, forgot, and reset password for users/workers/admins.
- Ability to activate/deactivate users/workers and retrieve all users/workers.
- Worker signup and updated authentication for admin.
- Profile retrieval and functions to add/delete services.
- Admin login functionality.
- CORS support for frontend.

### Changed
- Modified JSON structure for `findOne` with additional signup details.

### Merged
- Merge pull requests #13, #12, #11, #10, #9, and #8 from victoriaaa111 (SCRUM 18, SCRUM 51).
- Merge pull requests #7 and #6: added worker signup, profile retrieval, and authentication process improvements.

---

## Week of 02.09.2024
### Initial Release
- Initial project setup and commit with core backend functionalities:
    - Admin login.
    - Authentication and authorization setup.
    - Forgot, reset, and change password functionalities.
- Added Server 

### Merged
- Merge pull requests #5, #4, and #3 from victoriaaa111: added server, CORS, and initial authentication setup.

---

## 01.09.2024
### Initial Commit
- Initial setup of the project structure.
- First commits and basic server setup.
