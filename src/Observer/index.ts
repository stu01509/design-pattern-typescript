export type Listener<EventType> = (event: EventType) => void;

// Observer Pattern
const createObserver = <EvenntType>(): {
    subscribe: (listener: Listener<EvenntType>) => () => void;
    publish: (event: EvenntType) => void;
} => {
  let listeners: Listener<EvenntType>[] = [];
  return {
    subscribe: (listener: Listener<EvenntType>): () => void => {
      listeners.push(listener);
      return () => listeners = listeners.filter((_listener) => _listener !== listener);
    },
    publish(event) {
        listeners.forEach((_listener) => _listener(event));
    },
  }
};

export default createObserver;
