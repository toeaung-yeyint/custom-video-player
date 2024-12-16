// Utility functions
const formatTime = (seconds) => {
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
};

const initializePlayPauseBtn = () => {
	const playPauseBtn = document.createElement("button");
	playPauseBtn.innerHTML = '<img src="play-solid.svg" alt="" />';
	playPauseBtn.classList.add("control-btn", "play-pause-btn");
	playPauseBtn.setAttribute("aria-label", "Play");
	playPauseBtn.setAttribute("aria-pressed", "false");
	playPauseBtn.setAttribute("tabindex", "0");
	videoControls.appendChild(playPauseBtn);
};

const initializeProgressBar = () => {
	const progressBar = document.createElement("input");
	progressBar.type = "range";
	progressBar.classList.add("control-bar", "progress-bar");
	progressBar.value = 0;
	progressBar.max = 100;
	progressBar.setAttribute("aria-label", "seek");
	videoControls.appendChild(progressBar);

	const progressBarLabel = document.createElement("label");
	progressBarLabel.classList.add("progress-bar-label");
	progressBarLabel.setAttribute("for", "progress-bar");
	progressBarLabel.textContent = `0:00 / ${videoDuration.textContent.trim()}`;
	videoControls.appendChild(progressBarLabel);
};

const updateProgressBar = () => {
	if (player.getPlayerState() === 1) {
		const currentTime = player.getCurrentTime();
		const progress = (currentTime / player.getDuration()) * 100;
		progressBar.value = progress;
		progressBarLabel.textContent = `${formatTime(
			currentTime
		)} / ${videoDuration.textContent.trim()}`;
		progressBar.setAttribute(
			"aria-valuetext",
			`${formatTime(currentTime)} of ${videoDuration.textContent.trim()}`
		);
		setTimeout(updateProgressBar, 100);
	}
};

const initializeMuteBtn = () => {
	const muteBtn = document.createElement("button");
	muteBtn.innerHTML = '<img src="volume-up-solid.svg" alt="" />';
	muteBtn.classList.add("control-btn", "mute-btn");
	muteBtn.setAttribute("aria-label", "Mute");
	muteBtn.setAttribute("aria-pressed", "false");
	videoControls.appendChild(muteBtn);
};

const initializeVolumeBar = (e) => {
	const volumeBar = document.createElement("input");
	volumeBar.type = "range";
	volumeBar.classList.add("control-bar", "volume-bar");
	volumeBar.value = 100;
	volumeBar.max = 100;
	volumeBar.setAttribute("aria-label", "volume");
	videoControls.appendChild(volumeBar);
};

const initializeCaptionBtn = () => {
	const captionBtn = document.createElement("button");
	captionBtn.innerHTML = '<img src="closed-captioning-regular.svg" alt="" />';
	captionBtn.classList.add("control-btn", "caption-btn");
	captionBtn.setAttribute("aria-label", "Enabled captions");
	captionBtn.setAttribute("aria-pressed", "false");
	videoControls.appendChild(captionBtn);
};

const initializeSettingsBtn = () => {
	const settingsBtn = document.createElement("button");
	settingsBtn.innerHTML = '<img src="cog-solid.svg" />';
	settingsBtn.classList.add("control-btn", "settings-btn");
	settingsBtn.setAttribute("aria-label", "Settings");
	settingsBtn.setAttribute("aria-pressed", "false");
	settingsBtn.setAttribute("aria-expanded", "false");
	settingsBtn.setAttribute("aria-haspopup", "true");
	videoControls.appendChild(settingsBtn);

	const settingsMenu = document.createElement("div");
	settingsMenu.id = "settings-menu";
	const speedLabel = document.createElement("label");
	speedLabel.setAttribute("for", "playback-speed");
	speedLabel.textContent = "Playback Speed:";
	const speedSelect = document.createElement("select");
	speedSelect.id = "playback-speed";
	const speeds = [0.25, 0.5, 1, 1.5, 2];
	speeds.forEach((speed) => {
		const option = document.createElement("option");
		option.value = speed;
		option.textContent = `${speed}x`;
		if (speed === 1) option.selected = true;
		speedSelect.appendChild(option);
	});
	settingsMenu.appendChild(speedLabel);
	settingsMenu.appendChild(speedSelect);
	videoControls.appendChild(settingsMenu);
};

const initializeFullscreenBtn = () => {
	const fullscreenBtn = document.createElement("button");
	fullscreenBtn.innerHTML = '<img src="expand-solid.svg" alt="" />';
	fullscreenBtn.classList.add("control-btn", "fullscreen-btn");
	fullscreenBtn.setAttribute("aria-label", "Enter fullscreen");
	fullscreenBtn.setAttribute("aria-pressed", "false");
	videoControls.appendChild(fullscreenBtn);
};

const videoTitle = document.querySelector("#video-title");
videoTitle.parentElement.ariaLabel = `Video title: ${videoTitle.textContent}`;

const videoPublishedDate = document.querySelector("#video-published-date");
videoPublishedDate.parentElement.ariaLabel = `Published: ${videoPublishedDate.textContent}`;

const videoId = document.querySelector("#video-player").dataset.videoId;
const videoThumbnail = document.querySelector("#video-thumbnail");
videoThumbnail.style.backgroundImage = `url(https://img.youtube.com/vi/${videoId}/maxresdefault.jpg)`;

const thumbnailPlayBtn = document.querySelector("#thumbnail-play-btn");
thumbnailPlayBtn.ariaLabel = `Play, ${videoTitle.textContent}`;

const videoDuration = document.querySelector("#video-duration");
videoDuration.ariaLabel = `Duration: ${videoDuration.textContent.trim()}`;

const videoContainer = document.querySelector("#video-container");

