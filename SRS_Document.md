# Software Requirements Specification (SRS)

## Project: AdVantage AI — Campaign Management System
**Version:** 1.0.0  
**Prepared For:** Apex Global Digital  
**Technologies:** MongoDB, Express, React, Node.js, Pollinations AI, Chart.js  
**Date:** July 11, 2026  
**Document Status:** Approved / Complete  

---

## 1. Project Overview

**AdVantage AI** is a premium full-stack AI Marketing Campaign Management System designed to streamline marketing operations, automate social media copy generation, and manage multichannel campaign metrics. The system utilizes a Glassmorphism design aesthetic built on standard web technologies (MongoDB, Express, React, Node.js) to deliver a high-converting, reactive, and visually exceptional interface.

### Core Business Objectives:
*   **Dynamic Campaign Administration:** Track and configure budgets, dates, objectives, and channel allocations in real-time.
*   **AI Copywriting Assist:** Instantly draft social media captions and HTML email templates matching specific campaign contexts.
*   **Consolidated Analytics:** Graphically monitor engagement rates, ROI spreads, and customer acquisition splits.

---

## 2. System Workflow & Data Pipeline

The system coordinates data streams among React front-end components, the Express backend, MongoDB database streams, and external LLM endpoints for content creation. The diagram below illustrates this data flow:

```
+-------------------------------------------------------------------------+
|                         1. REACT USER INTERFACE                         |
|  (Sidebar Navigation, Dashboard, Form States, Live HTML Email Preview)  |
+------------------------------------+------------------------------------+
                                     | (API calls / JSON)
                                     v
+------------------------------------+------------------------------------+
|                      2. EXPRESS BACKEND SERVER                          |
|          (REST API Routes, Controller Logic, Cors Middleware)           |
+-----------------+----------------------------------+--------------------+
                  |                                  | 
                  | (Mongoose ORM)                   | (External Fetch)
                  v                                  v
+-----------------+------------------+   +-----------+--------------------+
|        3. MONGODB DATABASE         |   |    4. POLLINATIONS AI API      |
|  (Campaigns, Posts, Profile, Logs) |   | (Social Media Copy Generation) |
+------------------------------------+   +--------------------------------+
```

### Workflow Description:
1.  **User Trigger:** The User initiates an action on the React UI (e.g., clicks "Generate with AI" in the Post Creator).
2.  **API Routing:** The UI sends a query or payload to the Express API backend, or triggers an external call to Pollinations AI API.
3.  **Data Synchronization:** Upon processing, the backend stores state configurations (Campaign variables, published Posts, user Profile data, and Audit log details) in MongoDB.
4.  **Audit Logs & Notifications:** Audit logs and notifications are automatically pushed to update dashboard feeds and notification bells on the fly.

---

## 3. Detailed Module Specifications

### 3.1 Dashboard Module
Serves as the main operational control room. Displays system metrics (Total Campaigns, Active Campaigns, AI/Post Assets generated, Estimated ROI), visual trend lines (Weekly Conversions & Clicks via Chart.js), recent audit log activities, and top-performing campaigns roster.

### 3.2 Campaign Manager
Supports full CRUD capabilities for marketing pipelines. Users can assign budgets, target schedules, ROI benchmarks, objectives (e.g., Lead Generation), and toggle active channels. All configurations are synced automatically with MongoDB.

### 3.3 AI Post Creator
Facilitates drafting social media posts. Features platform-specific options (Instagram, Facebook, LinkedIn, Twitter, Email), dynamic image URL mapping, and a "Generate with AI" action that leverages LLM context (Pollinations AI) to instantly compose captions, hashtags, and formatting based on the post title and theme.

### 3.4 Email Creator
Compiles marketing templates (Promotional, Welcome Onboarding, Product Launch). Dynamically compiles brand name and discount values directly within HTML email bodies, displaying a live rendering container for sandbox validation.

### 3.5 Analytics Board
Analyzes multi-dimensional metrics. Uses Chart.js to render User Engagement trends, Acquisition Channel distributions (Polar Area), and Campaign Budget vs ROI ratios.

### 3.6 Audit / History Log
Maintains a complete historical timeline of modifications. Automatically tracks category classifications (campaign, ai-content, post, profile) alongside timestamps and descriptions. Includes search and query filter controls.

### 3.7 Profile Settings
Manages corporate metadata, user credentials, and base64-encoded profile picture assets. Automatically syncs user credentials with header profile menus and topbar components dynamically.

### 3.8 Theme / Notification Systems
Includes a dark/light mode toggle in the sidebar and a topbar Notification center that monitors database updates and provides alerts for user actions.

---

## 4. Database Schema Configurations

The MongoDB architecture consists of five core collections represented below with their schema constraints:

### 4.1 Campaign Schema
| Field Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `name` | String | Yes | Title of the campaign |
| `objective` | String | Yes | Lead Gen, Conversion, Awareness |
| `status` | String | No | Default: 'Active' |
| `budget` | Number | Yes | Campaign allocation amount |
| `roi` | Number | No | Default: 0 |
| `startDate` | String | Yes | Format: YYYY-MM-DD |
| `endDate` | String | Yes | Format: YYYY-MM-DD |
| `channels` | Array [String] | No | Target media channels |

### 4.2 Post Schema
| Field Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `title` | String | Yes | Post title / theme |
| `platform` | String | Yes | Instagram, Facebook, etc. |
| `content` | String | Yes | Body caption text |
| `imageUrl` | String | No | Unsplash/static link |
| `publishedAt`| Date | No | Default: Date.now |

### 4.3 Profile Schema
| Field Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `name` | String | Yes | User's full name |
| `email` | String | Yes | User's email |
| `company` | String | Yes | Associated company name |
| `phone` | String | No | Contact number |
| `industry` | String | No | Business domain |
| `avatar` | String | No | Base64 string or Unsplash URL |

### 4.4 Notification Schema
| Field Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `title` | String | Yes | Notification title |
| `text` | String | Yes | Detailed description |
| `type` | String | No | success, info, error |
| `unread` | Boolean | No | Default: true |

### 4.5 History Schema
| Field Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `action` | String | Yes | Event description |
| `category` | String | Yes | campaign, post, profile, email |
| `details` | String | Yes | Audited event details |

---

## 5. Non-Functional Requirements

*   **Security:** Passwords and custom user profiles are processed locally. Inputs are validated on the Express layer to safeguard MongoDB collections against injection vectors.
*   **Performance:** Vite compilation renders application resources in under 1.5 seconds. Asynchronous database lookups and non-blocking external API calls to Pollinations AI avoid UI freezes during generation.
*   **Reliability:** The application features automated offline fallbacks for copy generation. If the external LLM times out or internet connectivity drops, local template generators immediately trigger so users face zero workflow downtime.
*   **Usability:** Follows glassmorphism principles using tailwind utilities, fluid responsive configurations down to 320px screen widths, visual feedback cues (toasts, loaders, badges), and simple Dark/Light theme toggles.
