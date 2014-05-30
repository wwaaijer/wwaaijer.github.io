// 
//    Needs "multi_browser.js"
//

/*
 * videostream.js
 *     This script will try to acquire a video stream from the user.
 *     Once the stream is acquired it is played in a HTML5 video element.
 *     
 * videostream.video
 *      A HTML5 video element.
 *      Once there is a videostream acquired the stream will be playing in this 
 *      element.
 *  
 * videostream.playing
 *      A boolean value.
 *      Set to true once the video stream is playing in "videostream.video".
 *  
 * videostream.onStreamStart
 *      A callback function.
 *      If the videostream is acquired this function is called once. After this
 *      "videostream.playing" is set to true.
 */

videostream = {
    video: document.createElement("video"),
    playing: false,
    onStreamStart: false
};

addListener(window, "load", function() {
    if (typeof navigator.getUserMedia == "undefined")
        return console.log("(videostream) getUserMedia is not supported!");

    console.log("(videostream) Acquiring videostream ...");
    navigator.getUserMedia({video: true, audio: false}, onVideoStreamAcquired, onVideoStreamError);

    function onVideoStreamAcquired(userMediaStream) {
        console.log("(videostream) Videostream acquired, starting ...");
        addListener(videostream.video, "playing", mediaStreamStartCheck);
        videostream.video.autoplay = 1;
        videostream.video.src = window.URL.createObjectURL(userMediaStream);
    }

    function onVideoStreamError(e) {
        console.log("(videostream) Acquiring videostream failed!", e);
    }

    function mediaStreamStartCheck() {
        console.log("(videostream) Checking videostream status ...");
        if (videostream.video.videoWidth) {
            removeListener(videostream.video, "playing", mediaStreamStartCheck);
            onMediaStreamStart();
        } else {
            window.requestAnimationFrame(mediaStreamStartCheck);
        }
    }

    function onMediaStreamStart() {
        videostream.width = videostream.video.videoWidth;
        videostream.height = videostream.video.videoHeight;
        videostream.playing = true;
        
        console.log("(videostream) Videostream started (" + videostream.video.videoWidth + "x" + videostream.video.videoHeight + ").");

        if (typeof videostream.onStreamStart == "function")
            videostream.onStreamStart();
    }
});