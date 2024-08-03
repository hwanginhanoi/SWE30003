import {INotifyObserver} from "./INotifyObserver";

interface INotifySubject {
    attach(observer: INotifyObserver): void;
    detach(observer: INotifyObserver): void;
    notifyAllObserver(): void;
}

export default INotifySubject;