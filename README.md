# VoiceFlowAi

A modern, web-based dictation application that provides a seamless voice-to-text experience. Built with Next.js, it allows users to dictate notes in real-time, manage multiple notes, and export their content.

## Features

-   **Real-time Dictation**: Uses the browser's Web Speech API for instant voice-to-text transcription.
-   **Note Management**: Create, select, and delete multiple notes.
-   **Local Persistence**: Notes are automatically saved to your browser's `localStorage`, so your work is never lost.
-   **Copy & Download**: Easily copy note content to the clipboard or download notes as `.txt` files.
-   **Responsive Design**: A clean, intuitive, and fully responsive interface that works on all screen sizes.
-   **Theming**: Includes both light and dark mode support.

## Tech Stack

This project is built with a modern, robust technology stack:

-   **Framework**: [Next.js](https://nextjs.org/) (App Router)
-   **UI Library**: [React](https://reactjs.org/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **Core Web API**: [Web Speech API] Google Gemini API for speech recognition.

## Project Structure

The project is organized following standard Next.js conventions to ensure clarity and maintainability.

```
/
├── src/
│   ├── app/                # Next.js App Router pages and layouts
│   ├── components/         # React components (UI and features)
│   │   ├── ui/             # Reusable ShadCN UI components
│   │   ├── dictation-editor.tsx
│   │   └── voiceflow-app.tsx
│   ├── hooks/              # Custom React hooks
│   │   └── use-speech-recognition.ts
│   └── lib/                # Shared utilities and type definitions
├── public/                 # Static assets
└── tailwind.config.ts      # Tailwind CSS configuration
```

## Getting Started

To run this project locally, follow these steps:

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/SahilC999/Dictation-app.git
    cd https://github.com/SahilC999/Dictation-app.git
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run the development server**:
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) (or the port specified in your terminal) with your browser to see the result.

## Deployment

This application is configured for deployment on **Firebase App Hosting** out of the box. You can also deploy it to other platforms that support Next.js, like Vercel or Netlify, with minimal configuration changes.
