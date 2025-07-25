# 🚀 QuickTalk — AI-Powered Collaborative Coding Platform

QuickTalk is an AI-powered, real-time collaborative chat and coding platform designed to streamline project discussions and enhance productivity through intelligent code generation and review. It brings developers together in one unified interface that integrates chat, AI assistance, real-time collaboration, and an in-browser coding environment.

---

## ✨ Key Features

- 🔐 **Secure Authentication**  
  JWT-based signup and login system ensures secure access to your projects and data.

- 🧑‍🤝‍🧑 **Project Management & Team Collaboration**  
  Create multiple projects, add collaborators from registered users, and chat with your team in real time via **Socket.IO**.

- 🤖 **AI-Powered Assistance with Gemini**  
  Use `@ai` in group chat to ask questions, generate code, or build functions powered by **Gemini API**.

- 💻 **Integrated Code Editor**  
  Monaco Editor replicates the **VS Code experience**, including:
  - Sidebar showing generated files (e.g., `app.js`, `package.json`)
  - Editable code area with syntax highlighting and IntelliSense

- 🧪 **AI-Generated Express Server**  
  Ask the AI to generate and run a Node.js Express server directly in-browser using **WebContainers**. You can:
  - Edit the server
  - Add custom routes
  - Start and test the server live

- 🧠 **AI Code Review**  
  Paste your code in the editor and get instant reviews by clicking the **Review with AI** button.

- ♻️ **Persistent Chat History**  
  Conversations remain intact across sessions for continuous team context.

- ⚙️ **Additional Functionalities**
  - Delete projects and user accounts
  - Reset password using **Nodemailer**
  - Real-time updates and status-aware UI
  - Minimalist and clean interface

---

## 🛠 Tech Stack

| Category        | Technology                            |
|----------------|----------------------------------------|
| Frontend       | React, TailwindCSS, Monaco Editor      |
| Backend        | Node.js, Express, Socket.IO            |
| AI Integration | Gemini API (Google's LLM)              |
| Dev Environment| WebContainers by StackBlitz            |
| Auth           | JWT (JSON Web Tokens)                  |
| Realtime       | Socket.IO                              |
| Database       | MongoDB (assumed for persistence)      |

---

💡 **Project Goals**

QuickTalk was built to streamline collaborative development and integrate AI directly into the developer workflow. By combining real-time communication with powerful AI tools, developers can:

- Brainstorm and code together

- Build full-stack applications with AI-generated code

- Review and improve code quality collaboratively

- Eliminate the context-switching between chat apps, code editors, and AI tools

📫 **Contact**

Made with ❤️ by Rohan Suri
[LinkedIn](https://www.linkedin.com/in/rohan-suri-72ba73297/) | [Email](mailto:rohansuri2906@gmail.com)