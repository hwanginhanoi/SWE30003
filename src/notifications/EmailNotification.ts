import INotifyObserver from "../interfaces/INotifyObserver";

class EmailNotification implements INotifyObserver {
    send(message: string): string {
        return "Email Notification: " + message;
    }

    getType(): string {
        return "email";
    }
}

export default EmailNotification;