const videoId = document.querySelector("#video-player").dataset.videoId;
const playPauseBtn = document.querySelector(".play-pause-btn");
const seekBar = document.querySelector(".seek-bar");
const muteBtn = document.querySelector(".mute-btn");
const volumeBar = document.querySelector(".volume-bar");
const fullscreenBtn = document.querySelector(".fullscreen-btn");
const settingsBtn = document.querySelector(".settings-btn");
const settingsMenu = document.querySelector("#settings-menu");
const playbackSpeedSelect = document.querySelector("#playback-speed");
const subtitleBtn = document.querySelector(".subtitle-btn");
const videoThumbnail = document.querySelector("#video-thumbnail");
const videoplayBtn = document.querySelector("#video-play-btn");
const videoControls = document.querySelector("#video-controls");
const videoDuration = document.querySelector("#video-duration");
const seekBarLabel = document.querySelector('label[for="seek-bar"]');

const videoTitle = document.querySelector("#video-title");
videoTitle.parentElement.ariaLabel = `Video title: ${videoTitle.textContent}`;

const videoPublishedDate = document.querySelector("#video-published-date");
videoPublishedDate.parentElement.ariaLabel = `Published: ${videoPublishedDate.textContent}`;

videoThumbnail.style.backgroundImage = `url(https://img.youtube.com/vi/${videoId}/maxresdefault.jpg)`;

videoDuration.ariaLabel = `Duration: ${videoDuration.textContent.trim()}`;

// Youtube Iframe API Reference: https://developers.google.com/youtube/iframe_api_reference
// When YouTube Iframe API is ready, create the YouTube player
let player;
let isCaptionEnabled = false;
// this function is triggered automatically once YouTube Iframe API is loaded
function onYouTubeIframeAPIReady() {
	player = new YT.Player("video-player", {
		videoId: videoId,
		playerVars: {
			controls: 0,
			rel: 0,
		},
		events: {
			onReady: onReady,
			onStateChange: onStateChange,
		},
	});
}

// Handle play/pause button click
// this function is triggered automatically when the YouTube player is completely initialized
// 0 – ended
// 1 – playing
// 2 – paused
// 3 – buffering
// 5 – video cued
function onReady() {
	const duration = player.getDuration() - 1;

	player.unloadModule("captions");
	// Initialize the volume bar with the current player volume
	const initialVolume = player.getVolume();
	volumeBar.value = initialVolume;

	playPauseBtn.addEventListener("click", () => {
		if (player.getPlayerState() === 1) {
			player.pauseVideo();
		} else {
			player.playVideo();
		}
	});

	seekBar.addEventListener("input", (e) => {
		const seekTo = (player.getDuration() * e.target.value) / 100;
		player.seekTo(seekTo);
	});

	// Update seek bar based on video progress
	setInterval(() => {
		const currentTime = player.getCurrentTime();
		if (duration > 0) {
			const progress = (currentTime / duration) * 100;
			seekBar.value = progress;
			seekBarLabel.textContent = `${formatTime(duration - currentTime)}`;
			seekBar.setAttribute(
				"aria-valuetext",
				`${formatTime(currentTime)} of ${formatTime(duration)}`
			);
		}
	}, 1000); // Update every 1 second

	muteBtn.addEventListener("click", () => {
		const isMuted = player.isMuted();

		if (isMuted) {
			player.unMute();
			volumeBar.value = player.getVolume();
			muteBtn.innerHTML = '<img src="volume-up-solid.svg" alt="" />';
			muteBtn.ariaPressed = "false";
		} else {
			player.mute();
			volumeBar.value = 0;
			muteBtn.innerHTML = '<img src="volume-mute-solid.svg" alt="" />';
			muteBtn.ariaPressed = "true";
		}
	});

	// Volume Bar Logic
	volumeBar.addEventListener("input", (e) => {
		player.setVolume(e.target.value);
		if (Number.parseInt(e.target.value) === 0) {
			muteBtn.innerHTML = '<img src="volume-mute-solid.svg" alt="" />';
			muteBtn.ariaPressed = "true";
		} else {
			muteBtn.innerHTML = '<img src="volume-up-solid.svg" alt="" />';
			muteBtn.ariaPressed = "false";
		}
	});

	fullscreenBtn.addEventListener("click", () => {
		const videoContainer = document.querySelector("#video-container");
		// Toggle fullscreen
		if (!document.fullscreenElement) {
			if (videoContainer.requestFullscreen) {
				// standard method for requesting fullscreen in modern browsers
				videoContainer.requestFullscreen();
			} else if (videoContainer.mozRequestFullScreen) {
				// Firefox
				videoContainer.mozRequestFullScreen();
			} else if (ifrvideoContainerame.webkitRequestFullscreen) {
				// Chrome, Safari, and Opera
				videoContainer.webkitRequestFullscreen();
			} else if (videoContainer.msRequestFullscreen) {
				// IE/Edge
				videoContainer.msRequestFullscreen();
			}
		} else {
			// standard method for exiting fullscreen in modern browsers
			if (document.exitFullscreen) {
				document.exitFullscreen();
			} else if (document.mozCancelFullScreen) {
				// Firefox
				document.mozCancelFullScreen();
			} else if (document.webkitExitFullscreen) {
				// Chrome, Safari, and Opera
				document.webkitExitFullscreen();
			} else if (document.msExitFullscreen) {
				// IE/Edge
				document.msExitFullscreen();
			}
		}
	});
	settingsBtn.addEventListener("click", (e) => {
		e.stopPropagation();
		const isActive = settingsMenu.classList.contains("active");
		if (isActive) {
			// Close the menu
			settingsBtn.classList.remove("active");
			settingsMenu.classList.remove("active");
			settingsBtn.ariaPressed = "false";
			settingsBtn.ariaExpanded = "false";
			settingsBtn.focus();
		} else {
			// Open the menu
			settingsBtn.classList.add("active");
			settingsMenu.classList.add("active");
			settingsBtn.ariaPressed = "true";
			settingsBtn.ariaExpanded = "true";
			playbackSpeedSelect.focus();
		}
	});

	settingsMenu.addEventListener("keydown", (e) => {
		if (e.key === "Escape") {
			settingsMenu.classList.remove("active");
			settingsBtn.classList.remove("active");
			settingsBtn.ariaPressed = "false";
			settingsBtn.ariaExpanded = "false";
			settingsBtn.focus();
		}
	});

	playbackSpeedSelect.addEventListener("change", (e) => {
		const speed = parseFloat(e.target.value);
		player.setPlaybackRate(speed);
	});

	// Handle subtitle toggle (turn subtitles on/off)
	subtitleBtn.addEventListener("click", () => {
		if (isCaptionEnabled) {
			subtitleBtn.innerHTML =
				'<img src="closed-captioning-regular.svg" alt="" />';
			subtitleBtn.ariaPressed = "false";
			player.setOption("captions", "track", {});
		} else {
			subtitleBtn.innerHTML =
				'<img src="closed-captioning-solid.svg" alt="" />';
			subtitleBtn.ariaPressed = "true";
			player.loadModule("captions");
			player.setOption("captions", "track", { languageCode: "en" });
		}
		isCaptionEnabled = !isCaptionEnabled;
	});

	videoThumbnail.addEventListener("click", playVideo);
	videoplayBtn.addEventListener("click", playVideo);
}

