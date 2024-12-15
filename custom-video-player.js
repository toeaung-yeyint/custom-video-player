const videoTitle = document.querySelector("#video-title");
videoTitle.parentElement.ariaLabel = `Video title: ${videoTitle.textContent}`;

const videoPublishedDate = document.querySelector("#video-published-date");
videoPublishedDate.parentElement.ariaLabel = `Published: ${videoPublishedDate.textContent}`;

const videoId = document.querySelector("#video-player").dataset.videoId;
const videoThumbnail = document.querySelector("#video-thumbnail");
videoThumbnail.style.backgroundImage = `url(https://img.youtube.com/vi/${videoId}/maxresdefault.jpg)`;

const videoDuration = document.querySelector("#video-duration");
videoDuration.ariaLabel = `Duration: ${videoDuration.textContent.trim()}`;

// select video control elements
const videoplayBtn = document.querySelector("#video-play-btn");
const videoPlayer = document.querySelector("#video-player");
const videoControls = document.querySelector("#video-controls");
const playPauseBtn = document.querySelector(".play-pause-btn");
const seekBar = document.querySelector(".seek-bar");
const seekBarLabel = document.querySelector('label[for="seek-bar"]');

let player;
function onYouTubeIframeAPIReady() {
	player = new YT.Player("video-player", {
		videoId: videoId,
		playerVars: {
			controls: 1,
			rel: 0,
		},
		events: {
			onReady: onPlayerReady,
			onStateChange: onPlayerStateChange,
		},
	});
}

function onPlayerReady() {}

function onPlayerStateChange(event) {}
