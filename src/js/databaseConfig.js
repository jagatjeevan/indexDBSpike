let dbConfig = {
  databaseName: "library",
  version: 1,
  storeNames: {
    books: "books",
    author: "author"
  },
  instance: {},
  defaultErrorHandling: (err) => {
    logStatement.updateLogger("Error in ", err);
  },
  setDefaultErrorHandling: (request) => {
    if ("onerror" in request) {
      request.onerror = this.defaultErrorHandling;
    }

    if("onblocked" in request) {
      request.onblocked = this.defaultErrorHandling;
    }
  }
}

export default dbConfig;
