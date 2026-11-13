# SRT Shifter

## What is it?

A small JavaScript tool to help you fix out-of-sync `.srt` subtitles by specifying a time offset.

> **⚠ Due to floating point inaccuracy, some lines may end up nudged forwards/backwards by a few milliseconds!**

> **⚠ If you specify a sufficiently large negative offset (or, although unlikely, the original file contains negative timecodes), some lines may be removed!**

## Instructions

1. Open `index.html` in your browser
1. Into the first text field, either:
    - copy&paste the content of a valid `.srt` file (you can open it in a text editor)
    - drag&drop an `.srt` file (if your browser supports it)
1. Optionally, edit the first field's content (preferably, according to [the SubRip format](https://en.wikipedia.org/wiki/SubRip#Format))
1. In the second field, specify a time offset (see **Offsets** below)
1. Press the button
1. Select and copy the newly created offset subtitle text from the third field into a new `.srt` file and either mux them into your video file or have your player like VLC open them in addition to the movie you want to play.

## Offsets

The format `±hours:minutes:seconds,milliseconds` only allows the `0123456789:,-+` character set.

### Valid examples
- `0,3` yields **positive** `300`milliseconds
- `3:0,678913` yields **positive** `3`minutes`0`seconds`678`milliseconds
- `-5834` yields **negative** `1`hour`37`minutes`14`seconds
- `449941,81` yields **positive** `124`hours`59`minutes`1`second`810`milliseconds
- `+000000:0:4,00` yields **positive** `4`seconds

### Invalid examples
- `3:01.4` dot (`.`) not allowed
- `76:867;5,87655` semi-colon (`;`) not allowed
- `—0,578` the first character is an em dash (`—`), not a hyphen (`-`)
- `+01:chair,8` what's the chair doing here?
- `+ 4:2:7` there's a space after the `+`
- `,841` lacks seconds
- `:325` lacks minutes
- `:475:230, ` lacks hours and milliseconds

## Merging SRT files

In order to merge multiple sources of subtitle indices, simply paste them all into the input field after one another. The script will first shift each index by the amount indicated and then order the resulting array by index start time, while discarding lines that end up with negative start or end times. That way, out of order indices are merged into one continuous string for output. Easy! (Make sure all the input is off by the same amount though, or preferably, zero. If not, make several runs and correct the offset for each input file first, then merge them together.)

## Support my work

If you'd like to support what I do, please consider tipping.  
[![Gittip](https://www.dropbox.com/s/23emy7ngeqdnrrc/logo_gittip.png?raw=1)](https://www.gittip.com/oelna/)  [![Flattr](https://www.dropbox.com/s/20legqru72ffddw/logo_flattr.png?raw=1)](https://flattr.com/submit/auto?user_id=oelna&url=https%3A%2F%2Fgithub.com%2Foelna%2Fsrt-shifter&title=srt-shifter&language=en&tags=github&category=software)