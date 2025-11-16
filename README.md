# faceLAPSE

#### Video Demo: https://youtu.be/LLvNx81hz1A

![faceLAPSE Banner](./frontend/public/facelapse-ss.png "faceLAPSE Showcase")

## Table of Contents

- [Description](#Description)
- [Features](#features)
- [Live Demo & Screenshots](#live-demo--screenshots)
- [Technology Stack](#technology-stack)
- [Architectural Decisions & Design Choices](#architectural-decisions--design-choices)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [How It Works](#how-it-works)
- [License](#license)

## Description

Life moves fast, and the small, everyday changes are often impossible to see until you look back. **faceLAPSE** is a web application built to help you visualize that journey. It provides a simple, dedicated, and fun way to create a beautiful time-lapse video from a collection of your photos.

Whether you're documenting personal growth, a project's evolution, or just want to see the years fly by, faceLAPSE stitches your memories together into a smooth, high-quality video. You select a folder of images, choose the chronological order, and the application handles the rest—sorting, resizing, and rendering your personal story into a shareable MP4 file.

This project was born from the idea that personal storytelling should be easy and accessible. It combines a powerful Python backend for video processing with a sleek, modern frontend built with Astro and React.

## Features

- **Easy Folder Upload:** Select an entire folder of images at once.
- **Automatic Chronological Sorting:** Images are automatically sorted by the date they were taken using EXIF metadata.
- **Flexible Sorting Order:** Choose to create your timelapse from "Young to Old" or "Old to Young".
- **Robust Image Processing:**
  - **EXIF Orientation Handling:** Automatically rotates images to the correct orientation based on their metadata, so photos from your phone appear upright.
  - **Aspect-Ratio Preserving Resize:** Images are resized to fit a standard 1080p (1920x1080) frame while maintaining their original aspect ratio. Black bars are added to prevent stretching, ensuring a professional look.
- **High-Quality Video Output:** Generates a smooth 24 FPS video in MP4 format using the `libx264` codec.
- **Instant Preview & Download:** Watch your generated timelapse directly in the browser and download it with a single click.
- **Responsive UI:** A clean and modern user interface that works on any device.

## Live Demo & Screenshots


**Initial Upload Screen:**
*The user is greeted with a clean interface to select the sorting order and upload their photos.*
![faceLAPSE Upload](./frontend/public/facelapse-ss1.png "faceLAPSE Upload UI")

**Video Ready Screen:**
*Once the video is processed, it's presented to the user for immediate playback and download.*
![faceLAPSE Result](./frontend/public/facelapse-ss2.png "faceLAPSE Result UI")

## Technology Stack

This project is a full-stack application with a decoupled architecture.

#### Backend

- **Framework:** **Flask** (Python)
- **Video Processing:** **MoviePy** for creating the video sequence from images.
- **Image Manipulation:** **Pillow** (PIL Fork) for reading EXIF data, handling orientation, and resizing.
- **Dependencies:** `Flask-Cors`, `NumPy`.

#### Frontend

- **Framework:** **Astro**
- **UI Components:** **React** (used for interactive "islands of architecture").
- **Styling:** **TailwindCSS** for utility-first styling.
- **Animations:** **Framer Motion** for subtle UI animations.
- **Package Manager:** **pnpm**

## Architectural Decisions & Design Choices

Several key decisions were made during the development of faceLAPSE to ensure robustness, good user experience, and a modern development workflow.

1.  **Decoupled Frontend & Backend:**
    -   **Why:** Separating the Flask backend from the Astro frontend allows for independent development, scaling, and deployment. The backend is a pure API, and the frontend is a static site that consumes it. This is a standard, robust pattern for modern web apps.
    -   **Alternative:** A monolithic Flask application serving Jinja2 templates. This was avoided to leverage a modern JavaScript framework (Astro) for a richer, faster frontend experience.

2.  **Astro with React Islands:**
    -   **Why:** Astro is excellent for content-heavy sites, shipping zero JavaScript by default. However, faceLAPSE has highly interactive components (like the background and navigation). Astro's "islands" model allows us to embed interactive React components (`.tsx`) only where needed, keeping the rest of the site static and fast.

3.  **Robust Backend Image Processing:**
    -   **EXIF-based Sorting:** Relying on file names for sorting is brittle. The decision to extract the `DateTimeOriginal` tag from EXIF data ensures photos are ordered correctly, regardless of how they are named. A fallback to file modification time provides a safety net.
    -   **Automated Orientation:** Mobile photos often contain an EXIF `Orientation` tag. Ignoring this would result in sideways or upside-down images in the final video. The backend reads this tag and rotates the image accordingly before processing.
    -   **Letterboxing:** Instead of stretching or cropping images to fit the 1080p video frame, we chose to preserve the original aspect ratio and add black bars (letterboxing). This respects the integrity of the original photos and produces a more professional-looking result.

4.  **Client-Side Communication with Custom Events:**
    -   **Why:** The upload logic and the UI update logic are in separate JavaScript files (`upload.js` and `facelapse.js`). To communicate that a video is ready, `upload.js` dispatches a custom `video-generated` DOM event. `facelapse.js` listens for this event. This creates a clean separation of concerns, making the code easier to manage than using callbacks or global flags.

5.  **Temporary File Handling:**
    -   **Why:** User-uploaded files should be handled securely and cleaned up properly. The backend uses Python's `tempfile.TemporaryDirectory()` to store and process images. This directory and all its contents are automatically deleted after the request is complete, preventing the server's disk from filling up with intermediate files.

## Project Structure

The project is organized into two main directories: `backend` and `frontend`.

```text
/
├── backend/
│   ├── app.py             # Main Flask application: API endpoints, image processing, video generation.
│   ├── config.py          # Simple configuration for Flask (e.g., upload folder).
│   ├── requirements.txt   # Python dependencies for the backend.
│   └── uploads/           # Directory where final videos are saved.
│
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable Astro/React components and their scripts.
│   │   │   ├── scripts/
│   │   │   │   ├── upload.js    # Handles file input, validation, and API communication.
│   │   │   │   └── facelapse.js # Handles UI updates after video is generated.
│   │   │   └── navigation.tsx # Example of a React component.
│   │   ├── pages/
│   │   │   └── facelapse.astro # The main page for the application UI.
│   │   └── layouts/         # Astro layout components.
│   ├── astro.config.mjs   # Astro configuration file.
│   └── package.json       # Node.js dependencies for the frontend.
│
└── README.md              # This file.
```

## Getting Started

Follow these instructions to set up and run the project on your local machine.

### Prerequisites

-   Node.js (v18+) and pnpm
-   Python (v3.10+) and pip
-   A Python virtual environment tool (like `venv`)

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/Ahkar02468/facelapse.git
    cd facelapse
    ```

2.  **Set up the Backend:**
    -   Create and activate a Python virtual environment from the project root.
        ```sh
        python3 -m venv facelapse
        source facelapse/bin/activate
        ```
    -   Install the required Python packages:
        ```sh
        pip install -r backend/requirements.txt
        ```

3.  **Set up the Frontend:**
    -   Navigate to the `frontend` directory and install the Node.js dependencies.
        ```sh
        cd frontend
        pnpm install
        ```

### Running the Application

You need to run both the backend and frontend servers in separate terminal windows.

1.  **Run the Backend (Flask):**
    -   Make sure your Python virtual environment is activated.
    -   From the **project root**, start the Flask server:
        ```sh
        python3 backend/app.py
        ```
    -   The backend will be running at `http://127.0.0.1:5000/`.

2.  **Run the Frontend (Astro):**
    -   In a new terminal, navigate to the `frontend` directory.
    -   Start the Astro development server:
        ```sh
        cd frontend
        pnpm run dev
        ```
    -   The frontend will be accessible at `http://localhost:4321/facelapse`.

## How It Works

1.  The user selects a sort order and clicks the "Upload Photos" button on the frontend.
2.  The browser opens a folder selection dialog.
3.  The `frontend/src/components/scripts/upload.js` script validates the selected files (checking for JPEGs and total size).
4.  It sends the image files and sort order to the `POST /upload` endpoint on the Flask backend.
5.  The Flask app in `backend/app.py` saves the files to a temporary directory.
6.  It iterates through the images, reads their EXIF data to get the creation date, and sorts them chronologically.
7.  For each image, it corrects the orientation and resizes it to fit a 1080p frame with letterboxing.
8.  `MoviePy` takes the sequence of processed images and renders them into an MP4 video file.
9.  The final video is saved to the `backend/uploads/` directory.
10. The backend returns a JSON response containing the filename of the new video.
11. The frontend receives this response. `upload.js` fires a `video-generated` event.
12. `facelapse.js` catches this event, hides the upload form, and displays the video player with the generated timelapse.
13. The user can then play the video, download it, or start a new project.

## License

This project is licensed under the MIT License - see the `frontend/LICENSE` file for details.