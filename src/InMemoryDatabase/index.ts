import createObserver, { Listener } from './../Observer';

interface IBeforeSetEvent<T> {
	value: T;
	newValue: T;
}

interface IAfterSetEvent<T> {
	value: T;
}
interface IBaseRecord {
  id: string;
}

interface IDatabase<T extends IBaseRecord> {
  set(newValue: T): void;
  get(id: string): T | undefined;

  onBeforeAdd(listener: Listener<IBeforeSetEvent<T>>): () => void;
  onAfterAdd(listener: Listener<IAfterSetEvent<T>>): () => void;
}

// Factory Pattern
const createDatabase = <T extends IBaseRecord>() => {
  class InMemoryDatabase implements IDatabase<T>{
    
    private static instance: InMemoryDatabase | null = null;
    private db: Record<string, T> = {};
    private beforeAddListeners = createObserver<IBeforeSetEvent<T>>();
    private afterAddListeners = createObserver<IAfterSetEvent<T>>();

    // Singleton Pattern
    public static getInstance(): InMemoryDatabase {
      if (!InMemoryDatabase.instance) {
        InMemoryDatabase.instance = new InMemoryDatabase();
      }
      return InMemoryDatabase.instance;
  }

    public set(newValue: T): void {
      this.beforeAddListeners.publish({
        newValue,
        value: this.db[newValue.id],
      });

      this.db[newValue.id] = newValue;

      this.afterAddListeners.publish({
        value: newValue,
      });
    }

    public get(id: string): T | undefined {
      return this.db[id];
    }
    
    onBeforeAdd(listener: Listener<IBeforeSetEvent<T>>): () => void {
      return this.beforeAddListeners.subscribe(listener)
    }
    onAfterAdd(listener: Listener<IAfterSetEvent<T>>): () => void {
      return this.afterAddListeners.subscribe(listener)
    }
  }

  return InMemoryDatabase;
};

export default createDatabase;