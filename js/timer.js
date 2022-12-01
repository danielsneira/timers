const CLASS_TIME_BUTTON_START = "timer__btn--start";
const CLASS_TIME_BUTTON_RESET = "timer__btn--reset";
const CLASS_TIME_BUTTON_STOP = "timer__btn--stop";
const CLASS_TIME_BUTTON_SET = "timer__btn--set";
const MINUTES_TO_SECONDS = 60;
const MILLISECONDS_TO_SECONDS = 1000;
const TIMER_STOP = 0;
const MIN_TIMER = 99;

export default class Timer {
	constructor(label, minutes) {
		this.interval = null;
		this.popUp = null;
		this.input = null;
		this.confirmWindow = null;
		this.label = label;
		this.minutes = minutes;
		this.remainingSeconds = minutes * MINUTES_TO_SECONDS;
		this.audio = new Audio("../assets/audio/beep.mp3");

		this.createView(label, minutes);
		this.updateInterfaceTime();
		this.addListeners();
	}

	createView(label, minutes) {
		this.container = document.createElement("div");
		this.container.id = label;
		this.container.classList.add("timer", "timer__container");
		this.container.innerHTML = `
      <div class="timer__part timer__part__container">
        <span class="timer__part timer__part--label">${label}</span>
        <span class="timer__part timer__part--minutes">${minutes}</span>
        <span class="timer__part">:</span>
        <span class="timer__part timer__part--seconds">00</span>
      </div>
      <button class="timer__btn timer__btn--control ${CLASS_TIME_BUTTON_RESET}">
        <span class="material-icons">restart_alt</span>
      </button>
      <button class="timer__btn timer__btn--control ${CLASS_TIME_BUTTON_SET}">
        <span class="material-icons">timer</span>
      </button>
      <button class="timer__btn timer__btn--control ${CLASS_TIME_BUTTON_START}">
        <span class="material-icons">play_arrow</span>
      </button>
    `;
	}

	getElementByClass(className) {
		return this.container.querySelector("." + className);
	}

	/**
	 * Update time and fix interface to see two digits in minutes and seconds
	 */
	updateInterfaceTime() {
		let minutes = Math.floor(this.remainingSeconds / MINUTES_TO_SECONDS);
		let seconds = this.remainingSeconds % MINUTES_TO_SECONDS;
		if (this.remainingSeconds < TIMER_STOP) {
			minutes = Math.ceil(this.remainingSeconds / MINUTES_TO_SECONDS);
		}

		let el = {
			minutes: this.container.querySelector(".timer__part--minutes"),
			seconds: this.container.querySelector(".timer__part--seconds"),
		};
		// sets timer with two digits
		el.minutes.textContent = minutes.toString().padStart(2, "0");
		el.seconds.textContent = seconds.toString().padStart(2, "0");
	}

	addListeners() {
		let el = {
			start: this.getElementByClass(CLASS_TIME_BUTTON_START),
			reset: this.getElementByClass(CLASS_TIME_BUTTON_RESET),
			set: this.getElementByClass(CLASS_TIME_BUTTON_SET),
		};

		el.start.addEventListener("click", () => this.start());
		el.reset.addEventListener("click", () => this.reset());
		el.set.addEventListener("click", () => this.set());
	}

	start() {
		if (this.remainingSeconds === TIMER_STOP || this.interval !== null) return;
		let current = new Date();
		let goal = +current + this.remainingSeconds * MILLISECONDS_TO_SECONDS;
		this.updateEvent("pause");

		this.interval = setInterval(() => {
			current = new Date();
			this.remainingSeconds =
				goal / MILLISECONDS_TO_SECONDS - +current / MILLISECONDS_TO_SECONDS;
			this.remainingSeconds = Math.ceil(this.remainingSeconds);
			this.updateInterfaceTime();

			if (this.remainingSeconds === TIMER_STOP) {
				this.updateEvent("stop");
				this.playSound();
			}
		}, 1000);
	}
	reset() {
		let template = document.createElement("template");
		let mainContainer = document.getElementById("main");
		let overlay = document.querySelector(".overlay");
		overlay.style.display = "block";
		this.confirmWindow = this.getConfirmWindow(this.label);
		this.confirmWindow = this.confirmWindow.trim();
		template.innerHTML = this.confirmWindow;
		mainContainer.appendChild(template.content.firstChild);
		this.confirmWindow = mainContainer.querySelector(".popup");
		let setButton = mainContainer.querySelector(".popup__btn--confirm");
		let cancelButton = mainContainer.querySelector(".popup__btn--cancel");

		setButton.addEventListener("click", () => {
			this.stop();
			this.remainingSeconds = this.minutes * MINUTES_TO_SECONDS;
			this.container.classList.remove("sound");
			this.updateInterfaceTime();
			this.confirmWindow.remove();
			overlay.style.display = "none";
		});
		cancelButton.addEventListener("click", () => {
			overlay.style.display = "none";
			this.confirmWindow.remove();
		});
		overlay.addEventListener("click", () => {
			overlay.style.display = "none";
			this.confirmWindow.remove();
		});
	}

