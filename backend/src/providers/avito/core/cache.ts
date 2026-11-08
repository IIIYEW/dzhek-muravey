export function ttl(value: string | undefined) {
  const seconds = Number(value ?? 600);
  return Number.isInteger(seconds) && seconds >= 60 && seconds <= 3600 ? seconds : 600;
}

/** Кеш в памяти объединяет одновременные запросы и ограничивает срок устаревшего резерва. */
export class Cache<T> {
  private value?: T;
  private at = 0;
  private pending?: Promise<T>;

  constructor(
    private seconds: number,
    private staleSeconds = 3600,
  ) {}

  async get(load: () => Promise<T>, now = Date.now()): Promise<{ value: T; stale: boolean }> {
    if (this.value !== undefined && now - this.at < this.seconds * 1000) {
      return { value: this.value, stale: false };
    }

    try {
      if (!this.pending) this.pending = load();
      const value = await this.pending;
      this.value = value;
      this.at = now;
      return { value, stale: false };
    } catch (error) {
      if (this.value !== undefined && now - this.at < this.staleSeconds * 1000) {
        return { value: this.value, stale: true };
      }
      throw error;
    } finally {
      this.pending = undefined;
    }
  }
}
