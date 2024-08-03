import NotificationDecorator from "./NotificationDecorator";
import INotifyObserver from "../interfaces/INotifyObserver";

class EmailNotificationDecorator extends NotificationDecorator  {
    constructor(notification: INotifyObserver) {
        super(notification)
    }

    send(message: string): void {
        super.send(message);
        this.sendEmail(message);
    }

    private sendEmail(message: string): void {
        console.log(`Sending Email: ${message}`);
    }
}

export default EmailNotificationDecorator;