function initializeUploadLogic() {
    const uploadForm = document.getElementById('upload-form');
    const uploadButton = document.getElementById('upload-folder-button');
    const folderInput = document.getElementById('folder-input');
    const statusDiv = document.getElementById('status-text');

    if (uploadForm && uploadButton && folderInput && statusDiv) {
        // Trigger file input when the custom button is clicked
        // Use a flag to prevent attaching multiple listeners
        if (!uploadButton.dataset.listenerAttached) {
            uploadButton.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent form submission
                folderInput.click();
            });
            uploadButton.dataset.listenerAttached = 'true';
        }

        // Handle the file selection and upload
        if (!folderInput.dataset.listenerAttached) {
            folderInput.addEventListener('change', async (event) => {
                const target = event.target;
                const files = target.files;

                if (!files || files.length === 0) {
                    const errorEvent = new CustomEvent('show-error', {
                        detail: { message: 'You did not select a folder.' }
                    });
                    document.dispatchEvent(errorEvent);
                    return;
                }

                const maxSizeInBytes = 150 * 1024 * 1024; // 150 MB
                let totalSize = 0;
                for (let i = 0; i < files.length; i++) {
                    totalSize += files[i].size;
                }

                if (totalSize > maxSizeInBytes) {
                    const errorEvent = new CustomEvent('show-error', {
                        detail: { message: `Total upload size exceeds the 150 MB limit. Your selection is ${(totalSize / (1024 * 1024)).toFixed(2)} MB.` }
                    });
                    document.dispatchEvent(errorEvent);
                    return;
                }


                const formData = new FormData(uploadForm);
                let validFileCount = 0;

                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    const fileName = file.name.toLowerCase();
                    if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) {
                        formData.append('files', file);
                        validFileCount++;
                    }
                }

                if (validFileCount === 0) {
                    const errorEvent = new CustomEvent('show-error', {
                        detail: { message: 'No valid JPG or JPEG files found in the selected folder.' }
                    });
                    document.dispatchEvent(errorEvent);
                    return;
                }

                statusDiv.textContent = `Uploading ${validFileCount} photos...`;
                try {
                    const response = await fetch('http://localhost:5000/upload', {
                        method: 'POST',
                        body: formData,
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error || 'Upload failed');
                    }

                    const data = await response.json();
                    statusDiv.textContent = 'Generating video... this may take a moment.';

                    if (data.video_path) {
                        const videoEvent = new CustomEvent('video-generated', {
                            detail: { videoPath: data.video_path }
                        });
                        document.dispatchEvent(videoEvent);
                    } else {
                        throw new Error('Video path not found in response.');
                    }

                } catch (error) {
                    console.error('Error:', error);
                    if (error instanceof Error) {
                        statusDiv.textContent = 'Error: ' + error.message;
                    } else {
                        statusDiv.textContent = 'An unknown error occurred.';
                    }
                }
            });
            folderInput.dataset.listenerAttached = 'true';
        }
    }
}

// Run the initialization on initial page load
initializeUploadLogic();

// Re-run the initialization on subsequent client-side navigations
document.addEventListener('astro:page-load', initializeUploadLogic);