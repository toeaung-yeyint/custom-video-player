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
const muteBtn = document.querySelector(".mute-btn");
const volumeBar = document.querySelector(".volume-bar");

let player;
function onYouTubeIframeAPIReady() {
	player = new YT.Player("video-player", {
		videoId: videoId,
		playerVars: {
			controls: 0,
			rel: 0,
			playsinline: 1,
		},
		events: {
			onReady: onPlayerReady,
			onStateChange: onPlayerStateChange,
		},
	});
}

function onPlayerReady() {
	videoplayBtn.addEventListener("click", handleThumbnailPlayBtn);
	playPauseBtn.addEventListener("click", handlePlayPauseBtn);
	seekBar.addEventListener("input", (e) => handleSeekBar(e));
	muteBtn.addEventListener("click", handleMuteBtn);
	volumeBar.addEventListener("input", (e) => handleVolumeBar(e));
}

function onPlayerStateChange(event) {
	if (event.data === 1) {
		playPauseBtn.innerHTML = '<img src="pause-solid.svg" alt="">';
		playPauseBtn.ariaPressed = "true";
		updateSeekBar();
	}
	if (event.data === 0) {
		videoThumbnail.style.display = "block";
		videoplayBtn.style.display = "flex";
		videoDuration.style.display = "flex";
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

const handleThumbnailPlayBtn = () => {
	videoThumbnail.style.display = "none";
	videoplayBtn.style.display = "none";
	videoDuration.style.display = "none";
	const videoPlayer = document.querySelector("#video-player");
	videoControls.style.visibility = "visible";
	videoPlayer.style.visibility = "visible";
	player.playVideo();
	playPauseBtn.focus();
};

const handlePlayPauseBtn = () => {
	if (player.getPlayerState() === 1) {
		player.pauseVideo();
	} else {
		player.playVideo();
	}
};

const handleSeekBar = (e) => {
	const seekTo = (player.getDuration() * e.target.value) / 100;
	player.seekTo(seekTo);
	const currentTime = player.getCurrentTime();
	seekBarLabel.textContent = `${formatTime(currentTime)} / ${formatTime(
		player.getDuration()
	)}`;
	seekBar.setAttribute(
		"aria-valuetext",
		`${formatTime(currentTime)} of ${videoDuration.textContent.trim()}`
	);
};

const updateSeekBar = () => {
	if (player.getPlayerState() === 1) {
		const currentTime = player.getCurrentTime();
		const progress = (currentTime / player.getDuration()) * 100;
		seekBar.value = progress;
		seekBarLabel.textContent = `${formatTime(
			currentTime
		)} / ${videoDuration.textContent.trim()}`;
		seekBar.setAttribute(
			"aria-valuetext",
			`${formatTime(currentTime)} of ${videoDuration.textContent.trim()}`
		);
		setTimeout(updateSeekBar, 100);
	}
};

const handleMuteBtn = () => {
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
};

const handleVolumeBar = (e) => {
	player.setVolume(e.target.value);
	if (Number.parseInt(e.target.value) === 0) {
		muteBtn.innerHTML = '<img src="volume-mute-solid.svg" alt="" />';
		muteBtn.ariaPressed = "true";
	} else {
		muteBtn.innerHTML = '<img src="volume-up-solid.svg" alt="" />';
		muteBtn.ariaPressed = "false";
	}
};
