import INotifyObserver from "../interfaces/INotifyObserver";

class SMSNotification implements INotifyObserver {
    send(message: string): string {
        return "SMS Notification: " + message;
    }

    getType(): string {
        return "sms";
    }
}

export default SMSNotification;