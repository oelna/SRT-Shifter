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

## Merging SRT files

In order to merge multiple sources of subtitle indices, simply paste them all into the input field after one another. The script will first shift each index by the amount indicated and then order the resulting array by index start time. That way, out of order indices are merged into one continuous string for output. Easy! (Make sure all input is off by the same amount though, or preferably, zero. If not, make several runs and correct the offset for each input file first, then merge them together.)

## Support my work

If you'd like to support what I do, please consider tipping.  
[![Gittip](https://dl.dropboxusercontent.com/u/19750980/logo_gittip.png)](https://www.gittip.com/oelna/)  [![Flattr](https://dl.dropboxusercontent.com/u/19750980/logo_flattr.png)](https://flattr.com/submit/auto?user_id=oelna&url=https%3A%2F%2Fgithub.com%2Foelna%2FSRT-Shifter&title=srt-shifter&language=en&tags=github&category=software)
