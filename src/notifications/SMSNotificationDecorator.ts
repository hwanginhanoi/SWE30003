import NotificationDecorator from "./NotificationDecorator";
import INotifyObserver from "../interfaces/INotifyObserver";

class SMSNotificationDecorator extends NotificationDecorator {
    constructor(notification: INotifyObserver) {
        super(notification)
    }

    send(message: string): void {
        super.send(message);
        this.sendSMS(message);
    }

    private sendSMS(message: string): void {
        console.log(`Sending SMS: ${message}`);
    }
}

export default SMSNotificationDecorator;