	set() {
		let template = document.createElement("template");
		let mainContainer = document.getElementById("main");
		let overlay = document.querySelector(".overlay");
		overlay.style.display = "block";
		this.input = this.getInput(this.label);
		this.input = this.input.trim();
		template.innerHTML = this.input;
		mainContainer.appendChild(template.content.firstChild);
		this.input = mainContainer.querySelector(".set-timer");
		let setButton = mainContainer.querySelector(".set-timer__btn--set");
		let cancelButton = mainContainer.querySelector(".set-timer__btn--cancel");

		setButton.addEventListener("click", () => {
			let inputMinutes = this.input.querySelector(
				".set-timer__input--minutes"
			).value;
			let inputSeconds = this.input.querySelector(
				".set-timer__input--seconds"
			).value;
			if (!inputMinutes || !inputSeconds) return;
			if (inputMinutes == 0 && inputSeconds == 0) return;
			if (inputMinutes < MIN_TIMER) {
				this.stop();
				this.remainingSeconds =
					parseInt(inputMinutes * MINUTES_TO_SECONDS) + parseInt(inputSeconds);
				this.updateInterfaceTime();
			}
			this.input.remove();
			overlay.style.display = "none";
		});
		cancelButton.addEventListener("click", () => {
			overlay.style.display = "none";
			this.input.remove();
		});
		overlay.addEventListener("click", () => {
			overlay.style.display = "none";
			this.input.remove();
		});
	}

	stop() {
		clearInterval(this.interval);
		this.interval = null;
		this.audio.pause();
		this.updateEvent("play");
	}

	playSound() {
		clearInterval(this.interval);
		this.container.classList.add("sound");
		this.interval = setInterval(() => {
			this.audio.play();
		}, 1000);
		this.notification();
	}

	updateEvent(event) {
		let element = this.getElementByClass(CLASS_TIME_BUTTON_START);
		let label = element.childNodes[1];
		if (event === "play") {
			element.addEventListener("click", () => this.start());
			element.classList.remove(CLASS_TIME_BUTTON_STOP);
			label.textContent = "play_arrow";
		} else {
			element.addEventListener("click", () => this.stop());
			element.classList.add(CLASS_TIME_BUTTON_STOP);
			label.textContent = event;
		}
	}

	getHTML() {
		return this.container;
	}

	getConfirmWindow(label) {
		return `
    <div class="popup"">
      <p class="popup__title">Do you want to reset timer ${label}?</p>
			<div>
      	<button class="popup__btn popup__btn--confirm">yes</button>
      	<button class="popup__btn popup__btn--cancel">no</button>
			</div>
    </div>
    `;
	}

	getInput(label) {
		return `
			<div class="popup set-timer">
				<p class="set-timer__title">Set timer ${label}</p>
				<form class="set-timer__form grid">
				<label class="set-timer__label set-timer__label--minutes">minutes: </label>
				<input class="set-timer__input set-timer__input--minutes" type="number" />
				<label class="set-timer__label set-timer__label--seconds">seconds: </label>
				<input class="set-timer__input set-timer__input--seconds" type="number" />
				</form>
				<div class="grid">
					<button class="set-timer__btn set-timer__btn--set">Set</button>
					<button class="set-timer__btn set-timer__btn--cancel">Cancel</button>
				</div>
			</div>
    `;
	}

	notification() {
		let permission = Notification.permission;

		if (permission === "granted") {
			this.showNotification();
		} else if (permission === "default") {
			this.requestAndShowPermission();
		} else {
			alert("Timer Up!");
		}
	}
	showNotification() {
		if (document.visibilityState === "visible") return;
		
		var body = "Message to be displayed";
		var notification = new Notification("Timer Up!", { body });
		notification.onclick = () => {
			notification.close();
			window.parent.focus();
		};
	}

	requestAndShowPermission() {
		Notification.requestPermission();
		if (Notification.permission === "granted") {
			this.showNotification();
		}
	}
}
