# FIFA Goal Montage

Beat-synced FIFA goal montage generator for TikTok. Detects goals from FC26 gameplay, extracts clips, and assembles a montage synced to music with visual effects.

## Scripts

- `fc26-goal-detector.py` — Detects goal moments from gameplay video using score overlay OCR
- `fifa-goal-montage.py` — Builds beat-synced montage with effects (camera shake, flash, slow-mo, Ken Burns, RGB split)
- `beat-sync-montage.py` — Generic beat-sync montage builder

## Usage

```bash
# 1. Detect goals
python3 fc26-goal-detector.py

# 2. Build montage (defaults to 60s)
python3 fifa-goal-montage.py
python3 fifa-goal-montage.py --duration 45
```

## Dependencies

- moviepy, librosa, numpy, Pillow
- ffmpeg, ffprobe