const videoControls = document.createElement("div");
videoControls.id = "video-controls";
videoContainer.appendChild(videoControls);

initializePlayPauseBtn();
initializeProgressBar();
initializeMuteBtn();
initializeVolumeBar();
initializeCaptionBtn();
initializeSettingsBtn();
initializeFullscreenBtn();

const playPauseBtn = document.querySelector(".play-pause-btn");
const progressBar = document.querySelector(".progress-bar");
const progressBarLabel = document.querySelector(".progress-bar-label");
const muteBtn = document.querySelector(".mute-btn");
const volumeBar = document.querySelector(".volume-bar");
const captionBtn = document.querySelector(".caption-btn");
let isCaptionEnabled = false;
const settingsBtn = document.querySelector(".settings-btn");
const settingsMenu = document.querySelector("#settings-menu");
const speedSelect = document.querySelector("#playback-speed");
const fullscreenBtn = document.querySelector(".fullscreen-btn");

let isApiReady = false;
function onYouTubeIframeAPIReady() {
	if (isApiReady) return;
	isApiReady = true;
	player = new YT.Player("video-player", {
		videoId: videoId,
		playerVars: {
			controls: 0,
			rel: 0,
		},
		events: {
			onReady: onPlayerReady,
			onStateChange: onPlayerStateChange,
		},
	});
}

let isPlayerReady = false;
function onPlayerReady(event) {
	if (isPlayerReady) return;
	isPlayerReady = true;

	const videoPlayer = document.querySelector("#video-player");
	videoPlayer.setAttribute("tabindex", "-1");

	thumbnailPlayBtn.addEventListener("click", () => {
		const videoPlayer = document.querySelector("#video-player");
		videoThumbnail.style.display = "none";
		thumbnailPlayBtn.style.display = "none";
		videoDuration.style.display = "none";
		videoControls.style.visibility = "visible";
		videoPlayer.style.visibility = "visible";
		player.playVideo();
	});

	playPauseBtn.addEventListener("click", () => {
		player.getPlayerState() === 1 ? player.pauseVideo() : player.playVideo();
	});

	progressBar.addEventListener("input", (e) => {
		player.seekTo((player.getDuration() * e.target.value) / 100);
		const currentTime = player.getCurrentTime();
		progressBarLabel.textContent = `${formatTime(
			currentTime
		)} / ${videoDuration.textContent.trim()}`;
		progressBar.setAttribute(
			"aria-valuetext",
			`${formatTime(currentTime)} of ${videoDuration.textContent.trim()}}`
		);
	});

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

	captionBtn.addEventListener("click", () => {
		if (isCaptionEnabled) {
			captionBtn.innerHTML =
				'<img src="closed-captioning-regular.svg" alt="" />';
			captionBtn.ariaPressed = "false";
			player.setOption("captions", "track", {});
		} else {
			captionBtn.innerHTML = '<img src="closed-captioning-solid.svg" alt="" />';
			captionBtn.ariaPressed = "true";
			player.loadModule("captions");
			player.setOption("captions", "track", { languageCode: "en" });
		}
		isCaptionEnabled = !isCaptionEnabled;
	});

	settingsBtn.addEventListener("click", (e) => {
		e.stopPropagation();
		settingsBtn.classList.add("active");
		settingsMenu.classList.add("active");
		settingsBtn.ariaPressed = "true";
		settingsBtn.ariaExpanded = "true";
		speedSelect.focus();
	});

	settingsMenu.addEventListener("focusout", (e) => {
		if (!settingsMenu.contains(e.relatedTarget)) {
			settingsMenu.classList.remove("active");
			settingsBtn.classList.remove("active");
			settingsBtn.ariaPressed = "false";
			settingsBtn.ariaExpanded = "false";
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

	speedSelect.addEventListener("change", (e) => {
		player.setPlaybackRate(parseFloat(e.target.value));
	});

	document.addEventListener("click", (e) => {
		if (!settingsMenu.contains(e.target)) {
			settingsMenu.classList.remove("active");
			settingsBtn.classList.remove("active");
			settingsBtn.ariaPressed = "false";
			settingsBtn.ariaExpanded = "false";
		}
	});

	fullscreenBtn.addEventListener("click", () => {
		if (document.fullscreenElement) {
			document.exitFullscreen();
			videoControls.style.bottom = "-36px";
			fullscreenBtn.ariaPressed = "false";
		} else {
			videoContainer.requestFullscreen();
			videoControls.style.bottom = "0";
			fullscreenBtn.ariaPressed = "true";
		}
	});

	document.addEventListener("fullscreenchange", () => {
		const isFullscreen = !!document.fullscreenElement;
		if (isFullscreen) {
			videoControls.style.bottom = "0";
			fullscreenBtn.ariaPressed = "true";
		} else {
			videoControls.style.bottom = "-36px";
			fullscreenBtn.ariaPressed = "false";
		}
	});
}

function onPlayerStateChange(event) {
	if (event.data === 1) {
		playPauseBtn.innerHTML = '<img src="pause-solid.svg" alt="">';
		playPauseBtn.ariaPressed = "true";
		updateProgressBar();
	}
	if (event.data === 0) {
		const videoPlayer = document.querySelector("#video-player");
		playPauseBtn.innerHTML = '<img src="play-solid.svg" alt="" />';
		playPauseBtn.ariaPressed = "false";
		videoPlayer.style.visibility = "hidden";
		videoControls.style.visibility = "hidden";
		videoThumbnail.style.display = "block";
		thumbnailPlayBtn.style.display = "flex";
		videoDuration.style.display = "flex";
	}
	if (event.data === 2 || event.data === 3 || event.data === 5) {
		playPauseBtn.innerHTML = '<img src="play-solid.svg" alt="" />';
		playPauseBtn.ariaPressed = "false";
	}
}
