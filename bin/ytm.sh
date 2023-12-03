#!/bin/bash
echo "Download Starting..."
cd bin
./yt-dlp_linux -q -x --audio-format mp3 --audio-quality 0 $YTDL_LINK