const videoTitle = document.querySelector("#video-title");
videoTitle.parentElement.ariaLabel = `Video title: ${videoTitle.textContent}`;

const videoPublishedDate = document.querySelector("#video-published-date");
videoPublishedDate.parentElement.ariaLabel = `Published: ${videoPublishedDate.textContent}`;

const iframeSrc = document.querySelector("#video-player").src;
const videoId = iframeSrc.split("/embed/")[1].split("?")[0];
const videoThumbnail = document.querySelector("#video-thumbnail");
videoThumbnail.style.backgroundImage = `url(https://img.youtube.com/vi/${videoId}/maxresdefault.jpg)`;

const videoDuration = document.querySelector("#video-duration");
videoDuration.ariaLabel = `Duration: ${videoDuration.textContent.trim()}`;

// select video control elements
const videoplayBtn = document.querySelector("#video-play-btn");
const videoControls = document.querySelector("#video-controls");

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
};

const initializePlayPauseBtn = () => {
  const playPauseBtn = document.createElement("button");
  playPauseBtn.innerHTML = '<img src="play-solid.svg" alt="" />';
  playPauseBtn.classList.add("control-btn", "play-pause-btn");
  playPauseBtn.setAttribute("aria-label", "Play");
  playPauseBtn.setAttribute("aria-pressed", "false");
  playPauseBtn.setAttribute("tabindex", "0");
  videoControls.appendChild(playPauseBtn);

  playPauseBtn.addEventListener("click", () => {
    if (player.getPlayerState() === 1) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  });
};

const initializeProgressBar = () => {
  const progressBar = document.createElement("input");
  progressBar.type = "range";
  progressBar.id = "progress-bar";
  progressBar.classList.add("control-bar", "progress-bar");
  progressBar.value = 0;
  progressBar.max = 100;
  progressBar.setAttribute("aria-label", "seek");
  videoControls.appendChild(progressBar);

  const progressBarLabel = document.createElement("label");
  progressBarLabel.setAttribute("for", "progress-bar");
  progressBarLabel.textContent = `${formatTime(
    player.getCurrentTime()
  )} / ${videoDuration.textContent.trim()}`;
  videoControls.appendChild(progressBarLabel);

  progressBar.addEventListener("input", (e) => {
    const seekTo = (player.getDuration() * e.target.value) / 100;
    player.seekTo(seekTo);
    const currentTime = player.getCurrentTime();
    progressBarLabel.textContent = `${formatTime(currentTime)} / ${formatTime(
      player.getDuration()
    )}`;
    progressBar.setAttribute(
      "aria-valuetext",
      `${formatTime(currentTime)} of ${videoDuration.textContent.trim()}`
    );
  });
};

const updateProgressBar = () => {
  const progressBar = document.querySelector(".progress-bar");
  const progressBarLabel = document.querySelector('label[for="progress-bar"]');
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
  muteBtn.addEventListener("click", () => {
    const volumeBar = document.querySelector(".volume-bar");
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
};

const initializeVolumeBar = (e) => {
  const volumeBar = document.createElement("input");
  volumeBar.type = "range";
  volumeBar.classList.add("control-bar", "volume-bar");
  volumeBar.value = 100;
  volumeBar.max = 100;
  volumeBar.setAttribute("aria-label", "volume");
  videoControls.appendChild(volumeBar);
  volumeBar.addEventListener("input", (e) => {
    const muteBtn = document.querySelector(".mute-btn");
    player.setVolume(e.target.value);
    if (Number.parseInt(e.target.value) === 0) {
      muteBtn.innerHTML = '<img src="volume-mute-solid.svg" alt="" />';
      muteBtn.ariaPressed = "true";
    } else {
      muteBtn.innerHTML = '<img src="volume-up-solid.svg" alt="" />';
      muteBtn.ariaPressed = "false";
    }
  });
};

const initializeCaptionBtn = () => {
  const captionBtn = document.createElement("button");
  captionBtn.innerHTML = '<img src="closed-captioning-regular.svg" alt="" />';
  captionBtn.classList.add("control-btn", "caption-btn");
  captionBtn.setAttribute("aria-label", "Enabled captions");
  captionBtn.setAttribute("aria-pressed", "false");
  videoControls.appendChild(captionBtn);
  let isCaptionEnabled = false;
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
};

// Create a YouTube video player after YouTube Iframe is ready
let player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player("video-player", {
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
    },
  });
}

function onPlayerReady() {
  videoThumbnail.addEventListener("click", handleThumbnailPlayBtn);
  videoplayBtn.addEventListener("click", handleThumbnailPlayBtn);
  initializePlayPauseBtn();
  initializeProgressBar();
  initializeMuteBtn();
  initializeVolumeBar();
  initializeCaptionBtn();
}

function onPlayerStateChange(event) {
  const playPauseBtn = document.querySelector(".play-pause-btn");
  if (event.data === 1) {
    playPauseBtn.innerHTML = '<img src="pause-solid.svg" alt="">';
    playPauseBtn.ariaPressed = "true";
    updateProgressBar();
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
