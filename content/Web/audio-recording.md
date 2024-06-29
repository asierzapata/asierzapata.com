---
title: Recording Audio on the Web
draft: false
tags:
  - Audio
  - WebDevelopment
---

A few days ago, I started a new side project about having a meeting buddy. My initial concept was to have a page/app/extension that listened for my microphone and a call's audio and transcribed it. Around this, I had different ideas like adding the ability to bookmark a particular moment for later review, defining blocks to divide discussed topics, or summarizing the meeting. Pretty cool, I thought!

The MVP I had envisioned was doable since services like AWS Transcribe accept streamed audio to transcribe in real-time, with exciting features like [speaker diarization](https://en.wikipedia.org/wiki/Speaker_diarisation). I also found offline ML models to do speech-to-text with great accuracy, so I jumped right in.

That's when I found the web recording landscape and its many quirks. But first, a bit of theory!

## How can we record the microphone?

For recording in general, all major browsers support the bare spec of [`navigator.mediaDevices`](https://developer.mozilla.org/en-US/docs/Web/API/Media_Capture_and_Streams_API). This spec offers two distinct methods to get audio or video streams (or a combination of both) depending on the source. Two sources are available: the user source and the display source. The user source are those sources that are external to the "display" itself, where the display is anything related to what it is shown on the screen (that in theory includes the audio system, but more on that later)

If we wanted to record the microphone, we would pick the user source since they represent these external inputs outside the display itself. To do so, we would do something like this:

```javascript
try {
 const mediaStream = await navigator.mediaDevices.getUserMedia({
  video: true, // This activates the webcam
  audio: true, // This activates the microphone
 })
} catch (error) {
 /* handle the error */
}
```

Doing this, we would obtain a media stream of the microphone and the webcam if we wished. A `mediaStream` represents the stream of information from all the media tracks we selected. A `mediaTrack` is an individual source of streamed data. In this previous example, we would have a single `mediaStream` containing two `mediaTracks`, one for the webcam video and the other from the microphone.

The `getUserMedia` method accepts what is called `constraints`. In this example, I used the boolean constraints where I only defined whether I wanted the tracks. Here you could go deeper and constrain the track further by defining, for example, the video's dimensions like this: `video: { width: 1280, height: 720 }` or activating the microphone's echo cancelation like this `audio: { echoCancellation: true }`. If you want to read further about the different constraints and their support, you could check it out on the [MDN official page](https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints)

Once we have the stream, we can do a bunch of cool stuff! We could record it and save it into a file, or we could display it in an `html` tag, to give two examples.

## How can we record the system audio?

My rationale for recording the system audio was to use the other source I mentioned earlier. Using that method and the correct `constraints`, I thought I could get the audio stream I wanted. I tried this:

```javascript
try {
 const mediaStream = await navigator.mediaDevices.getDisplayMedia({
  video: false, // I didn't want the video, so I disabled it
  audio: true, // This would return me the audio of the recorded display part
 })
} catch (error) {
 /* handle the error */
}
```

This failed, and after looking for the reason, I found this quote on the MDN page.

> Since `getDisplayMedia()` requires a video track, if this option is set to `false` the promise will reject with a `TypeError`.

Okay, fair enough. I thought to myself, _"I can request the video and discard it; not ideal, but it should work"_

Then I tried this:

```javascript
try {
 const mediaStream = await navigator.mediaDevices.getDisplayMedia({
  video: false, // I didn't want the video, so I disabled it
  audio: true, // This would return me the audio of the recorded display part
 })
} catch (error) {
 /* handle the error */
}
```

Worked! No error, and the `mediaStream` was defined. I used the method `getAudioTracks` of the `mediaStream` to obtain just the audio, with the intention of discarding the video. That's where the quirks came kicking the door.

## Audio Loopback and browsers

As it turns out, that little audio stream is considered "optional". On Windows, it works fine, but on macOS and Linux, it is another story. Safari and Firefox do not offer support for this, and the only one having some of it is Chromium, but only with tabs inside the browser.

That left me with few options since if I wanted to make a website; it would be incredibly limited and work on a subset of all browsers (a major one, but still).

I explored doing this with a desktop app because I thought I would have more freedom. A bit misguided since if I wanted to do it with tools like Electron, I would be tethered to the same limiting browser. Electron has a documentation page about recording, and they explicitly have a caveat section describing [what I was experiencing](https://www.electronjs.org/docs/latest/api/desktop-capturer#caveats). They have the following quote:

> It is possible to circumvent this limitation by capturing system audio with another macOS app like Soundflower and passing it through a virtual audio input device.

That gave me the solution. Let's create an audio loopback!

The idea would be to code something to create a virtual audio loopback to pipe the system audio into my app. I could query the specific virtual device and get the audio stream. You might see where this is going.

After my preliminary research about it, I found that I could create an Audio Driver with [Driver Kit](https://developer.apple.com/documentation/driverkit) for macOS to create the virtual device using Swift (no problem, really) and C/C++ (oh no). For a little MVP, this really put the nail in the coffin.

I've looked at how big apps do this, and I saw that Loom literally does this. You have to opt-in to the feature by going into preferences and then switching the toggle `Use System Audio`. The first time, it will prompt you to install a driver. Then, once you record, you can see the magic in the input section of the audio preferences. The first screenshot is what it looks like without recording, and the other is recording.

![[without-audio-recording.png]]

![[with-audio-recording.png]]

You can see that there are two new inputs: `Loom Background Music` and `Loom Recording Device`. I suspect the one they connect to is the virtual input, but I don't know exactly how they are doing it.

For the Loom app, they are using Electron, proving that it is doable, but at a time investment that I can't assume for a simple MVP.

I hope this post helped you understand more about the recording on the web and its edge cases.
