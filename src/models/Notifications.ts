interface CustomNotification {
    send(message: string): void;
}

class BasicNotification implements CustomNotification {
    send(message: string): void {
        console.log(`Sending notification: ${message}`);
    }
}

class SMSNotificationDecorator implements CustomNotification {
    private wrapped: CustomNotification;

    constructor(notification: CustomNotification) {
        this.wrapped = notification;
    }

    send(message: string): void {
        this.wrapped.send(message);
        this.sendSMS(message);
    }

    private sendSMS(message: string): void {
        console.log(`Sending SMS: ${message}`);
    }
}

class EmailNotificationDecorator implements CustomNotification {
    private wrapped: CustomNotification;

    constructor(notification: CustomNotification) {
        this.wrapped = notification;
    }

    send(message: string): void {
        this.wrapped.send(message);
        this.sendEmail(message);
    }

    private sendEmail(message: string): void {
        console.log(`Sending Email: ${message}`);
    }
}

export { CustomNotification, BasicNotification, SMSNotificationDecorator, EmailNotificationDecorator };