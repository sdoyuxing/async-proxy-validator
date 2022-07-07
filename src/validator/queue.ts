import { Job, Obj } from "../interface";
import { deepCopy } from "../utils";

class Queue<V> {
  head: any;
  tail: any;
  map: Map<number, V>;
  indexMap: Map<string, number>;
  field: string | undefined;
  constructor(field?: string) {
    this.map = new Map<number, V>();
    this.head = 0;
    this.tail = 0;
    this.indexMap = new Map<string, number>();
    this.field = field;
  }
  clear() {
    this.map.clear();
  }
  enqueue(value: V | V[]) {
    if (!Array.isArray(value)) value = [value];
    value.forEach((item) => {
      if (
        this.field &&
        typeof value === "object" &&
        (<Object>value).hasOwnProperty(this.field)
      )
        this.indexMap.set((<Record<string, any>>value)[this.field], this.tail);
      this.map.set(this.tail++, item);
    });
  }
  dequeue() {
    const item = this.map.get(this.head);
    this.map.delete(this.head++);
    return item;
  }
  find(field: number | string) {
    if (typeof field === "number") return this.map.get(field);
    if (typeof field === "string" && this.field)
      return this.map.get(this.indexMap.get(field)!);
  }
  get length() {
    return this.map.size;
  }

  *[Symbol.iterator]() {
    let current = this.map.get(this.head);

    while (current) {
      yield current;
      current = this.map.get(++this.head);
    }
  }
}

export class JobQueue {
  currentFlushPromise: Promise<any> = Promise.resolve();
  queue: Queue<Job>;
  constructor() {
    this.queue = new Queue<Job>();
  }
  queueJob(job: Job) {
    const internalJob = this.queue.find(job.field);
    if (internalJob) {
      internalJob.validate = job.validate;
    } else {
      this.queue.enqueue(job);
    }
  }
  queueFlush() {
    const implementQueue = new Queue<Job>();
    implementQueue.enqueue([...this.queue]);
    this.queue.clear();
    this.currentFlushPromise = Promise.resolve().then(() => {
      try {
        this.flushJobs(implementQueue);
      } catch (error) {
        throw error;
      }
    });
  }
  flushJobs(implementQueue: Queue<Job>) {
    if (implementQueue.length > 0) {
      let result: Obj = {};
      let error;
      try {
        for (let queueItem of implementQueue) {
          result = queueItem.validate()!;
        }
      } catch (error) {
        console.error(error);
        throw error;
      }
      error = deepCopy(result);
      for (let key in result) {
        result[key].length = 0;
      }
      if (error) throw error;
    }
  }
  nextTick(fn?: () => void): Promise<void> {
    this.queueFlush();
    const p = this.currentFlushPromise;
    if (fn) {
      p.then(this ? fn.bind(this) : fn, fn);
    }
    return p;
  }
}