// Handle player state changes
// this function is triggered automatically whenever there is a change in the state of the video player
function onStateChange(event) {
	if (event.data === 1) {
		playPauseBtn.innerHTML = '<img src="pause-solid.svg" alt="">';
		playPauseBtn.ariaPressed = "true";
	}
	if (event.data === 0) {
		videoThumbnail.style.display = "block";
		videoplayBtn.style.display = "flex";
		videoDuration.style.display = "block";
		const videoPlayer = document.querySelector("#video-player");
		videoControls.style.visibility = "hidden";
		videoPlayer.style.visibility = "hidden";
	}
	if (event.data === 2 || event.data === 3 || event.data === 5) {
		playPauseBtn.innerHTML = '<img src="play-solid.svg" alt="" />';
		playPauseBtn.ariaPressed = "false";
	}
}

const playVideo = () => {
	videoThumbnail.style.display = "none";
	videoplayBtn.style.display = "none";
	videoDuration.style.display = "none";
	const videoPlayer = document.querySelector("#video-player");
	videoControls.style.visibility = "visible";
	videoPlayer.style.visibility = "visible";
	player.playVideo();
	playPauseBtn.focus();
};

// Close the menu if clicking anywhere else
document.addEventListener("click", (e) => {
	if (!settingsMenu.contains(e.target) && !settingsBtn.contains(e.target)) {
		settingsMenu.classList.remove("active");
		settingsBtn.classList.remove("active");
		settingsBtn.ariaPressed = "false";
		settingsBtn.ariaExpanded = "false";
	}
});

// Handle fullscreen changes triggered by Escape or programmatically
document.addEventListener("fullscreenchange", () => {
	const isFullscreen = !!document.fullscreenElement;
	if (!isFullscreen) {
		// Exit fullscreen
		videoControls.style.bottom = "-40px";
		fullscreenBtn.ariaPressed = "false";
		playPauseBtn.focus();
	} else {
		// Enter fullscreen
		videoControls.style.bottom = "0";
		fullscreenBtn.ariaPressed = "true";
	}
});

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
