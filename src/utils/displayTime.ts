// returns a string like 25:00
export function secondsToTimeString(seconds: number) {

    const minutes = Math.floor(seconds / 60);

    const remainingSeconds = seconds % 60;

    return `${minutes}:${("" + remainingSeconds).padStart(2, "0")}`
}

// export function timeToSeconds(time: number) {
//     const remainingSeconds = time % 60;
//     return ("" + remainingSeconds).padStart(2, "0")
// }
// export function timeToMinutes(time: number) {
//     const remainingMinutes = Math.floor(time / 60);

//     return remainingMinutes.toString()

// }
export function minutesSeconds(minutes: number) {
    return minutes * 60
}
