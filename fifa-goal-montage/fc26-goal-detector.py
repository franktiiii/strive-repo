#!/usr/bin/env python3
"""
FC26 Goal Detector v3 — Fast batch approach
1. Batch-extract frames using ffmpeg (1 fps on just the scoreboard crop)
2. OCR all frames
3. Detect score changes
"""

import json
import os
import re
import subprocess
import sys
import warnings

warnings.filterwarnings("ignore")

import cv2
import numpy as np

# ============================================================================
# Configuration
# ============================================================================

VIDEO_PATH = "/Volumes/HDD/Final Cut Original Media/2026-03-07/UT+Fc26+Tap+in!!-2.mp4"
OUTPUT_JSON = "/tmp/goal_timestamps.json"
FRAME_DIR = "/tmp/fc26_score_frames"

# Scoreboard ROI in the 1080x1920 frame
SCORE_ROI_TOP = 585
SCORE_ROI_BOTTOM = 700
SCORE_ROI_LEFT = 0
SCORE_ROI_RIGHT = 350

# Gameplay area
GAME_AREA_TOP = 560
GAME_AREA_BOTTOM = 1400

# Scan interval
SCAN_INTERVAL = 5  # seconds


def batch_extract_frames(video_path, output_dir, interval=5, start=0, end=None):
    """Extract frames at regular intervals using ffmpeg's fps filter.
    This is MUCH faster than seeking per-frame."""
    os.makedirs(output_dir, exist_ok=True)

    fps_val = 1.0 / interval

    cmd = [
        "ffmpeg",
        "-i", video_path,
    ]

    if start > 0:
        cmd = ["ffmpeg", "-ss", str(start), "-i", video_path]

    if end:
        cmd.extend(["-t", str(end - start)])

    cmd.extend([
        "-vf", f"fps={fps_val}",
        "-q:v", "2",
        os.path.join(output_dir, "frame_%06d.jpg"),
        "-y"
    ])

    print(f"Extracting frames at 1/{interval}s fps...")
    print(f"  Command: {' '.join(cmd[:6])}...")

    result = subprocess.run(cmd, capture_output=True, text=True)

    if result.returncode != 0:
        print(f"  ffmpeg error: {result.stderr[-500:]}")
        return False

    # Count extracted frames
    frames = sorted([f for f in os.listdir(output_dir) if f.endswith(".jpg")])
    print(f"  Extracted {len(frames)} frames")
    return True


def is_gameplay_frame(frame):
    """Check if a frame shows actual gameplay (green field)."""
    game_area = frame[GAME_AREA_TOP:GAME_AREA_BOTTOM, :]
    hsv = cv2.cvtColor(game_area, cv2.COLOR_BGR2HSV)
    lower_green = np.array([35, 30, 30])
    upper_green = np.array([85, 255, 255])
    green_mask = cv2.inRange(hsv, lower_green, upper_green)
    green_ratio = np.sum(green_mask > 0) / green_mask.size
    return green_ratio > 0.25


def ocr_score_region(roi_large):
    """Use template-free digit recognition on the score region.
    Instead of heavy EasyOCR, use a simpler approach:
    detect the score numbers by their position and color."""

    # The score numbers are white/light text on dark background
    gray = cv2.cvtColor(roi_large, cv2.COLOR_BGR2GRAY)

    # Threshold to isolate light text
    _, thresh = cv2.threshold(gray, 180, 255, cv2.THRESH_BINARY)

    # Find contours (potential digits)
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    return thresh, contours


