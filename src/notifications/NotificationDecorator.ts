import INotifyObserver from "../interfaces/INotifyObserver";

abstract class NotificationDecorator implements INotifyObserver {
    protected observer: INotifyObserver;

    constructor(observer: INotifyObserver) {
        this.observer = observer;
    }

    public send(message: string): void {
        this.observer.send(message);
    }
}

export default NotificationDecorator;