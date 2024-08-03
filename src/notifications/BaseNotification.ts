import INotifyObserver from "../interfaces/INotifyObserver";

class BasicNotification implements INotifyObserver {
    send(message: string): void {
        console.log(`Sending push notification: ${message}`);
    }
}

export default BasicNotification;