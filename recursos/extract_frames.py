import cv2
import os
import sys

# Video path
video_path = "/Users/joannhenry/Desktop/resiplus-clone/recursos/Curso VIDEOS DE FORMACION Resiplus Transferencias y Movilizacion-39.mp4"
output_dir = "/Users/joannhenry/Desktop/resiplus-clone/recursos/video_frames"

# Create output directory
os.makedirs(output_dir, exist_ok=True)

# Open video
cap = cv2.VideoCapture(video_path)

if not cap.isOpened():
    print("Error: Could not open video file")
    sys.exit(1)

# Get video properties
fps = cap.get(cv2.CAP_PROP_FPS)
total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
duration = total_frames / fps if fps > 0 else 0

print(f"Video Properties:")
print(f"  FPS: {fps}")
print(f"  Total Frames: {total_frames}")
print(f"  Duration: {duration:.2f} seconds ({duration/60:.2f} minutes)")
print(f"  Width: {int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))}")
print(f"  Height: {int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))}")
print()

# Extract one frame every 2 seconds (more detailed analysis)
frames_to_extract = []
interval_seconds = 2
for sec in range(0, int(duration) + 1, interval_seconds):
    frame_num = int(sec * fps)
    if frame_num < total_frames:
        frames_to_extract.append((sec, frame_num))

print(f"Extracting {len(frames_to_extract)} frames (1 every {interval_seconds} seconds)...")

for i, (sec, frame_num) in enumerate(frames_to_extract):
    cap.set(cv2.CAP_PROP_POS_FRAMES, frame_num)
    ret, frame = cap.read()
    if ret:
        output_path = os.path.join(output_dir, f"frame_{i:04d}_sec{sec:04d}.jpg")
        cv2.imwrite(output_path, frame, [cv2.IMWRITE_JPEG_QUALITY, 95])
        print(f"  Frame {i+1}/{len(frames_to_extract)}: {sec}s -> {output_path}")
    else:
        print(f"  Warning: Could not read frame at {sec}s")

cap.release()
print(f"\nDone! Extracted {len(frames_to_extract)} frames to {output_dir}")
