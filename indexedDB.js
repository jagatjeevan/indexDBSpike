// console.group("Code is written in ES6 and no compiler used to transpile as it is just for learning");
//   console.log("This code would work in Chrome latest version. Incase you get any error, please try converting es6 to es5 and then run the code.");
//   console.log("Use this url to do so: https://babeljs.io/repl/");
// console.groupEnd();

let openRequest;
let databaseName = 'indexedDBSpike';

let dbConfig = {
  name: databaseName,
  version: 1,
  storeNames: {
    pipelines: 'pipelines'
  },
  instance: {},
  defaultErrorHandling: (err) => {
    logStatement.updateLogger("Error in ", err);
  },
  setDefaultErrorHandling: (request) => {
    if("onerror" in request)
      request.onerror = dbConfig.defaultErrorHandling;

    if("onblocked" in request)
      request.onblocked = dbConfig.defaultErrorHandling;
  }
}

document.querySelector('#createDB').addEventListener('click', () => {
  openRequest = indexedDB.open(dbConfig.name, dbConfig.version);

  // If indexedDBSpike database is not present, or the version is old, this method would get called.
  openRequest.onupgradeneeded = (e) => {
    let db = openRequest.result;
    let store = db.createObjectStore(dbConfig.storeNames.pipelines, { keyPath: "pipelineName", autoIncrement: true });

    let authorName = store.createIndex('by_author', 'author');
    let pipelineName = store.createIndex('by_pipeline', 'pipelineName', { unique: true});

    logStatement.updateLogger("Database creating");

    // Populate initial data
    store.put({
      pipelineName: "PromoFrontend", 
      author: "Jagat"
    });
    store.put({pipelineName: "PromoBackend", author: "Raghavendra"});
    store.put({pipelineName: "PromoSQL", author: "Rajshekhar"});

    logStatement.updateLogger("Database created");
  }

  openRequest.onsuccess = () => {
    dbConfig.instance = openRequest.result;
    logStatement.updateLogger("Database opened");
  }

  // Incase of failure at any point regarding indexedDB, this method would get called.
  // Since we are handling error on generic / common below code is the same as openRequest.onerror.
  dbConfig.setDefaultErrorHandling(openRequest);

});

document.querySelector('#deleteDB').addEventListener('click', () => {
  // Check if you have a DB
  if(typeof openRequest !== 'undefined') {
    logStatement.updateLogger("deleting");
    let db = openRequest.result;
    // Close the db before removing it.
    db.close();
    var deleteRequest = indexedDB.deleteDatabase(databaseName);

    deleteRequest.onsuccess = logStatement.updateLogger("Database deleted successfully");

    // Incase of failure at any point regarding indexedDB, this method would get called.
    // Since we are handling error on generic / common below code is the same as openRequest.onerror.
    dbConfig.setDefaultErrorHandling(openRequest);
  } else {
    logStatement.updateLogger("database not present");
  }
});

document.querySelector('#readDB').addEventListener('click', () => {
  // array of database names
  let transaction = dbConfig.instance.transaction([dbConfig.storeNames.pipelines], 'readonly');
  let objectStore = transaction.objectStore(dbConfig.storeNames.pipelines);

  transaction.onsuccess = function(e) {
    console.log("success", e);
  }

  console.log("This is the object store to read data from ", objectStore);
});

// Clear all logs
document.querySelector('#clear-logger').addEventListener('click', () => {
  logStatement.clearLogger();
});
