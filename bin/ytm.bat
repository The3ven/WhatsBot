@echo off
setlocal ENABLEDELAYEDEXPANSION

@REM set PATH=!PATH!;bin
@REM --progress --newline
@REM del /q /f *.mp3
ECHO "Download Starting..."
@REM @ECHO !YTDL_LINK!
yt-dlp.exe -q -x --audio-format mp3 --audio-quality 0 !YTDL_LINK!

@REM for %%F in (.\*.mp3) do (
@REM @REM echo --------------------------------------
@REM @REM echo "%%~fF"
@REM set Path=%%~dpF
@REM set FileName=%%~nF
@REM set Ext=%%~xF
@REM @REM echo "!Path!!FileName:~0,10!!Ext!"
@REM move /Y "%%~fF" "!Path!!FileName:~0,10!!Ext!" > nul
@REM )
@REM set SONG_NAME=!FileName:~0,10!!Ext!
@REM ECHO SONG_NAME : !SONG_NAME!
@REM move .\*.mp3 ..\\public > nul
@REM ECHO "Download Done..."