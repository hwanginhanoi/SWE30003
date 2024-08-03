interface INotifySubject {
    attach(observer: INotifyObserver): void;
    detach(observer: INotifyObserver): void;
    notifyAllObserver(): void;
}

interface INotifyObserver {
    send(message: string): void;
}

class BasicNotification implements INotifyObserver {
    send(message: string): void {
        console.log(`Sending push notification: ${message}`);
    }
}

abstract class NotificationDecorator implements INotifyObserver {
    protected observer: INotifyObserver;

    constructor(observer: INotifyObserver) {
        this.observer = observer;
    }

    public send(message: string): void {
        this.observer.send(message);
    }
}

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

export { INotifyObserver, BasicNotification, SMSNotificationDecorator, EmailNotificationDecorator };