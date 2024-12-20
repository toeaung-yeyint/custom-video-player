/**
 * Formats a given time in seconds into a string with the format HH:MM:SS or MM:SS.
 * @param {number} seconds - The time in seconds to format.
 * @returns {string} The formatted time string.
 */
const formatTime = (seconds) => {
	const hrs = Math.floor(seconds / 3600);
	const mins = Math.floor((seconds % 3600) / 60);
	const secs = Math.floor(seconds % 60);
	return hrs > 0
		? `${hrs}:${mins.toString().padStart(2, "0")}:${secs
				.toString()
				.padStart(2, "0")}`
		: `${mins}:${secs.toString().padStart(2, "0")}`;
};

/**
 * Initializes the thumbnail play button functionality.
 * When the thumbnail play button is clicked, it hides the video thumbnail,
 * hides the play button, hides the video duration, makes the video controls visible,
 * makes the video player visible, and starts playing the video.
 */
const initializeThumbnailPlayBtn = () => {
	const thumbnailPlayBtn = document.querySelector(".thumbnail-play-btn");
	thumbnailPlayBtn.addEventListener("click", () => {
		const videoPlayer = document.querySelector("#video-player");
		videoThumbnail.style.display = "none";
		thumbnailPlayBtn.style.display = "none";
		videoDuration.style.display = "none";
		videoControls.style.visibility = "visible";
		videoPlayer.style.visibility = "visible";
		player.playVideo();
	});
};

/**
 * Initializes the play/pause button for the custom video player.
 * Creates a button element with an image icon, sets its attributes,
 * and appends it to the video controls. It also adds an event listener to toggle
 * between playing and pausing the video when the button is clicked.
 */
const initializePlayPauseBtn = () => {
	const playPauseBtn = document.createElement("button");
	const playPauseIcon = document.createElement("img");
	playPauseIcon.setAttribute("src", "play-solid.svg");
	playPauseIcon.setAttribute("alt", "");
	playPauseBtn.appendChild(playPauseIcon);
	playPauseBtn.classList.add("control-btn", "play-pause-btn");
	playPauseBtn.setAttribute("aria-label", "Play");
	playPauseBtn.setAttribute("aria-pressed", "false");
	playPauseBtn.setAttribute("tabindex", "0");
	videoControls.appendChild(playPauseBtn);
	playPauseBtn.addEventListener("click", () => {
		player.getPlayerState() === 1 ? player.pauseVideo() : player.playVideo();
	});
};

/**
 * Initializes the progress bar for the custom video player.
 * Creates an input element of type range to serve as the progress bar,
 * and a label to display the current time and duration of the video.
 * Appends these elements to the video controls container.
 * Adds an input event listener to the progress bar to update the video's
 * current time and the label's text content as the user interacts with the progress bar.
 */
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
	progressBarLabel.textContent = `0:00 / ${videoDuration.textContent}`;
	videoControls.appendChild(progressBarLabel);
	progressBar.addEventListener("input", (e) => {
		player.seekTo((player.getDuration() * e.target.value) / 100);
		const currentTime = player.getCurrentTime();
		progressBarLabel.textContent = `${formatTime(currentTime)} / ${
			videoDuration.textContent
		}`;
		progressBar.setAttribute(
			"aria-valuetext",
			`${formatTime(currentTime)} of ${videoDuration.textContent}}`
		);
	});
};

/**
 * Updates the progress bar and its label based on the current playback time of the video player.
 * This function is called recursively every 100 milliseconds while the video is playing.
 * It retrieves the current playback time and calculates the progress percentage,
 * then updates the progress bar's value and label with the formatted current time and total duration.
 */
const updateProgressBar = () => {
	const progressBar = document.querySelector(".progress-bar");
	const progressBarLabel = document.querySelector(".progress-bar-label");
	if (player.getPlayerState() === 1) {
		const currentTime = player.getCurrentTime();
		const progress = (currentTime / player.getDuration()) * 100;
		progressBar.value = progress;
		progressBarLabel.textContent = `${formatTime(currentTime)} / ${
			videoDuration.textContent
		}`;
		progressBar.setAttribute(
			"aria-valuetext",
			`${formatTime(currentTime)} of ${videoDuration.textContent}`
		);
		setTimeout(updateProgressBar, 100);
	}
};

/**
 * Initializes the mute button for the custom video player.
 * Creates a button element with an image icon, sets its attributes, and appends it to the video controls.
 * Adds an event listener to handle the mute/unmute functionality, updating the button icon and volume bar.
 */
const initializeMuteBtn = () => {
	const muteBtn = document.createElement("button");
	const muteIcon = document.createElement("img");
	muteIcon.setAttribute("src", "volume-up-solid.svg");
	muteIcon.setAttribute("alt", "");
	muteBtn.appendChild(muteIcon);
	muteBtn.classList.add("control-btn", "mute-btn");
	muteBtn.setAttribute("aria-label", "Mute");
	muteBtn.setAttribute("aria-pressed", "false");
	videoControls.appendChild(muteBtn);
	muteBtn.addEventListener("click", () => {
		const isMuted = player.isMuted();
		const muteIcon = muteBtn.querySelector("img");
		const volumeBar = document.querySelector(".volume-bar");
		if (isMuted) {
			player.unMute();
			volumeBar.value = player.getVolume();
			muteIcon.src = "volume-up-solid.svg";
			muteBtn.ariaPressed = "false";
		} else {
			player.mute();
			volumeBar.value = 0;
			muteIcon.src = "volume-mute-solid.svg";
			muteBtn.ariaPressed = "true";
		}
	});
};

