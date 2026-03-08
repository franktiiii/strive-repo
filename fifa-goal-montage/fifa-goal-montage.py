#!/usr/bin/env python3
"""
FIFA Goal Montage v5 — Beat-synced to Crank by Playboi Carti
Full effects: camera shake, RGB split, Ken Burns zoom, flash on cuts,
rapid-fire sections, celebrations shown clearly.

Usage:
    python3 fifa-goal-montage.py
    python3 fifa-goal-montage.py --duration 30
    python3 fifa-goal-montage.py --goals /tmp/goal_timestamps.json --duration 45
"""

import argparse
import json
import os
import random
import subprocess
import sys

import librosa
import numpy as np
from PIL import Image
from moviepy import (
    VideoFileClip,
    AudioFileClip,
    ColorClip,
    CompositeAudioClip,
    concatenate_videoclips,
    vfx,
)


# ============================================================================
# Configuration
# ============================================================================

VIDEO_PATH = "/Volumes/HDD/Final Cut Original Media/2026-03-07/UT+Fc26+Tap+in!!-2.mp4"
SONG_PATH = "/tmp/crank.mp3"
GOALS_JSON = "/tmp/goal_timestamps.json"
CLIPS_DIR = "/tmp/montage_goal_clips"
OUTPUT = "/Volumes/HDD/Tik TOK clips/Friday tiktok/fifa-goals-crank.mp4"
FPS = 60
WIDTH, HEIGHT = 1080, 1920

# How many seconds before/after the goal to extract
PRE_GOAL = 8
POST_GOAL = 8


# ============================================================================
# Effects
# ============================================================================

def color_grade(frame, brightness=112, contrast=1.08, saturation=0.92):
    """Subtle cinematic color grade for consistency."""
    img = frame.astype(np.float32)
    current = np.mean(img)
    if current > 10:
        img = img * (brightness / current)
    mean = np.mean(img)
    img = (img - mean) * contrast + mean
    gray = np.mean(img, axis=2, keepdims=True)
    img = img * saturation + gray * (1 - saturation)
    return np.clip(img, 0, 255).astype(np.uint8)


def zoom_frame(frame, factor):
    """Zoom into center of frame."""
    h, w = frame.shape[:2]
    new_h, new_w = int(h / factor), int(w / factor)
    y0 = (h - new_h) // 2
    x0 = (w - new_w) // 2
    cropped = frame[y0:y0 + new_h, x0:x0 + new_w]
    img = Image.fromarray(cropped)
    img = img.resize((w, h), Image.LANCZOS)
    return np.array(img)


def ken_burns_zoom(frame, t, seg_duration, start_factor=1.0, end_factor=1.06):
    """Smooth continuous zoom over duration (Ken Burns effect)."""
    progress = min(t / max(seg_duration, 0.01), 1.0)
    factor = start_factor + (end_factor - start_factor) * progress
    if factor <= 1.001:
        return frame
    return zoom_frame(frame, factor)


def white_flash_frame(frame, intensity):
    """Add white flash overlay."""
    return np.clip(frame.astype(np.float32) + 255 * intensity, 0, 255).astype(np.uint8)


def camera_shake(frame, intensity=8):
    """Random pixel offset to simulate camera shake on impact."""
    h, w = frame.shape[:2]
    dx = random.randint(-intensity, intensity)
    dy = random.randint(-intensity, intensity)
    # Pad frame so we can shift without losing pixels
    pad = abs(intensity) + 2
    padded = np.pad(frame, ((pad, pad), (pad, pad), (0, 0)), mode='edge')
    # Crop with offset
    y0 = pad + dy
    x0 = pad + dx
    shifted = padded[y0:y0 + h, x0:x0 + w]
    return shifted


def rgb_split(frame, offset=4):
    """Chromatic aberration — offset R and B channels."""
    result = frame.copy()
    if offset > 0 and frame.shape[1] > offset * 2:
        result[:, offset:, 0] = frame[:, :-offset, 0]   # R shift right
        result[:, :-offset, 2] = frame[:, offset:, 2]    # B shift left
    return result


# ============================================================================
# Clip Extraction
# ============================================================================

