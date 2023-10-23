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
  visit(visitor: (item: T) => void): void;
  selectBest(scoreStrategy: (item: T) => number): T | undefined;
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

    // Visitor Pattern
    visit(visitor: (item: T) => void): void {
      Object.values(this.db).forEach(visitor);
    }

    // Strategy Pattern
    selectBest(scoreStrategy: (item: T) => number): T | undefined {
      const found: {
        max: number;
        item: T | undefined;
      } = {
        max: 0,
        item: undefined,
      };

      Object.values(this.db).reduce((f, item) => {
        const score = scoreStrategy(item);
        if (score > f.max) {
          f.item = item;
          f.max = score;
        }
        return f;
      }, found);

      return found.item;
    }
  }

  return InMemoryDatabase;
};

export default createDatabase;