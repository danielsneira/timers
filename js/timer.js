const CLASS_TIME_BUTTON_START = "timer__btn--start";
const CLASS_TIME_BUTTON_RESET = "timer__btn--reset";
const CLASS_TIME_BUTTON_STOP = "timer__btn--stop";
const CLASS_TIME_BUTTON_SET = "timer__btn--set";

export default class Timer {
	constructor(label, minutes) {
		this.interval = null;
		this.popUp = null;
		this.input = null;
		this.label = label;
		this.minutes = minutes;
		this.remainingSeconds = minutes * 60;
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
		let minutes = Math.floor(this.remainingSeconds / 60);
		let seconds = this.remainingSeconds % 60;
		if (this.remainingSeconds < 0) {
			minutes = Math.ceil(this.remainingSeconds / 60);
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
		if (this.remainingSeconds === 0 || this.interval !== null) return;
		this.updateEvent("pause");

		this.interval = setInterval(() => {
			this.remainingSeconds--;
			this.updateInterfaceTime();

			if (this.remainingSeconds === 0) {
				this.updateEvent("stop");
				this.playSound();
				// let template = document.createElement("template");
				// let popUpHTML = this.getPopUp(this.label);
				// let mainContainer = document.getElementById("main");
				// popUpHTML = popUpHTML.trim();
				// template.innerHTML = popUpHTML;
				// mainContainer.appendChild(template.content.firstChild);
				// this.popUp = mainContainer.querySelector(`#popup-${this.label}`);
				// let stopButton = this.popUp.querySelector(".popup__btn");
				// stopButton.addEventListener("click", () => {
				// 	this.popUp.remove();
				// 	this.stop();
				// });
			}
		}, 1000);
	}
	reset() {
		this.remainingSeconds = this.minutes * 60;
		this.updateInterfaceTime();
	}

	set() {
		let input = document.querySelector(".set-timer");
		if (input) return;

		let template = document.createElement("template");
		this.input = this.getInput(this.label);
		let mainContainer = document.getElementById("main");
		this.input = this.input.trim();
		template.innerHTML = this.input;
		mainContainer.appendChild(template.content.firstChild);
		this.input = mainContainer.querySelector(".set-timer");
		let setButton = mainContainer.querySelector(".set-timer__btn");
		setButton.addEventListener("click", () => {
			let inputMinutes = this.input.querySelector(
				".set-timer__input--minutes"
			).value;
			let inputSeconds = this.input.querySelector(
				".set-timer__input--seconds"
			).value;
			if (!inputMinutes || !inputSeconds) return;
			if (inputMinutes == 0 && inputSeconds == 0) return;
			if (inputMinutes < 99) {
				this.stop();
				this.remainingSeconds =
					parseInt(inputMinutes * 60) + parseInt(inputSeconds);
				this.updateInterfaceTime();
			}
			this.input.remove();
		});
	}

	stop() {
		clearInterval(this.interval);
		this.interval = null;
		this.audio.pause();
		this.container.classList.remove("sound");
		this.updateEvent("play");
	}

	playSound() {
		clearInterval(this.interval);
		this.interval = setInterval(() => {
			this.audio.play();
			this.container.classList.toggle("sound");
		}, 1000);
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

	getPopUp(label) {
		return `
    <div class="popup" id="popup-${label}">
      <p class="popup__title">Timer ${label} up!</p>
      <button class="popup__btn">stop</button>
    </div>
    `;
	}

	getInput(label) {
		return `
		<div class="popup set-timer">
      <p class="set-timer__title">Set timer ${label}</p>
			<form class="set-timer__form grid">
      <label class="set-timer__label set-timer__label--minutes" >minutes: </label>
      <input class="set-timer__input set-timer__input--minutes" type="number" />
      <label class="set-timer__label set-timer__label--seconds" >seconds: </label>
      <input class="set-timer__input set-timer__input--seconds" type="number" />
			</form>
      <button class="set-timer__btn">Set</button>
    </div>
		`;
	}
}
