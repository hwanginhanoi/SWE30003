import INotifyObserver from "../interfaces/INotifyObserver";

class PushNotification implements INotifyObserver {
    send(message: string): string {
        return "Push Notification: " + message;
    }

    getType(): string {
        return "push";
    }
}

export default PushNotification;