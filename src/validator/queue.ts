import { deepCopy } from "../utils";

export class Queue {
  currentFlushPromise: Promise<any> = Promise.resolve();
  queue: any[] = [];
  implementQueue: any[] = [];
  queueJob(job: any) {
    const internalJob = this.queue.find((item) => item.field === job.field);
    if (internalJob) {
      internalJob.validate = job.validate;
    } else {
      this.queue.push(job);
    }
  }
  queueFlush() {
    const implementQueue = [...this.queue];
    this.queue.length = 0;
    this.currentFlushPromise = Promise.resolve().then(() => {
      try {
        this.flushJobs(implementQueue);
      } catch (error) {
        throw error;
      }
    });
  }
  flushJobs(queue: any[]) {
    if (queue.length > 0) {
      let result = [];
      let error;
      try {
        for (let i = 0; i < queue.length; i++) {
          result = queue[i].validate();
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
