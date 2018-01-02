console.group("Code is written in ES6.");
console.log("This code would work in Chrome latest version. Incase you get any error, please try converting es6 to es5 and then run the code.");
console.log("Use this url to do so: https://babeljs.io/repl/");
console.groupEnd();

let openRequest;
let databaseName = 'indexedDBSpike';

document.querySelector('#createDB').addEventListener('click', () => {
  openRequest = window.indexedDB.open(databaseName); // we passed the name of the Database.

  // If indexedDBSpike database is not present, or the version is old, this method would get called.
  openRequest.onupgradeneeded = (e) => {
    let db = openRequest.result;
    let store = db.createObjectStore("pipelines", { keyPath: "pipelineName"});
    let authorName = store.createIndex('by_author', 'author');
    let pipelineName = store.createIndex('by_pipeline', 'pipelineName', { unique: true});

    logStatement.updateLogger("Database created");
    
    // Populate initial data
    store.put({pipelineName: "PromoFrontend", author: "Jagat"});
    store.put({pipelineName: "PromoBackend", author: "Raghavendra"});
    store.put({pipelineName: "PromoSQL", author: "Rajshekhar"});
  }

  openRequest.success = (e) => {
    logStatement.updateLogger("Database created successfully");
    console.log("Database opened");
    db = openRequest.result;
  }

  // Incase of failure at any point regarding indexedDB, this method would get called.
  openRequest.onerror = (error) => {
    logStatement.updateLogger("Error occured ", error);
  }

});

document.querySelector('#deleteDB').addEventListener('click', () => {
  // Check if you have a DB
  if(typeof openRequest !== 'undefined') {
    logStatement.updateLogger("deleting");
    let db = openRequest.result;
    // Close the db before removing it.
    db.close();
    var deleteRequest = indexedDB.deleteDatabase(databaseName);

    deleteRequest.onsuccess = () => {
      logStatement.updateLogger("Database deleted successfully");
    }

    deleteRequest.onblocked = (err) => {
      logStatement.updateLogger("Database could not be deleted. See console for error");
      console.log("Database could not be deleted.", err);
    }
  } else {
    logStatement.updateLogger("database not present");
  }
});

document.querySelector('#clear-logger').addEventListener('click', () => {
  logStatement.clearLogger();
});
