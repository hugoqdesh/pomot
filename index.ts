#!/usr/bin/env node
import chalk from "chalk";
import cliProgress from "cli-progress";
import notifier from "node-notifier";

const input = process.argv[2];
if (!input || !/^\d+$/.test(input)) {
	console.error(chalk.red(`\nInvalid input: "${input}"`));
	console.log(`Usage: ${chalk.cyan("pomodoro <minutes>")}`);
	process.exit(1);
}

const pomodoroTime: number = parseInt(process.argv[2]) || 25;
const seconds: number = pomodoroTime * 60;
const bar: cliProgress = new cliProgress.SingleBar(
	{
		format:
			chalk.cyan("{bar}") + " {percentage}% | Time Left: {remainingFormatted}",
	},
	cliProgress.Presets.shades_classic
);

function formatTime(seconds: number): string {
	const m = Math.floor(seconds / 60)
		.toString()
		.padStart(2, "0");
	const s = (seconds % 60).toString().padStart(2, "0");
	return `${m}:${s}`;
}

console.log("");
bar.start(seconds, 0, {
	remainingFormatted: formatTime(seconds),
});

const time: number = Date.now();
function tick() {
	const elapsed = Math.floor((Date.now() - time) / 1000);
	const remaining = seconds - elapsed;

	bar.update(elapsed, {
		remainingFormatted: formatTime(remaining),
	});

	if (elapsed < seconds) {
		setTimeout(tick, 1000 - ((Date.now() - time) % 1000));
	} else {
		bar.stop();
		notifier.notify({
			title: "Work Session Finished",
			message: `you completed ${pomodoroTime} minutes of work`,
			sound: true,
		});

		console.log(chalk.green("\nSession complete!"));
		process.exit(0);
	}
}

tick();