def extract_goal_clips(goals, video_path, output_dir):
    """Extract video clips around each goal timestamp."""
    os.makedirs(output_dir, exist_ok=True)

    clips = []
    for i, goal in enumerate(goals):
        ts = goal["timestamp"]
        start = max(0, ts - PRE_GOAL)
        duration = PRE_GOAL + POST_GOAL

        out_path = os.path.join(output_dir, f"goal_{i+1:02d}.mp4")

        if os.path.exists(out_path):
            try:
                probe = subprocess.run(
                    ["ffprobe", "-v", "error", "-show_entries", "format=duration",
                     "-of", "default=noprint_wrappers=1:nokey=1", out_path],
                    capture_output=True, text=True,
                )
                existing_dur = float(probe.stdout.strip())
                if existing_dur > 5:
                    print(f"  Goal {i+1}: using existing clip ({existing_dur:.1f}s)")
                    clips.append((out_path, goal))
                    continue
            except (ValueError, subprocess.SubprocessError):
                pass

        print(f"  Goal {i+1}: extracting {start:.1f}s - {start + duration:.1f}s...")

        subprocess.run(
            ["ffmpeg", "-ss", str(start), "-i", video_path,
             "-t", str(duration), "-c:v", "libx264", "-preset", "fast",
             "-c:a", "aac", "-y", out_path],
            capture_output=True,
        )

        if os.path.exists(out_path):
            clips.append((out_path, goal))

    print(f"  Extracted {len(clips)} goal clips")
    return clips


# ============================================================================
# Montage Assembly
# ============================================================================

