
# Freelancer AI Responder

An AI-powered tool designed to help freelance developers generate professional, context-aware responses to client inquiries instantly. Personalize the AI with your skills and experience to craft tailored, engaging replies that match your unique voice.

This application runs **entirely in your browser**. No server or build process is needed.

---

## ✨ Key Features

- **Entirely Client-Side**: No backend, no servers, no build steps. The entire application runs directly in your browser.
- **Use Your Own API Key**: Securely enter your Google Gemini API key, which is stored only in your browser's local storage.
- **Multiple Generation Modes**: Choose the right model for the job:
    - **Fast Mode**: For low-latency, near-instantaneous responses using `gemini-flash-lite-latest`.
    - **Balanced Mode**: A great all-around mix of speed and power using `gemini-2.5-flash`.
    - **Thinking Mode**: For complex queries that require deep reasoning, powered by `gemini-2.5-pro` with an enhanced thinking budget.
- **Search Grounding**: Toggle on "Search the web" to allow the AI to use Google Search for up-to-date and accurate information, with sources cited in the response.
- **AI-Powered Profile**: Configure the AI with your name, skills, portfolio, and experience summary to generate responses that accurately represent you.
- **Multi-Client Conversation Management**: Maintain separate, organized conversation histories for each client, ensuring context is never lost.
- **Import/Export Conversations**: Save all your conversations to a local JSON file for backup, or import them into another browser.
- **Context-Aware Responses**: The AI reads the previous conversation history before generating a new reply, ensuring natural and relevant follow-ups.
- **Voice Input**: Dictate your client messages using your microphone for faster input.
- **Adjustable Tone & Style**: Fine-tune the AI's communication by choosing between various tones (Casual, Formal, Enthusiastic) and styles (Short & Sweet, Detailed).
- **Persistent History**: Conversations and your profile are automatically saved in your browser's local storage.
- **Modern & Responsive Design**: A sleek, animated UI built with Tailwind CSS that works beautifully on all devices.

## 🛠️ Tech Stack

- **Framework**: React
- **Language**: TypeScript
- **AI**: Google Gemini API (`@google/genai`) with `gemini-flash-lite-latest`, `gemini-2.5-flash`, and `gemini-2.5-pro`.
- **Styling**: Tailwind CSS

## 🚀 Getting Started

This project is a static web application and does not require any installation or build process.

### Prerequisites

- A modern web browser (Chrome is recommended for the best Speech Recognition experience).
- A Google Gemini API Key. You can get one from [Google AI Studio](https://aistudio.google.com/app/apikey).

### Running the Application

1.  **Download the project files.**
2.  **Open in Browser**: Open the `index.html` file directly in your web browser.
3.  **Set Your API Key**: When prompted by the modal, enter your Gemini API key. It will be stored securely in your browser's local storage. You can change it later in the Profile section.

That's it! The app is ready to use.

## 📖 How to Use

1.  **Set Up Your Profile**: On the left sidebar, fill in your name, key skills, portfolio URL, and a summary of your professional experience. Your profile is saved automatically.
2.  **Start a New Chat**: Click the "New Chat" button in the header to create a new conversation for a client.
3.  **Enter the Client's Message**: Type or paste the client's message into the "Client's Message" text area. You can also click the microphone icon to dictate your message.
4.  **Select Your Preferences**:
    -   Choose the **Mode** (`Fast`, `Balanced`, or `Thinking`).
    -   Choose the **Tone** and **Response Style**.
    -   Toggle **Search the web** if you need up-to-date information.
5.  **Generate Response**: Click the "Generate Response" button. The AI will craft a reply based on your profile, the conversation history, and your selected settings.
6.  **Copy and Use**: Review the generated response and any web sources. If you're happy with it, click the copy icon and paste it into your email or messaging client.
7.  **Manage Conversations**: Switch between different client conversations using the list in the sidebar. The sidebar can be toggled using the "Conversations" button in the header. You can also import and export all conversations using the icons next to the "Conversations" title.