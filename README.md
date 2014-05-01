# SRT Shifter

## What is this?

This is a small Javascript tool to help you fix out-of-sync .srt-format subtitles by specifying a time offset.

The offset can be positive or negative, depending on whether the subtitles or the movies are too early.

## Instructions

- Simply open index.html in your browser and copy&paste the content of a valid .srt subtitle file (you can open them in a text editor) into the input field on the page.
- Alternatively drag a .srt file into the input textfield (if your browser supports it)
- Optionally edit out lines you do not want, reorder or change text, etc.
- Specify a time offset, preferrably in this format: +00:01:20,100 (hours:minutes:seconds,milliseconds)
- Convert
- Select and copy the newly created offset subtitle text from the bottom field into a new .srt file and either mux them into your video file or have your player like VLC open them in addition to the movie you want to play.
- There is no step 3.