def build_montage(goal_clips, song_path, duration, output_path):
    """Build beat-synced montage with full effects."""
    print("\n--- Beat Detection ---")

    # Analyze song
    y, sr = librosa.load(song_path, duration=duration)
    tempo, beat_frames = librosa.beat.beat_track(y=y, sr=sr)
    beat_times = librosa.frames_to_time(beat_frames, sr=sr)
    tempo_val = float(tempo) if np.ndim(tempo) == 0 else float(tempo[0])

    # Find beat drop
    onset_env = librosa.onset.onset_strength(y=y, sr=sr)
    onset_times = librosa.frames_to_time(np.arange(len(onset_env)), sr=sr)
    smooth = np.convolve(onset_env, np.ones(30) / 30, mode="same")
    drop_idx = np.argmax(np.diff(smooth))
    drop_time = float(onset_times[drop_idx])

    print(f"  Tempo: {tempo_val:.0f} BPM")
    print(f"  Beats: {len(beat_times)}")
    print(f"  Drop: {drop_time:.1f}s")

    # Trim beats to duration
    beat_times = beat_times[beat_times < duration]
    intervals = np.diff(beat_times)

    if len(intervals) == 0:
        print("Error: No beat intervals found")
        sys.exit(1)

    print(f"  Using {len(intervals)} beat intervals for {duration}s montage")

    # Also export beats JSON for FCPXML workflow
    beats_json = {"bpm": tempo_val, "beats": [float(b) for b in beat_times], "drop": drop_time}
    with open("/tmp/beats.json", "w") as f:
        json.dump(beats_json, f, indent=2)
    print(f"  Exported beats to /tmp/beats.json")

    # Load goal clips
    print("\n--- Loading Goal Clips ---")
    loaded_clips = []
    for clip_path, goal_info in goal_clips:
        try:
            clip = VideoFileClip(clip_path)
            loaded_clips.append((clip, goal_info))
            print(f"  {os.path.basename(clip_path)}: {clip.duration:.1f}s "
                  f"({goal_info.get('score_before', '?')} → {goal_info.get('score_after', '?')})")
        except Exception as e:
            print(f"  Skipped {clip_path}: {e}")

    if not loaded_clips:
        print("Error: No clips loaded")
        sys.exit(1)

    # --- Structured segment planning ---
    print("\n--- Planning Segments ---")

    drop_beat_idx = int(np.argmin(np.abs(beat_times - drop_time)))
    total_beats = len(beat_times)
    print(f"  Drop at beat {drop_beat_idx} ({beat_times[drop_beat_idx]:.1f}s), total beats: {total_beats}")

    # Build structured segment plan:
    # intro (10 beats) → pre-drop goals (7 beats each) → rapid (2 beats each) →
    # DROP (5 beats) → post-rapid (2 beats each) → sustained (5 beats each)
    segments_plan = []

    # 1. INTRO: 10 beats
    intro_end = min(10, drop_beat_idx - 16)
    if intro_end < 5:
        intro_end = 5
    segments_plan.append(("intro", 0, intro_end))

    # 2. PRE-DROP GOALS: 7 beats each (show goal + celebration)
    cursor = intro_end
    rapid_start = drop_beat_idx - 6  # leave 6 beats for pre-drop rapid (3×2)
    while cursor + 7 <= rapid_start:
        segments_plan.append(("pre_drop", cursor, cursor + 7))
        cursor += 7
    # Fill any remaining gap with one more pre-drop
    if cursor < rapid_start and rapid_start - cursor >= 3:
        segments_plan.append(("pre_drop", cursor, rapid_start))
        cursor = rapid_start

    # 3. PRE-DROP RAPID: 2 beats each (boom boom boom building to drop)
    while cursor + 2 <= drop_beat_idx - 1:
        segments_plan.append(("rapid_pre", cursor, cursor + 2))
        cursor += 2
    # Any leftover beat before drop
    if cursor < drop_beat_idx - 1:
        segments_plan.append(("rapid_pre", cursor, drop_beat_idx - 1))
        cursor = drop_beat_idx - 1

    # 4. THE DROP: 6 beats with slow-mo
    drop_end = min(cursor + 6, total_beats)
    segments_plan.append(("drop", cursor, drop_end))
    cursor = drop_end

    # 5. POST-DROP RAPID: 2 beats each (3-4 rapid celebration/goal flashes)
    rapid_post_count = 0
    while cursor + 2 <= min(cursor + 8, total_beats) and rapid_post_count < 4:
        segments_plan.append(("rapid_post", cursor, cursor + 2))
        cursor += 2
        rapid_post_count += 1

    # 6. SUSTAINED POST-DROP: 6 beats each (goal + FULL celebration)
    while cursor + 6 <= total_beats:
        segments_plan.append(("sustained", cursor, cursor + 6))
        cursor += 6
    if cursor < total_beats and total_beats - cursor >= 2:
        segments_plan.append(("sustained", cursor, total_beats))

    print(f"  Planned {len(segments_plan)} segments:")
    for stype, sb, eb in segments_plan:
        t_start = beat_times[sb] if sb < len(beat_times) else duration
        t_end = beat_times[eb] if eb < len(beat_times) else duration
        print(f"    {stype:12s}: beats {sb:2d}-{eb:2d} "
              f"({t_start:5.1f}s - {t_end:5.1f}s = {t_end - t_start:.1f}s)")

    # --- Assign clips and build segments ---
    print("\n--- Assembling Segments ---")
    segments = []
    clip_index = 0

    for seg_idx, (seg_type, start_beat, end_beat) in enumerate(segments_plan):
        t_start = beat_times[start_beat] if start_beat < len(beat_times) else duration
        t_end = beat_times[end_beat] if end_beat < len(beat_times) else duration
        seg_duration = t_end - t_start

        if seg_duration <= 0.05:
            continue

        # Get clip (cycle through all loaded clips)
        clip, goal_info = loaded_clips[clip_index % len(loaded_clips)]
        clip_index += 1

        # Goal moment is at center of clip (~8s in 16s clip)
        goal_moment = clip.duration / 2

        # --- Clip timing based on segment type ---
        if seg_type == "intro":
            # Build-up: show approach BEFORE the goal (Ken Burns zoom)
            clip_start = max(0, goal_moment - seg_duration - 0.5)
            clip_end = min(clip_start + seg_duration, clip.duration)

        elif seg_type == "pre_drop":
            # Goal + celebration: start 1.5s before goal, show through celebration
            clip_start = max(0, goal_moment - 1.5)
            clip_end = min(clip_start + seg_duration, clip.duration)

        elif seg_type in ("rapid_pre", "rapid_post"):
            # FAST: just the goal impact moment (ball hitting net)
            clip_start = max(0, goal_moment - 0.2)
            clip_end = min(clip_start + seg_duration, clip.duration)

        elif seg_type == "drop":
            # Center on goal moment for slow-mo
            clip_start = max(0, goal_moment - 1.0)
            clip_end = min(clip_start + seg_duration * 0.5, clip.duration)  # shorter source for slow-mo

        elif seg_type == "sustained":
            # Goal + FULL celebration: start just before goal, let celebration play out
            clip_start = max(0, goal_moment - 0.3)
            clip_end = min(clip_start + seg_duration, clip.duration)
            # If clip runs out, shift start back to fill duration
            if clip_end - clip_start < seg_duration - 0.05:
                clip_start = max(0, clip.duration - seg_duration)
                clip_end = clip.duration

        else:
            clip_start = max(0, goal_moment - seg_duration / 2)
            clip_end = min(clip_start + seg_duration, clip.duration)

        # Ensure valid clip range
        if clip_end - clip_start < 0.1:
            clip_start = max(0, clip.duration - seg_duration)
            clip_end = clip.duration

        segment = clip.subclipped(clip_start, min(clip_end, clip.duration))

        # Apply slow-mo on drop (0.5x = twice as long)
        if seg_type == "drop":
            segment = segment.with_effects([vfx.MultiplySpeed(0.5)])
            if segment.duration > seg_duration:
                segment = segment.subclipped(0, seg_duration)

        # Pad if too short
        if segment.duration < seg_duration - 0.05:
            extra = seg_duration - segment.duration
            new_start = max(0, clip_start - extra)
            new_end = min(new_start + seg_duration, clip.duration)
            segment = clip.subclipped(new_start, new_end)
            if seg_type == "drop":
                segment = segment.with_effects([vfx.MultiplySpeed(0.5)])
                if segment.duration > seg_duration:
                    segment = segment.subclipped(0, seg_duration)

        # --- Apply visual effects ---
        _seg_type = seg_type
        _seg_dur = seg_duration
        _seg_idx = seg_idx
        # Compute relative beat positions within this segment
        _seg_beats = [float(beat_times[b] - t_start)
                      for b in range(start_beat, min(end_beat, len(beat_times)))]

        def make_fx(seg, st=_seg_type, sd=_seg_dur, si=_seg_idx, beats=_seg_beats):
            def fx(get_frame, t):
                frame = get_frame(t)

                # Color grade everything
                frame = color_grade(frame)

                # --- Ken Burns on intro ---
                if st == "intro":
                    frame = ken_burns_zoom(frame, t, sd, 1.0, 1.06)

                # --- Flash + shake on EVERY beat for sustained clips ---
                if st == "sustained":
                    for bt in beats:
                        dist = abs(t - bt)
                        if dist < 0.04:
                            frame = white_flash_frame(frame, 0.12 * (1 - dist / 0.04))
                        if dist < 0.08:
                            frame = camera_shake(frame, intensity=5)

                # --- White flash on cuts (start of each segment) ---
                elif st == "pre_drop" and t < 0.04:
                    frame = white_flash_frame(frame, 0.10 * (1 - t / 0.04))
                elif st == "rapid_pre" and t < 0.05:
                    frame = white_flash_frame(frame, 0.25 * (1 - t / 0.05))
                elif st == "drop" and t < 0.15:
                    frame = white_flash_frame(frame, 0.7 * (1 - t / 0.15))
                elif st == "rapid_post" and t < 0.05:
                    frame = white_flash_frame(frame, 0.25 * (1 - t / 0.05))

                # --- Camera shake on beat hits ---
                if st == "rapid_pre" and t < 0.12:
                    frame = camera_shake(frame, intensity=10)
                elif st == "drop":
                    shake_intensity = int(18 * max(0, 1 - t / sd))
                    if shake_intensity > 2:
                        frame = camera_shake(frame, intensity=shake_intensity)
                elif st == "rapid_post" and t < 0.12:
                    frame = camera_shake(frame, intensity=10)

                # --- RGB split on drop ---
                if st == "drop" and t < 0.3:
                    offset = int(4 * (1 - t / 0.3))
                    if offset > 0:
                        frame = rgb_split(frame, offset)

                # --- Zoom (varies by section) ---
                if st == "rapid_pre":
                    frame = zoom_frame(frame, 1.04)
                elif st == "drop":
                    frame = zoom_frame(frame, 1.08)
                elif st == "rapid_post":
                    frame = zoom_frame(frame, 1.05)
                elif st == "sustained":
                    # Alternate between slight zoom levels for variety
                    zoom_level = 1.03 if si % 2 == 0 else 1.05
                    frame = zoom_frame(frame, zoom_level)

                return frame
            return seg.transform(fx)

        segment = make_fx(segment)
        segments.append(segment)

        print(f"  {len(segments):2d}. {seg_type:12s} clip={clip_index:2d} "
              f"[{clip_start:.1f}-{clip_end:.1f}s] → {segment.duration:.2f}s")

    if not segments:
        print("Error: No segments assembled")
        sys.exit(1)

    print(f"\n  Total: {len(segments)} segments")

    # Concatenate
    print("\n--- Final Assembly ---")
    final = concatenate_videoclips(segments, method="compose")

    if final.duration > duration:
        final = final.subclipped(0, duration)

    print(f"  Video duration: {final.duration:.1f}s")

    # Audio: song from beginning
    song = AudioFileClip(song_path)
    song_trimmed = song.subclipped(0, min(duration, song.duration, final.duration))

    audio_layers = [song_trimmed]

    # Voice callouts near drop
    for clip_path, goal_info in goal_clips[:2]:
        voice_path = clip_path.replace(".mp4", "_voice.wav")
        if os.path.exists(voice_path):
            try:
                voice = AudioFileClip(voice_path)
                voice_start = max(0, drop_time - 1.5)
                if voice_start < final.duration - 3:
                    voice = voice.with_volume_scaled(2.0).with_start(voice_start)
                    audio_layers.append(voice)
                    print(f"  Voice callout at {voice_start:.1f}s")
            except Exception:
                pass

    final_audio = CompositeAudioClip(audio_layers)
    final = final.with_audio(final_audio)

    # Render
    print(f"\n--- Rendering ---")
    print(f"  Output: {output_path}")
    print(f"  {WIDTH}x{HEIGHT}, {FPS}fps")

    final.write_videofile(
        output_path,
        fps=FPS,
        codec="libx264",
        audio_codec="aac",
        bitrate="8000k",
        preset="medium",
        threads=4,
        logger="bar",
    )

    # Clean up
    final.close()
    song.close()
    for clip, _ in loaded_clips:
        clip.close()

    print(f"\nDone! Montage saved to: {output_path}")


