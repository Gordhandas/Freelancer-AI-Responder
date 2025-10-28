# Freelancer AI Responder

An AI-powered tool designed to help freelance developers generate professional, context-aware responses to client inquiries instantly. Personalize the AI with your skills and experience to craft tailored, engaging replies that match your unique voice.

---

## ❗ CRITICAL: How to Fix Deployment Errors

If your Netlify deployment is failing, or you are seeing an error message that mentions **"server logs"** or **"API key not found"**, it is because your project contains old, unnecessary files from a previous server-side version.

**To fix this, you MUST DELETE the following from your project folder:**
- ❌ **The entire `netlify` folder**
- ❌ **The entire `services` folder**
- ❌ **The `package.json` file**

After deleting these, commit the changes. The application will then deploy and run correctly as a browser-only tool. This application runs **entirely in your browser**. Your API key is stored in your browser's local storage and is sent directly to Google's servers, not a Netlify function.

---

## ✨ Key Features

- **Client-Side Operation**: No backend or server setup required. Just open the `index.html` file.
- **Secure Local Storage**: Your Google Gemini API key is saved in your browser's local storage for convenience, so you don't have to enter it every time.
- **Personalized AI Profile**: Configure the AI with your name, skills, and experience summary to generate responses that accurately represent you.
- **Multi-Client Conversation Management**: Maintain separate, organized conversation histories for each client, ensuring context is never lost.
- **Context-Aware Responses**: The AI reads the previous conversation history before generating a new reply, ensuring natural and relevant follow-ups.
- **Adjustable Tone & Style**: Fine-tune the AI's communication by choosing between various tones (Casual, Formal) and styles (Short & Sweet, Detailed).
- **Dual Generation Modes**:
  - **🚀 Fast Mode**: Utilizes `gemini-flash-lite-latest` for low-latency, near-instantaneous responses.
  - **🧠 Thinking Mode**: Switches to `gemini-2.5-pro` with a maximum `thinkingBudget` to handle complex client questions and generate more thoughtful, in-depth replies.
- **Persistent History**: Each conversation's history is displayed for easy reference.
- **Responsive Design**: A clean, modern UI built with Tailwind CSS.

## 🛠️ Tech Stack

- **Framework**: React
- **Language**: TypeScript
- **AI**: Google Gemini API (`@google/genai`)
- **Styling**: Tailwind CSS

## 🚀 Getting Started

This project is a static web application and does not require a build step or complex setup.

### Prerequisites

- A modern web browser (like Chrome, Firefox, or Safari).
- A Google Gemini API Key from [Google AI Studio](https://aistudio.google.com/app/apikey).

### Running the Application

1.  **Download the project files.** (And delete the old server files mentioned in the troubleshooting section if they exist).
2.  **Open the `index.html` file** directly in your web browser.
3.  The application will prompt you to enter your Google Gemini API key. Paste your key and click "Save & Continue".

That's it! The app is ready to use.

## 📖 How to Use

1.  **Enter Your API Key**: On your first visit, provide your Gemini API key.
2.  **Set Up Your Profile**: On the left sidebar, fill in your name, key skills, and a summary of your professional experience.
3.  **Start a New Chat**: Click the "New Chat" button in the header to create a new conversation for a client.
4.  **Paste the Client's Message**: Copy the client's message and paste it into the "Client's Message" text area.
5.  **Select Your Preferences**:
    -   Choose the **Tone**, **Response Style**, and **Generation Mode**.
6.  **Generate Response**: Click the "Generate Response" button. The AI will craft a reply based on your profile, the conversation history, and your selected settings.
7.  **Copy and Use**: Review the generated response. If you're happy with it, click the copy icon and paste it into your email or messaging client.
8.  **Manage Conversations**: Switch between different client conversations using the list in the sidebar. The sidebar can be toggled using the "Conversations" button in the header.