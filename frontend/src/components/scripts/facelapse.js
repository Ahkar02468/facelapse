document.addEventListener("video-generated", (event) => {
		const videoPath = (event).detail.videoPath;
		const videoPlayerEl = document.getElementById(
			"timelapse-video",
		);
		const statusText = document.getElementById("status-text");
		const placeholderImage = document.getElementById("placeholder-image");
		const downloadButton = document.getElementById(
			"download-button",
		);
		const startNewButton = document.getElementById(
			"start-new-button",
		);
		const actionButtonsContainer = document.getElementById("action-buttons");
		const fileTypeNote = document.getElementById("file-type-note");
		const uploadForm = document.getElementById("upload-form");
		const mainContainer = document.getElementById("main-container");
		const videoContainer = document.getElementById("video-container");
		const controlsContainer = document.getElementById("controls-container");

		if (
			videoPlayerEl &&
			statusText &&
			placeholderImage &&
			downloadButton &&
			startNewButton &&
			actionButtonsContainer &&
			fileTypeNote &&
			uploadForm &&
			mainContainer &&
			videoContainer &&
			controlsContainer
		) {
			const videoUrl = `http://localhost:5000/uploads/${videoPath}`;

			// --- UI Layout Changes for Final Result ---
			// 1. Move main content to the top
			mainContainer.classList.remove("justify-center", "min-h-dvh");
			mainContainer.classList.add("justify-start");

			// 2. Make the video player container larger
			videoContainer.classList.remove("max-w-2xl");
			videoContainer.classList.add("max-w-6xl", "w-full");

			// 3. Ensure the top controls don't stretch
			controlsContainer.classList.remove("w-full");


			videoPlayerEl.src = videoUrl;
			videoPlayerEl.style.display = "block";
			placeholderImage.style.display = "none";

			statusText.textContent = "Your amazing faceLAPSE is ready!";
			downloadButton.href = videoUrl;
			downloadButton.download = videoPath;
			actionButtonsContainer.style.display = "flex";
			fileTypeNote.style.display = "none";
			uploadForm.style.display = "none";

			videoPlayerEl.play();

			// Reload the page to start over, clearing the current state.
			startNewButton.addEventListener("click", () => {
				location.reload();
			});
		}
	});