def parse_score_with_easyocr(roi_large, reader):
    """Use EasyOCR on the scaled-up scoreboard region."""
    results = reader.readtext(roi_large, detail=1, paragraph=False)

    texts = []
    for bbox, text, conf in results:
        text = text.strip()
        if text and conf > 0.05:
            y_center = (bbox[0][1] + bbox[2][1]) / 2
            x_center = (bbox[0][0] + bbox[2][0]) / 2
            texts.append((y_center, x_center, text, conf))

    if not texts:
        return None

    # Sort by vertical position
    texts.sort(key=lambda x: x[0])

    numbers = []
    team_names = []

    for y, x, text, conf in texts:
        if re.match(r'^\d{1,2}$', text) and conf > 0.3:
            numbers.append((y, x, int(text), conf))
        elif re.match(r'^[A-Za-z]{2,4}$', text) and conf > 0.05:
            team_names.append((y, text.upper(), conf))

    if len(numbers) >= 2:
        numbers.sort(key=lambda x: x[0])  # Sort by y position
        score1 = numbers[0][2]
        score2 = numbers[1][2]
        team1 = team_names[0][1] if len(team_names) >= 1 else "?"
        team2 = team_names[1][1] if len(team_names) >= 2 else "?"

        return {
            "team1": team1, "score1": score1,
            "team2": team2, "score2": score2,
            "total": score1 + score2,
        }

    return None


def process_all_frames(frame_dir, reader, interval=5):
    """Process all extracted frames, read scores."""
    frames = sorted([f for f in os.listdir(frame_dir) if f.endswith(".jpg")])
    print(f"\nProcessing {len(frames)} frames with OCR...")

    readings = []
    gameplay_count = 0
    score_count = 0

    for i, fname in enumerate(frames):
        frame_path = os.path.join(frame_dir, fname)
        frame = cv2.imread(frame_path)

        if frame is None:
            continue

        # Calculate timestamp from frame number
        # Frame numbering starts at 1
        frame_num = int(fname.replace("frame_", "").replace(".jpg", ""))
        timestamp = (frame_num - 1) * interval

        # Check if gameplay
        if not is_gameplay_frame(frame):
            if i % 100 == 0:
                print(f"  [{i}/{len(frames)}] {timestamp/60:.1f}min — not gameplay")
            continue

        gameplay_count += 1

        # Extract and scale scoreboard ROI
        roi = frame[SCORE_ROI_TOP:SCORE_ROI_BOTTOM, SCORE_ROI_LEFT:SCORE_ROI_RIGHT]
        roi_large = cv2.resize(roi, None, fx=3, fy=3, interpolation=cv2.INTER_CUBIC)

        # OCR
        score = parse_score_with_easyocr(roi_large, reader)

        if score:
            score_count += 1
            readings.append((timestamp, score))

        if i % 100 == 0:
            score_str = f"{score['team1']} {score['score1']}-{score['team2']} {score['score2']}" if score else "no score"
            print(f"  [{i}/{len(frames)}] {timestamp/60:.1f}min — {score_str}")

    print(f"\n  Gameplay frames: {gameplay_count}/{len(frames)}")
    print(f"  Frames with score: {score_count}")
    return readings


def detect_score_changes(readings):
    """Find where the score changes."""
    if len(readings) < 2:
        return []

    changes = []
    prev_time, prev_score = readings[0]

    for t, score in readings[1:]:
        if prev_score is None:
            prev_time, prev_score = t, score
            continue

        # Score increased = goal
        if score["total"] > prev_score["total"]:
            if score["score1"] > prev_score["score1"]:
                scorer = score["team1"]
            elif score["score2"] > prev_score["score2"]:
                scorer = score["team2"]
            else:
                scorer = "unknown"

            old_score = f"{prev_score['score1']}-{prev_score['score2']}"
            new_score = f"{score['score1']}-{score['score2']}"
            goal_time = (prev_time + t) / 2

            changes.append({
                "timestamp": goal_time,
                "window_start": prev_time,
                "window_end": t,
                "score_before": old_score,
                "score_after": new_score,
                "scorer": scorer,
                "team1": score["team1"],
                "team2": score["team2"],
            })

        prev_time, prev_score = t, score

    return changes


