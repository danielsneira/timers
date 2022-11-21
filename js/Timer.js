export default class Timer {
	constructor(label, minutes) {
		this.interval = null;
		this.label = label;
		this.minutes = minutes;
		this.remainingSeconds = minutes * 60;
		this.container = document.createElement("div");
		this.audio = new Audio("../assets/audio/beep.mp3");

		// Create html elements from JS
		let labelContainer = document.createElement("span");
		let minutesContainer = document.createElement("span");
		let seconds = document.createElement("span");
		let separator = document.createElement("span");
		let reset = document.createElement("button");
		let stop = document.createElement("button");
		let start = document.createElement("button");
		let startSpan = document.createElement("span");
		let resetSpan = document.createElement("span");
		let stopSpan = document.createElement("span");

		// Adding CSS classes
		this.container.classList.add("timer", "timer__container");
		this.container.id = label;
		labelContainer.classList.add("timer__part", "timer__part--label");
		minutesContainer.classList.add("timer__part", "timer__part--minutes");
		seconds.classList.add("timer__part", "timer__part--seconds");
		separator.classList.add("timer__part");
		reset.classList.add(
			"timer__btn",
			"timer__btn--control",
			"timer__btn--reset"
		);
		stop.classList.add("timer__btn", "timer__btn--control", "timer__btn--stop");
		start.classList.add(
			"timer__btn",
			"timer__btn--control",
			"timer__btn--start"
		);
		startSpan.classList.add("material-icons");
		resetSpan.classList.add("material-icons");
		stopSpan.classList.add("material-icons");

		// Inner text of HTML elements
		labelContainer.innerText = label;
		minutesContainer.textContent = minutes;
		seconds.textContent = 0;
		separator.innerHTML = ":";
		startSpan.innerText = "play_arrow";
		resetSpan.innerText = "restart_alt";
		stopSpan.innerText = "pause";

		// Adding elements to containers
		reset.appendChild(resetSpan);
		stop.appendChild(stopSpan);
		start.appendChild(startSpan);
		this.container.appendChild(labelContainer);
		this.container.appendChild(minutesContainer);
		this.container.appendChild(separator);
		this.container.appendChild(seconds);
		this.container.appendChild(reset);
		this.container.appendChild(stop);
		this.container.appendChild(start);

		// Fix interface to see two digits in minutes and seconds
		this.updateInterfaceTime();

		// Adds events to buttons
		this.init();
	}

	init() {
		let el = {
			start: this.container.querySelector(".timer__btn--start"),
			reset: this.container.querySelector(".timer__btn--reset"),
			stop: this.container.querySelector(".timer__btn--stop"),
		};

		el.start.addEventListener("click", () => this.start());
		el.reset.addEventListener("click", () => this.reset());
		el.stop.addEventListener("click", () => this.stop());
	}

	updateInterfaceTime() {
		let minutes = Math.floor(this.remainingSeconds / 60);
		let seconds = this.remainingSeconds % 60;
		if (this.remainingSeconds < 0) {
			minutes = Math.ceil(this.remainingSeconds / 60);
		}

		let el = {
			minutes: this.container.querySelector(".timer__part--minutes"),
			seconds: this.container.querySelector(".timer__part--seconds"),
		};

		el.minutes.textContent = minutes.toString().padStart(2, "0");
		el.seconds.textContent = seconds.toString().padStart(2, "0");
	}

	start() {
		if (this.remainingSeconds === 0 || this.interval !== null) return;

		this.interval = setInterval(() => {
			this.remainingSeconds--;
			this.updateInterfaceTime();

			if (this.remainingSeconds === 0) {
				this.playSound();
			}
		}, 1000);
	}

	reset() {
		let inputMinutes = prompt("Enter number of minutes: ");
		let inputSeconds = prompt("Enter number of seconds: ");

		if (inputMinutes < 99) {
			this.stop();
			this.remainingSeconds =
				parseInt(inputMinutes * 60) + parseInt(inputSeconds);
			this.updateInterfaceTime();
		}
	}

	stop() {
		clearInterval(this.interval);
		this.interval = null;
		this.audio.pause();
		this.container.classList.remove("sound")
	}

	playSound() {
		clearInterval(this.interval);
		this.interval = setInterval(() => {
			this.audio.play();
			this.container.classList.toggle("sound")
		}, 1000);
	}

	getHTML() {
		return this.container;
	}
}