/**
 * Initializes the volume bar control for the custom video player.
 * Creates an input element of type range, sets its attributes, and appends it to the video controls.
 * Adds an event listener to update the player's volume and change the mute button icon based on the volume level.
 */
const initializeVolumeBar = () => {
	const volumeBar = document.createElement("input");
	volumeBar.type = "range";
	volumeBar.classList.add("control-bar", "volume-bar");
	volumeBar.value = 100;
	volumeBar.max = 100;
	volumeBar.setAttribute("aria-label", "Volume");
	videoControls.appendChild(volumeBar);
	volumeBar.addEventListener("input", (e) => {
		const muteBtn = document.querySelector(".mute-btn");
		const muteIcon = muteBtn.querySelector("img");
		player.setVolume(e.target.value);
		if (Number.parseInt(e.target.value) === 0) {
			muteIcon.src = "volume-mute-solid.svg";
			muteBtn.ariaPressed = "true";
		} else {
			muteIcon.src = "volume-up-solid.svg";
			muteBtn.ariaPressed = "false";
		}
	});
};

/**
 * Initializes the caption button for the custom video player.
 * Creates a button element with an image icon, sets its attributes, and appends it to the video controls.
 * Adds an event listener to toggle the captions on and off when the button is clicked.
 */
const initializeCaptionBtn = () => {
	const captionBtn = document.createElement("button");
	const captionIcon = document.createElement("img");
	captionIcon.setAttribute("src", "closed-captioning-solid.svg");
	captionIcon.setAttribute("alt", "");
	captionBtn.appendChild(captionIcon);
	captionBtn.classList.add("control-btn", "caption-btn");
	captionBtn.setAttribute("aria-label", "Enable captions");
	captionBtn.setAttribute("aria-pressed", "false");
	videoControls.appendChild(captionBtn);
	let isCaptionEnabled = true;
	captionBtn.addEventListener("click", () => {
		const captionIcon = captionBtn.querySelector("img");
		if (isCaptionEnabled) {
			captionIcon.src = "closed-captioning-regular.svg";
			captionBtn.setAttribute("aria-pressed", "false");
			player.setOption("captions", "track", {});
		} else {
			captionIcon.src = "closed-captioning-solid.svg";
			captionBtn.setAttribute("aria-pressed", "true");
			player.loadModule("captions");
			player.setOption("captions", "track", { languageCode: "en" });
		}
		isCaptionEnabled = !isCaptionEnabled;
	});
};

/**
 * Initializes the settings button and menu for the custom video player.
 * Creates a settings button with an icon, appends it to the video controls,
 * and sets up a settings menu with playback speed options.
 * Adds event listeners to handle interactions with the settings button and menu, including opening and closing the menu,
 * changing playback speed, and handling focus and keyboard events.
 *
 */
const initializeSettingsBtn = () => {
	const settingsBtn = document.createElement("button");
	const settingsIcon = document.createElement("img");
	settingsIcon.setAttribute("src", "cog-solid.svg");
	settingsIcon.setAttribute("alt", "");
	settingsBtn.appendChild(settingsIcon);
	settingsBtn.classList.add("control-btn", "settings-btn");
	settingsBtn.setAttribute("aria-label", "Settings");
	settingsBtn.setAttribute("aria-pressed", "false");
	settingsBtn.setAttribute("aria-expanded", "false");
	settingsBtn.setAttribute("aria-haspopup", "true");
	videoControls.appendChild(settingsBtn);
	const settingsMenu = document.createElement("div");
	settingsMenu.classList.add("settings-menu");
	const speedLabel = document.createElement("label");
	speedLabel.setAttribute("for", "playback-speed");
	speedLabel.textContent = "Playback Speed:";
	const speedSelect = document.createElement("select");
	speedSelect.classList.add("playback-speed");
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
	settingsBtn.addEventListener("click", (e) => {
		e.stopPropagation();
		settingsBtn.classList.add("active");
		settingsMenu.classList.add("active");
		settingsBtn.setAttribute("aria-pressed", "true");
		settingsBtn.setAttribute("aria-expanded", "true");
		speedSelect.focus();
	});
	settingsMenu.addEventListener("focusout", (e) => {
		if (!settingsMenu.contains(e.relatedTarget)) {
			settingsMenu.classList.remove("active");
			settingsBtn.classList.remove("active");
			settingsBtn.setAttribute("aria-pressed", "false");
			settingsBtn.setAttribute("aria-expanded", "false");
		}
	});
	settingsMenu.addEventListener("keydown", (e) => {
		if (e.key === "Escape") {
			settingsMenu.classList.remove("active");
			settingsBtn.classList.remove("active");
			settingsBtn.setAttribute("aria-pressed", "false");
			settingsBtn.setAttribute("aria-expanded", "false");
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
			settingsBtn.setAttribute("aria-pressed", "false");
			settingsBtn.setAttribute("aria-expanded", "false");
		}
	});
};

