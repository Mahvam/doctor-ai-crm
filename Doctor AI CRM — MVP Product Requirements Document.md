# **Doctor AI CRM — MVP Product Requirements Document**

---

## **What We're Building**

A simple, lightweight AI-powered CRM web app. You manage your contacts and leads, and an AI chat assistant can create, read, update, and delete records for you by talking to it.

---

## **Tech Stack**

* **Frontend:** React \+ Vite \+ Tailwind CSS  
* **AI Brain:** OpenRouter API  
* **Data Storage:** Local JSON file (no database needed for MVP)  
* **Colors:** Dark navy background, gold accents  
* **Deployment:** Railway (later)

---

## **The 4 Screens**

**1\. Contacts List** A table showing all your contacts. Each row has name, email, phone, company, and status (Lead, Active, Closed). Buttons to add, edit, or delete any contact.

**2\. Add / Edit Contact Form** A simple form with these fields only: Name, Email, Phone, Company, Status, and Notes. Save and Cancel buttons. That's it.

**3\. Contact Detail View** Click a contact to see all their info on one clean page. Shows their full record and their conversation history with the AI.

**4\. AI Chat Panel** A chat window (sidebar or bottom panel) that is always accessible. You type or speak a command and the AI handles it.

---

## **What the AI Can Do (CRUD by Chat)**

| You Say | What Happens |
| ----- | ----- |
| "Add a new lead named Maria Lopez from Acme Corp" | Creates the contact |
| "Show me all active clients" | Lists matching contacts |
| "Update John's status to Closed" | Edits the record |
| "Delete the contact for Bob Smith" | Removes the record |

---

## **What We Are NOT Building in MVP**

* No login or authentication  
* No email integration  
* No calendar or task management  
* No analytics or reports  
* No mobile app  
* No multi-user support

---

## **File Structure Claude Will Create**

doctor-ai-crm/

├── src/

│   ├── components/

│   │   ├── ContactList.jsx

│   │   ├── ContactForm.jsx

│   │   ├── ContactDetail.jsx

│   │   └── ChatPanel.jsx

│   ├── App.jsx

│   └── main.jsx

├── data/

│   └── contacts.json

├── .env

├── package.json

└── README.md

---

## **The .env File Will Need**

VITE\_OPENROUTER\_API\_KEY=your\_key\_here

VITE\_MODEL=anthropic/claude-3-haiku

---

## **Done Means**

* You can add a contact manually using the form  
* You can tell the AI to add a contact and it appears in the list  
* You can edit and delete contacts both manually and through chat  
* The app runs locally on your computer at `localhost:5173`  
* The UI is dark navy and gold and looks clean

---

## **Build Prompt for Claude Code**

Paste this into Claude Code in Warp:

"Here is my PRD. Build this app exactly as described. Start with the project setup and file structure, then build each component one at a time. Ask me for my OpenRouter API key before you start."