def main():
    parser = argparse.ArgumentParser(description="FIFA Goal Montage Builder v5")
    parser.add_argument("--goals", default=GOALS_JSON, help="Path to goal timestamps JSON")
    parser.add_argument("--duration", type=float, default=60, help="Montage duration in seconds")
    parser.add_argument("--output", default=OUTPUT, help="Output path")

    args = parser.parse_args()

    print("=" * 60)
    print("FIFA GOAL MONTAGE v5 — Full Effects + Beat Sync")
    print("=" * 60)

    # Load goal timestamps
    if not os.path.exists(args.goals):
        print(f"Error: Goal timestamps not found at {args.goals}")
        print("Run fc26-goal-detector.py first!")
        sys.exit(1)

    with open(args.goals) as f:
        data = json.load(f)

    goals = data["goals"]
    print(f"Loaded {len(goals)} detected goals")

    # Use ALL goals for the montage — full celebrations, full variety
    selected = goals

    print(f"Selected {len(selected)} goals for montage")

    # Extract clips
    print("\n--- Extracting Goal Clips ---")
    goal_clips = extract_goal_clips(selected, VIDEO_PATH, CLIPS_DIR)

    # Build montage
    build_montage(goal_clips, SONG_PATH, args.duration, args.output)


if __name__ == "__main__":
    main()
