import { sendNotification, isPermissionGranted, requestPermission } from "@tauri-apps/api/notification";


export const timerExpires = async () => {
    let granted = await isPermissionGranted();
    if (!granted) {
        const permission = await requestPermission();
        granted = permission === 'granted'
    }

    if (granted) {
        sendNotification({ title: "TEST", body: "Timer expires!" })
    }
}
