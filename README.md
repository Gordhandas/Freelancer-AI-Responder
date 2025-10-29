# Freelancer AI Responder

An AI-powered tool designed to help freelance developers generate professional, context-aware responses to client inquiries instantly. Personalize the AI with your skills and experience to craft tailored, engaging replies that match your unique voice.

This application runs **entirely in your browser**. No server or build process is needed.

---

## ✨ Key Features

- **Entirely Client-Side**: No backend, no servers, no build steps. The entire application runs directly in your browser.
- **AI-Powered Profile**: Configure the AI with your name, skills, and experience summary to generate responses that accurately represent you.
- **Multi-Client Conversation Management**: Maintain separate, organized conversation histories for each client, ensuring context is never lost.
- **Context-Aware Responses**: The AI reads the previous conversation history before generating a new reply, ensuring natural and relevant follow-ups.
- **Adjustable Tone & Style**: Fine-tune the AI's communication by choosing between various tones (Casual, Formal, Enthusiastic) and styles (Short & Sweet, Detailed).
- **Dual Generation Modes**:
  - **🚀 Fast Mode**: Utilizes `gemini-flash-lite-latest` for low-latency, near-instantaneous responses.
  - **🧠 Thinking Mode**: Switches to `gemini-2.5-pro` with a maximum `thinkingBudget` to handle complex client questions and generate more thoughtful, in-depth replies.
- **Persistent History**: Conversations are automatically saved in your browser's local storage.
- **Modern & Responsive Design**: A sleek, animated UI built with Tailwind CSS that works beautifully on all devices.

## 🛠️ Tech Stack

- **Framework**: React
- **Language**: TypeScript
- **AI**: Google Gemini API (`@google/genai`)
- **Styling**: Tailwind CSS

## 🚀 Getting Started

This project is a static web application and does not require any installation.

### Prerequisites

- A modern web browser (like Chrome, Firefox, or Safari).
- A Google Gemini API Key from [Google AI Studio](https://aistudio.google.com/app/apikey). The application uses an environment variable for the key, which is handled by the hosting environment.

### Running the Application

1.  **Download the project files.**
2.  **Open the `index.html` file** directly in your web browser.

That's it! The app is ready to use.

## 📖 How to Use

1.  **Set Up Your Profile**: On the left sidebar, fill in your name, key skills, and a summary of your professional experience.
2.  **Start a New Chat**: Click the "New Chat" button in the header to create a new conversation for a client.
3.  **Paste the Client's Message**: Copy the client's message and paste it into the "Client's Message" text area.
4.  **Select Your Preferences**:
    -   Choose the **Tone**, **Response Style**, and **Generation Mode**.
5.  **Generate Response**: Click the "Generate Response" button. The AI will craft a reply based on your profile, the conversation history, and your selected settings.
6.  **Copy and Use**: Review the generated response. If you're happy with it, click the copy icon and paste it into your email or messaging client.
7.  **Manage Conversations**: Switch between different client conversations using the list in the sidebar. The sidebar can be toggled using the "Conversations" button in the header.