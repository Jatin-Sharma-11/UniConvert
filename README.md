# 🦄 UniConvert

> **Convert files without limits.** A powerful, client-side file converter running entirely in your browser.

![UniConvert Hero](/home/jatin-sharma/.gemini/antigravity/brain/7ed8044c-72bd-4e1b-8b21-7685ffc77e0d/uniconvert_local_1763996002814.png)

## ✨ Features

- **Unlimited Conversions**: No daily limits or file size restrictions.
- **Privacy First**: Files never leave your device. Everything happens locally.
- **Blazing Fast**: Powered by WebAssembly (FFmpeg.wasm) for near-native performance.
- **Multi-Format Support**:
    - 🖼️ **Images**: JPG, PNG, WEBP, GIF, ICO, TIFF, BMP
    - 🎵 **Audio**: MP3, WAV, OGG, AAC, M4A
    - 🎥 **Video**: MP4, MKV, MOV, AVI, WEBM
- **Batch Processing**: Convert multiple files at once.
- **Modern UI**: Built with Shadcn UI and Tailwind CSS for a premium experience.

## 🏗️ Architecture

UniConvert leverages the power of **WebAssembly** to bring desktop-grade media processing to the web. Unlike traditional converters that upload your files to a server, UniConvert loads the FFmpeg engine directly into your browser.

![Process Architecture](/home/jatin-sharma/UniConv/public/architecture.png)

### How it Works
1.  **User Interaction**: You drag and drop files into the React Dropzone.
2.  **File Loading**: The app reads the file data into memory.
3.  **FFmpeg Core**: The `ffmpeg.wasm` core (loaded from a CDN) is initialized in a Web Worker to prevent UI freezing.
4.  **Conversion**: The file data is passed to FFmpeg, which transcodes it to the desired format.
5.  **Output**: The converted file is generated as a Blob and made available for download immediately.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (Recommended: 20+)
- npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Jatin-Sharma-11/UniConvert.git
    cd UniConvert
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) with your browser.

## 🛠️ Tech Stack

-   **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Components**: [Shadcn UI](https://ui.shadcn.com/)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **Core Engine**: [FFmpeg.wasm](https://ffmpegwasm.netlify.app/)
-   **File Handling**: [React Dropzone](https://react-dropzone.js.org/)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Made with ❤️ by [Jatin Sharma](https://github.com/Jatin-Sharma-11)
