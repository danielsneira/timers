import Timer from "./Timer.js";

const timers = [
	{
		label: "A",
		minutes: 5,
		seconds: 0,
	},
	{
		label: "B",
		minutes: 2,
		seconds: 0,
	},
	{
		label: "C",
		minutes: 5,
		seconds: 0,
	},
	{
		label: "D",
		minutes: 2,
		seconds: 0,
	},
	{
		label: "E",
		minutes: 2,
		seconds: 0,
	},
	{
		label: "F",
		minutes: 5,
		seconds: 0,
	},
	{
		label: "G",
		minutes: 2,
		seconds: 0,
	},
];

timers.forEach((data) => {
	let timer = new Timer(data.label, data.minutes);
	document.querySelector("#main").appendChild(timer.getHTML());
});
