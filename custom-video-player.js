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

function onPlayerStateChange(event) {
	if (event.data === 1) {
		playPauseBtn.innerHTML = '<img src="pause-solid.svg" alt="">';
		playPauseBtn.ariaPressed = "true";
	}
	if (event.data === 0) {
		videoThumbnail.style.display = "block";
		videoplayBtn.style.display = "flex";
		videoDuration.style.display = "block";
		videoControls.style.visibility = "hidden";
		const videoPlayer = document.querySelector("#video-player");
		videoPlayer.style.visibility = "hidden";
		playPauseBtn.ariaPressed = "false";
	}
	if (event.data === 2 || event.data === 3 || event.data === 5) {
		playPauseBtn.innerHTML = '<img src="play-solid.svg" alt="" />';
		playPauseBtn.ariaPressed = "false";
	}
}

// Utility functions
function formatTime(seconds) {
	const hrs = Math.floor(seconds / 3600);
	const mins = Math.floor((seconds % 3600) / 60);
	const secs = Math.floor(seconds % 60);
	if (hrs > 0) {
		return `${hrs}:${mins.toString().padStart(2, "0")}:${secs
			.toString()
			.padStart(2, "0")}`;
	} else {
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	}
}
