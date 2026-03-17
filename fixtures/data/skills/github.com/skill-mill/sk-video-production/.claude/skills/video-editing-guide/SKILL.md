---
name: video-editing-guide
description: "Guide for programmatic video editing with FFmpeg and web-based tools. Use when building video processing pipelines or editing workflows."
metadata:
  tags: video, ffmpeg, editing, media, processing
---

Use FFmpeg as the core tool for programmatic video operations. For common tasks: trim clips with `-ss` (seek) and `-t` (duration) flags using input seeking for speed, concatenate files with the concat demuxer or filter, and adjust resolution with the scale filter (`-vf scale=1920:1080`). Choose codecs based on the output target — H.264 with AAC audio for broad web compatibility, H.265/HEVC for reduced file size when client support is guaranteed, and VP9/AV1 for open-format web delivery. Use the `-crf` flag (18-28 for H.264) to control quality with variable bitrate encoding, balancing file size against visual quality for each use case.

Implement batch processing pipelines for operations like generating thumbnails, creating preview clips, or transcoding uploads to multiple resolutions. Extract thumbnails at specific timestamps with `-ss` and `-frames:v 1`, or generate a thumbnail grid using the tile filter for visual preview strips. For adaptive streaming, encode to multiple bitrate ladders (1080p, 720p, 480p) and package with HLS or DASH manifests. Parallelize independent encoding jobs across available CPU cores, but be mindful of memory usage — each FFmpeg instance can consume significant RAM depending on resolution and filter complexity.

For format conversion workflows, probe input files with `ffprobe -print_format json` to extract metadata including codec, resolution, duration, and bitrate before deciding on processing parameters. Handle audio normalization with the loudnorm filter to target -14 LUFS for streaming platforms. Add watermarks or overlays using the overlay filter with precise positioning. When building web-based editing interfaces, consider using FFmpeg compiled to WebAssembly (ffmpeg.wasm) for client-side operations on short clips, reserving server-side processing for longer videos or compute-intensive operations like encoding and complex filter chains.
