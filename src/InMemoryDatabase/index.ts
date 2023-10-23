interface IBaseRecord {
  id: string;
}

interface IDatabase<T extends IBaseRecord> {
  set(newValue: T): void;
  get(id: string): T | undefined;
}

// Factory Pattern
const createDatabase = <T extends IBaseRecord>() => {
  class InMemoryDatabase implements IDatabase<T>{
    
    private static instance: InMemoryDatabase | null = null;
    private db: Record<string, T> = {};

    // Singleton Pattern
    public static getInstance(): InMemoryDatabase {
      if (!InMemoryDatabase.instance) {
        InMemoryDatabase.instance = new InMemoryDatabase();
      }
      return InMemoryDatabase.instance;
  }

    public set(newValue: T): void {
      this.db[newValue.id] = newValue;
    }

    public get(id: string): T | undefined {
      return this.db[id];
    }
  }

  return InMemoryDatabase;
};

export default createDatabase;