def refine_goal_time(video_path, reader, change):
    """Extract frames at 1fps around the goal window to narrow down the exact moment."""
    start = change["window_start"]
    end = change["window_end"]

    print(f"  Refining {start:.0f}s-{end:.0f}s...")

    before_parts = change["score_before"].split("-")
    before_total = int(before_parts[0]) + int(before_parts[1])

    last_before = start
    first_after = end

    # Extract frames at 1fps in this window
    for t_offset in range(0, int(end - start) + 1):
        t = start + t_offset
        out_path = f"/tmp/fc26_refine_{t:.0f}.jpg"
        subprocess.run(
            ["ffmpeg", "-ss", str(t), "-i", video_path,
             "-frames:v", "1", "-q:v", "2", "-y", out_path],
            capture_output=True,
        )

        frame = cv2.imread(out_path)
        if frame is None:
            continue

        if not is_gameplay_frame(frame):
            continue

        roi = frame[SCORE_ROI_TOP:SCORE_ROI_BOTTOM, SCORE_ROI_LEFT:SCORE_ROI_RIGHT]
        roi_large = cv2.resize(roi, None, fx=3, fy=3, interpolation=cv2.INTER_CUBIC)
        score = parse_score_with_easyocr(roi_large, reader)

        if score:
            if score["total"] <= before_total:
                last_before = t
            else:
                first_after = t
                break

        # Clean up
        if os.path.exists(out_path):
            os.remove(out_path)

    refined = (last_before + first_after) / 2
    print(f"    → {refined:.1f}s (between {last_before:.0f}s and {first_after:.0f}s)")
    return refined


def run():
    print("=" * 60)
    print("FC26 GOAL DETECTOR v3 — Fast Batch OCR")
    print("=" * 60)
    print(f"Video: {VIDEO_PATH}")
    print()

    # Phase 1: Batch extract frames (fast — ffmpeg does it in one pass)
    os.makedirs(FRAME_DIR, exist_ok=True)

    existing = [f for f in os.listdir(FRAME_DIR) if f.endswith(".jpg")]
    if len(existing) > 100:
        print(f"Using {len(existing)} previously extracted frames")
    else:
        batch_extract_frames(VIDEO_PATH, FRAME_DIR, interval=SCAN_INTERVAL)

    # Phase 2: Initialize OCR and process frames
    print("\nInitializing EasyOCR...")
    import easyocr
    reader = easyocr.Reader(["en"], gpu=False, verbose=False)
    print("Ready.")

    readings = process_all_frames(FRAME_DIR, reader, interval=SCAN_INTERVAL)

    # Phase 3: Detect score changes
    print("\nDetecting score changes...")
    changes = detect_score_changes(readings)
    print(f"Found {len(changes)} score changes\n")

    for i, c in enumerate(changes):
        ts = c["timestamp"]
        print(f"  {i+1}. {ts/60:.1f}min — {c['score_before']} → {c['score_after']} ({c['scorer']})")

    # Phase 4: Refine timestamps
    if changes:
        print("\nRefining timestamps (1fps around each goal)...")
        for c in changes:
            c["refined_timestamp"] = refine_goal_time(VIDEO_PATH, reader, c)

    # Output
    print("\n" + "=" * 60)
    print(f"FINAL: {len(changes)} GOALS DETECTED")
    print("=" * 60)

    goals = []
    for i, c in enumerate(changes):
        ts = c.get("refined_timestamp", c["timestamp"])
        mins = int(ts // 60)
        secs = int(ts % 60)
        print(f"  Goal {i+1}: {mins}:{secs:02d} — "
              f"{c['score_before']} → {c['score_after']} ({c['scorer']})")

        goals.append({
            "index": i + 1,
            "timestamp": ts,
            "timestamp_formatted": f"{mins}:{secs:02d}",
            "score_before": c["score_before"],
            "score_after": c["score_after"],
            "scorer": c["scorer"],
            "team1": c["team1"],
            "team2": c["team2"],
        })

    output = {"video": VIDEO_PATH, "total_goals": len(goals), "goals": goals}

    with open(OUTPUT_JSON, "w") as f:
        json.dump(output, f, indent=2)

    print(f"\nSaved to: {OUTPUT_JSON}")
    return goals


if __name__ == "__main__":
    run()
