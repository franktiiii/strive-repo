#!/usr/bin/env python3
"""
Beat-Sync Montage Generator
Takes a song + video clips, cuts clips on beat timestamps, exports a montage.

Usage:
    python3 beat-sync-montage.py --song music.mp3 --clips clip1.mp4 clip2.mp4 ...
    python3 beat-sync-montage.py --song music.mp3 --clips-dir /path/to/clips/
    python3 beat-sync-montage.py --song music.mp3 --clips-dir /path/to/clips/ --duration 30 --output montage.mp4
"""

import argparse
import glob
import os
import random
import sys

import librosa
import numpy as np
from moviepy import VideoFileClip, concatenate_videoclips, AudioFileClip


def detect_beats(song_path, duration=None):
    """Detect beat timestamps in a song."""
    print(f"Analyzing beats in: {os.path.basename(song_path)}")
    y, sr = librosa.load(song_path, duration=duration)
    tempo, beat_frames = librosa.beat.beat_track(y=y, sr=sr)
    beat_times = librosa.frames_to_time(beat_frames, sr=sr)

    # Handle tempo being an array
    tempo_val = float(tempo) if np.ndim(tempo) == 0 else float(tempo[0])
    print(f"  Detected tempo: {tempo_val:.0f} BPM")
    print(f"  Found {len(beat_times)} beats")
    return beat_times


def load_clips(clip_paths):
    """Load video clips from paths."""
    clips = []
    for path in clip_paths:
        try:
            clip = VideoFileClip(path)
            clips.append((path, clip))
            print(f"  Loaded: {os.path.basename(path)} ({clip.duration:.1f}s)")
        except Exception as e:
            print(f"  Skipped {os.path.basename(path)}: {e}")
    return clips


def build_montage(clips, beat_times, song_path, duration=None, output="montage.mp4"):
    """Cut clips on beat timestamps and assemble montage."""
    if not clips:
        print("Error: No clips loaded.")
        sys.exit(1)

    # Calculate intervals between beats
    intervals = np.diff(beat_times)

    if duration:
        # Trim beat_times to desired duration
        beat_times = beat_times[beat_times < duration]
        intervals = np.diff(beat_times)

    print(f"\nBuilding montage with {len(intervals)} cuts...")

    segments = []
    clip_index = 0

    for i, interval in enumerate(intervals):
        # Cycle through clips, picking random start points
        path, clip = clips[clip_index % len(clips)]
        clip_index += 1

        # Pick a random segment from this clip that fits the beat interval
        max_start = max(0, clip.duration - interval)
        if max_start <= 0:
            # Clip is shorter than interval, use the whole thing
            segment = clip.subclipped(0, min(interval, clip.duration))
        else:
            start = random.uniform(0, max_start)
            segment = clip.subclipped(start, start + interval)

        segments.append(segment)

    if not segments:
        print("Error: No segments created.")
        sys.exit(1)

    print(f"  Assembled {len(segments)} segments")

    # Concatenate all segments
    final = concatenate_videoclips(segments, method="compose")

    # Replace audio with the song
    song_audio = AudioFileClip(song_path)
    if duration:
        song_audio = song_audio.subclipped(0, min(duration, song_audio.duration))
    final = final.with_audio(song_audio.subclipped(0, final.duration))

    print(f"  Total duration: {final.duration:.1f}s")
    print(f"  Exporting to: {output}")

    final.write_videofile(
        output,
        fps=30,
        codec="libx264",
        audio_codec="aac",
        preset="medium",
        threads=4,
        logger="bar",
    )

    # Clean up
    for _, clip in clips:
        clip.close()
    final.close()
    song_audio.close()

    print(f"\nDone! Montage saved to: {output}")


def main():
    parser = argparse.ArgumentParser(description="Beat-Sync Montage Generator")
    parser.add_argument("--song", required=True, help="Path to the song/music file")
    parser.add_argument("--clips", nargs="*", help="Paths to video clip files")
    parser.add_argument("--clips-dir", help="Directory containing video clips")
    parser.add_argument("--duration", type=float, help="Max duration in seconds (e.g., 30 for a 30s TikTok)")
    parser.add_argument("--output", default="montage.mp4", help="Output file path (default: montage.mp4)")
    parser.add_argument("--shuffle", action="store_true", help="Shuffle clip order")

    args = parser.parse_args()

    if not args.clips and not args.clips_dir:
        parser.error("Provide either --clips or --clips-dir")

    # Gather clip paths
    clip_paths = list(args.clips or [])
    if args.clips_dir:
        for ext in ("*.mp4", "*.mov", "*.avi", "*.mkv", "*.webm", "*.m4v"):
            clip_paths.extend(glob.glob(os.path.join(args.clips_dir, ext)))

    clip_paths = sorted(set(clip_paths))

    if not clip_paths:
        print("Error: No video files found.")
        sys.exit(1)

    if args.shuffle:
        random.shuffle(clip_paths)

    print(f"Song: {args.song}")
    print(f"Clips: {len(clip_paths)} files")
    if args.duration:
        print(f"Target duration: {args.duration}s")
    print()

    # Detect beats
    beat_times = detect_beats(args.song, duration=args.duration)

    # Load clips
    print("\nLoading clips...")
    clips = load_clips(clip_paths)

    # Build montage
    build_montage(clips, beat_times, args.song, duration=args.duration, output=args.output)


if __name__ == "__main__":
    main()
