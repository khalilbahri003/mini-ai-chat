# Rafiq — A Lightweight AI Chat Application

**Rafiq** is a simple, lightweight, Arabic-language AI chat application powered by **Gemini 3.5 Flash-Lite**. Each user provides their own Gemini API key, ensuring that no shared or hardcoded API key is included in the project.

##Try It Online

[**Launch Rafiq**](https://khalilbahri003.github.io/mini-ai-chat/)

To get started, obtain your personal API key from [Google AI Studio](https://aistudio.google.com/app/apikey), enter it into the application, and start chatting.

## Run Locally

To run Rafiq on your local machine:

1. Download or clone the project repository.
2. Open a terminal in the project's root directory.
3. Start a local development server:

   ```bash
   python3 -m http.server 8000
   ```

4. Open the following address in your browser:

   ```text
   http://localhost:8000
   ```

5. Enter your personal Gemini API key to start using the application.

> **Note:** Do not open `index.html` directly using the `file://` protocol. Some browsers restrict API requests in this mode. Use a local HTTP server instead.

## Privacy, Security & Usage Costs

Rafiq is designed to keep API credentials under the user's control:

- **No embedded API keys:** The project does not contain a shared API key. Every user must provide their own.
- **Temporary key storage:** The API key is held only in the browser page's memory. It is not stored in local storage, cookies, or the URL. Reloading the page clears it.
- **Direct API communication:** When a message is submitted, the API key and conversation content are sent directly to Google to generate a response.
- **Temporary conversation history:** Chat history is maintained in the current browser tab's memory and is not permanently stored by the application.
- **Individual usage responsibility:** Each user is responsible for their own API key, usage quota, and any applicable charges. Usage limits and pricing may change, so check your Google AI Studio account settings before using the service.
- **Sensitive information:** Avoid entering passwords, financial details, personal data, or other confidential information.

> **Security Notice:** Rafiq is a lightweight demonstration project, not a production-grade service or a secure secrets-management system. Use an API key with appropriate restrictions and quotas, and revoke it immediately if it is exposed.

**Important:** Never publish your API key on GitHub or share it with others. You do not need access to the project's repository to use the hosted application. However, all front-end files delivered to the browser can be inspected and downloaded by visitors.

## 🛠️ Technology Stack

Rafiq is built using a lightweight, serverless front-end architecture:

- **HTML5** — Application structure.
- **CSS3** — Styling and user interface.
- **JavaScript** — Application logic and API communication.
- **Google Gemini API** — AI-powered response generation.

### API Configuration

The application sends requests directly from the browser to Google's Gemini `GenerateContent` API endpoint.

| Configuration | Value |
|---|---|
| AI Provider | Google |
| Model | `gemini-3.5-flash-lite` |
| API Endpoint | Gemini GenerateContent |
| API Key | Provided by each user |
| Backend | None |
| Architecture | Static front-end |

**Rafiq** is built to provide a straightforward way to interact with Google's Gemini AI through a simple Arabic-language interface, without requiring a dedicated backend or a shared API key.
