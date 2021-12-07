let worker

if (typeof window !== "undefined") {
  worker = new Worker(new URL("engineWebWorker.js", import.meta.url))
}

export { worker }
