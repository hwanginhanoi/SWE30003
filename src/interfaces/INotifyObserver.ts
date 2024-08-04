interface INotifyObserver {
    send(message: string): string;
    getType(): string;
}

export default INotifyObserver;