/**
 * Initializes the fullscreen button for the custom video player.
 * Creates a button element with an icon, sets its attributes, and appends it to the video controls.
 * Adds event listeners to handle entering and exiting fullscreen mode, and updates the button's state accordingly.
 */
const initializeFullscreenBtn = () => {
	const fullscreenBtn = document.createElement("button");
	const fullscreenIcon = document.createElement("img");
	fullscreenIcon.setAttribute("src", "expand-solid.svg");
	fullscreenIcon.setAttribute("alt", "");
	fullscreenBtn.appendChild(fullscreenIcon);
	fullscreenBtn.classList.add("control-btn", "fullscreen-btn");
	fullscreenBtn.setAttribute("aria-label", "Enter fullscreen");
	fullscreenBtn.setAttribute("aria-pressed", "false");
	videoControls.appendChild(fullscreenBtn);
	fullscreenBtn.addEventListener("click", () => {
		if (document.fullscreenElement) {
			document.exitFullscreen();
			videoControls.style.bottom = "-36px";
			fullscreenBtn.setAttribute("aria-pressed", "false");
		} else {
			videoContainer.requestFullscreen();
			videoControls.style.bottom = "0";
			fullscreenBtn.setAttribute("aria-pressed", "true");
		}
	});

	document.addEventListener("fullscreenchange", () => {
		const isFullscreen = !!document.fullscreenElement;
		if (isFullscreen) {
			videoControls.style.bottom = "0";
			fullscreenBtn.setAttribute("aria-pressed", "true");
		} else {
			videoControls.style.bottom = "-36px";
			fullscreenBtn.setAttribute("aria-pressed", "false");
		}
	});
};

// Retrieves the video ID from the data attribute of the element to create a video-player.
const videoId = document.querySelector("#video-player").dataset.videoId;

// Set the video thumbnail, play button, and duration based on the video ID.
const videoThumbnail = document.querySelector(".video-thumbnail");
videoThumbnail.style.backgroundImage = `url(https://img.youtube.com/vi/${videoId}/maxresdefault.jpg)`;
const thumbnailPlayBtn = document.querySelector(".thumbnail-play-btn");
thumbnailPlayBtn.setAttribute(
	"aria-label",
	`Play, ${document.querySelector(".video-title").textContent}`
);

// Select video duration element to display the total duration of the video.
const videoDuration = document.querySelector(".video-duration");

// Select video Container and video Controls for the custom video player.
const videoContainer = document.querySelector(".video-container");
const videoControls = document.querySelector(".video-controls");

/**
 * This function is called when the YouTube IFrame API is ready.
 * It initializes the YouTube player if it hasn't been initialized already.
 */
let isApiReady = false;
function onYouTubeIframeAPIReady() {
	if (isApiReady) return;
	isApiReady = true;
	player = new YT.Player("video-player", {
		videoId: videoId,
		playerVars: {
			controls: 0,
			rel: 0,
			cc_load_policy: 1,
		},
		events: {
			onReady: onPlayerReady,
			onStateChange: onPlayerStateChange,
		},
	});
}

/**
 * Initializes the video player and its controls once the player is ready.
 * Ensures that the initialization occurs only once.
 */
let isPlayerReady = false;
function onPlayerReady() {
	if (isPlayerReady) return;
	isPlayerReady = true;
	const videoPlayer = document.querySelector("#video-player");
	videoPlayer.setAttribute("tabindex", "-1");
	initializeThumbnailPlayBtn();
	initializePlayPauseBtn();
	initializeProgressBar();
	initializeMuteBtn();
	initializeVolumeBar();
	initializeCaptionBtn();
	initializeSettingsBtn();
	initializeFullscreenBtn();
}

/**
 * Handles the state change of the video player.
 * 0: ended,
 * 1: playing,
 * 2: paused,
 * 3: buffering,
 * 5: video cued.
 */
function onPlayerStateChange(event) {
	const videoPlayer = document.querySelector("#video-player");
	const playPauseBtn = document.querySelector(".play-pause-btn");
	const playPauseIcon = playPauseBtn.querySelector("img");
	if (event.data === 1) {
		playPauseIcon.src = "pause-solid.svg";
		playPauseBtn.ariaPressed = "true";
		updateProgressBar();
	}
	if (event.data === 0) {
		playPauseIcon.src = "play-solid.svg";
		playPauseBtn.ariaPressed = "false";
		videoPlayer.style.visibility = "hidden";
		videoControls.style.visibility = "hidden";
		videoThumbnail.style.display = "block";
		thumbnailPlayBtn.style.display = "flex";
		videoDuration.style.display = "flex";
	}
	if (event.data === 2 || event.data === 3 || event.data === 5) {
		playPauseIcon.src = "play-solid.svg";
		playPauseBtn.ariaPressed = "false";
	}
}
