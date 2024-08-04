import INotifyObserver from "./INotifyObserver";

interface INotifySubject {
    attach(observer: INotifyObserver): void;
    detach(observer: INotifyObserver): void;
    notifyAllObservers(message: string): { [key: string]: string };
}

export default INotifySubject;