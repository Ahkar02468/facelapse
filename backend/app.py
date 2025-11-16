import os
from flask import Flask, request, jsonify, send_from_directory
import tempfile
from PIL import Image
from moviepy import ImageSequenceClip
from PIL.ExifTags import TAGS
import numpy as np
from datetime import datetime
from flask_cors import CORS
from config import Config

app = Flask(__name__)
app.config.from_object(Config)
app.config['MAX_CONTENT_LENGTH'] = 5 * 1024 * 1024 * 1024  # 5 GB upload limit
CORS(app, origins="http://localhost:4321")

os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

ORIENTATION_TAG_ID = {v: k for k, v in TAGS.items()}['Orientation']

def get_image_date(image_path):
    """Extracts the date taken from an image's EXIF data."""
    try:
        tag_id = {v: k for k, v in TAGS.items()}['DateTimeOriginal']
        with Image.open(image_path) as img:
            exif_data = img.getexif()
            if exif_data:
                # EXIF tag for DateTimeOriginal
                date_time_original = exif_data.get(tag_id)
                if date_time_original:
                    return datetime.strptime(date_time_original, '%Y:%m:%d %H:%M:%S')
    except (AttributeError, KeyError, IndexError, TypeError) as e:
        print(f"Could not get date for {image_path}: {e}")
    # Fallback to file modification time if EXIF data is not available
    return datetime.fromtimestamp(os.path.getmtime(image_path))

def orient_image(img):
    """Applies rotation to an image based on its EXIF orientation tag."""
    exif = img.getexif()
    orientation = exif.get(ORIENTATION_TAG_ID)

    if orientation == 3:
        img = img.rotate(180, expand=True)
    elif orientation == 6:
        img = img.rotate(270, expand=True)
    elif orientation == 8:
        img = img.rotate(90, expand=True)
    
    # expand=True ensures the image canvas is resized to fit the new dimensions.
    # Other orientation values for mirroring are ignored for simplicity.
    
    return img

@app.route('/upload', methods=['POST'])
def upload_files():
    if 'files' not in request.files:
        return jsonify({'error': 'No files part in the request'}), 400
    
    files = request.files.getlist('files')
    if not files or files[0].filename == '':
        return jsonify({'error': 'No selected files'}), 400

    ALLOWED_EXTENSIONS = {'.jpg', '.jpeg'}

    # Use a temporary directory for processing images
    with tempfile.TemporaryDirectory() as temp_dir:
        image_paths = []
        for file in files:
            if file:
                from werkzeug.utils import secure_filename
                filename = secure_filename(file.filename)
                if '.' in filename and os.path.splitext(filename)[1].lower() in ALLOWED_EXTENSIONS:
                    filepath = os.path.join(temp_dir, filename)
                    file.save(filepath)
                    image_paths.append(filepath)

        sort_order = request.form.get('sort_order', 'old-to-young')
        sort_order_abbr = 'yto' if sort_order == 'young-to-old' else 'oty'
        
        try:
            # print(sort_order)
            # Sort images by date
            sorted_images = sorted(image_paths, key=get_image_date, reverse=(sort_order == 'young-to-old'))
            
            if not sorted_images:
                return jsonify({'error': 'No valid images found to create a video.'}), 400

            # --- Robust Image Resizing and Orientation Logic ---
            target_size = (1920, 1080) # Standard 1080p landscape resolution
            resized_frames = []

            for image_path in sorted_images:
                with Image.open(image_path) as img:
                    # 1. Apply EXIF orientation
                    oriented_img = orient_image(img)

                    # 2. Resize with aspect ratio preservation (thumbnail)
                    oriented_img.thumbnail(target_size, Image.Resampling.LANCZOS)

                    background = Image.new('RGB', target_size, (0, 0, 0))
                    paste_position = (
                        (target_size[0] - oriented_img.width) // 2,
                        (target_size[1] - oriented_img.height) // 2
                    )
                    background.paste(oriented_img, paste_position)
                    resized_frames.append(np.array(background))

            # Create timelapse video and save it to the permanent UPLOAD_FOLDER
            video_clip = ImageSequenceClip(resized_frames, fps=24)
            video_filename = f"facelapse_{sort_order_abbr}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.mp4"
            final_video_path = os.path.join(app.config['UPLOAD_FOLDER'], video_filename)
            
            print(f"Writing video to {final_video_path}...")
            video_clip.write_videofile(final_video_path, codec='libx264')

            return jsonify({'video_path': video_filename})

        except (AttributeError, KeyError, IndexError, TypeError) as e:
            print(f"Error processing image metadata: {e}")
            return jsonify({'error': 'Failed to process image metadata. Ensure images have valid data.'}), 500
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    # The temporary directory and its contents are automatically deleted here

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename, as_attachment=True)

@app.route('/')
def hello():
    return "<p>Hello, World! This is the Facelapse backend.</p>"

if __name__ == '__main__':
    app.run(debug=True, port=5000)
