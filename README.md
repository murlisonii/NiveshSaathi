# Nivesh Saathi - Your AI Investment Companion

Nivesh Saathi is a comprehensive, AI-powered web application designed to empower users with the tools and knowledge needed for smart investing. Built with Next.js, Firebase, and Google's Generative AI (Genkit), this platform offers a simulated trading environment, personalized financial advice, and interactive learning modules.

## ✨ Features

*   **AI-Powered Personalization**:
    *   **Personalized Agent**: Get tailored suggestions based on your portfolio and risk profile. Analyze financial documents by pasting text or uploading images.
    *   **AI Chatbot (Nivesh Saathi)**: Ask any investment-related question in your local language and get instant, voice-enabled answers.
    *   **AI Summarizer**: Translate and summarize complex financial texts into simple, easy-to-understand language.
*   **Interactive Learning**:
    *   **Learning Hub**: Explore modules on topics from stock market basics to algorithmic trading.
    *   **Dynamic Quizzes**: Test your knowledge with AI-generated quizzes at the end of each module.
*   **Realistic Simulation**:
    *   **Simulated Trading**: Buy and sell stocks with a virtual balance in a near real-time market environment.
    *   **Portfolio Tracking**: Monitor your investments, overall profit/loss, and daily changes.
    *   **Risk Assessment**: Take a quiz to discover your unique investor profile.

## 🚀 Technology Stack

*   **Framework**: [Next.js](https://nextjs.org/) (with App Router)
*   **AI**: [Google's Genkit](https://firebase.google.com/docs/genkit)
*   **UI**: [React](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS](https://tailwindcss.com/)
*   **Component Library**: [ShadCN UI](https://ui.shadcn.com/)
*   **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
*   **Icons**: [Lucide React](https://lucide.dev/)

## Getting Started

This project is set up to run in a development environment like Firebase Studio.

1.  **Start the development server**:
    ```bash
    npm run dev
    ```

2.  **Start the Genkit development service**:
    In a separate terminal, run the following command to enable the AI features.
    ```bash
    npm run genkit:watch
    ```

3.  **Open the application**:
    Open [http://localhost:9002](http://localhost:9002) in your browser to see the result.

The main application code can be found in `src/app/page.tsx`.
