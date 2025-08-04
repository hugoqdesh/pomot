#!/usr/bin/env node

const input = process.argv[2];
if (!/^\d+$/.test(input)) {
	console.error(`\nInvalid input: "${input}"`);
	console.log(`Usage: npx pomot <minutes>`);
	process.exit(1);
}

const pomodoroTime: number = parseInt(process.argv[2]);
const seconds: number = pomodoroTime * 60;

function formatTime(seconds: number): string {
	const m = Math.floor(seconds / 60)
		.toString()
		.padStart(2, "0");
	const s = (seconds % 60).toString().padStart(2, "0");
	return `${m}:${s}`;
}

function centerText(text: string): string {
	const terminalWidth = process.stdout.columns || 80;
	const padding = Math.max(0, Math.floor((terminalWidth - text.length) / 2));
	return " ".repeat(padding) + text;
}

const time: number = Date.now();
function tick() {
	const elapsed = Math.floor((Date.now() - time) / 1000);
	const remaining = seconds - elapsed;

	const timeText = formatTime(remaining);
	const centeredTime = centerText(timeText);

	const terminalHeight = process.stdout.rows || 24;
	const verticalPosition = Math.floor(terminalHeight / 2);
	process.stdout.write(`\x1b[${verticalPosition};1H`);
	process.stdout.write("\x1b[2K");
	process.stdout.write("\x1b[2J");
	process.stdout.write(centeredTime);

	if (elapsed < seconds) {
		setTimeout(tick, 1000 - ((Date.now() - time) % 1000));
	} else {
		process.stdout.write(`\x1b[${verticalPosition + 2};1H`);
		process.stdout.write(centerText("Session complete!"));

		console.log("\x07");
		process.exit(0);
	}
}

tick();
