import dataBaseConfig from './databaseConfig';
import * as logStatement from './logger';
import '../styles/style.scss';

let openRequest;

let isDatabasePresent = (openRequest) => {
  if(typeof openRequest === 'undefined') {
    logStatement.updateLogger("Database not present");
    return false;
  }

  return true;
}

// Create Database
document.querySelector('#createDB').addEventListener('click', () => {
  openRequest = window.indexedDB.open(dataBaseConfig.databaseName, dataBaseConfig.version);

  openRequest.onupgradeneeded = (e) => {
    logStatement.updateLogger("Database needs update");
    // Creating a Database instance and storing it to config so that we can use it anywhere.
    dataBaseConfig.instance = openRequest.result;

    // Store is mainly the tables in the database. This one would create table with the name books
    let store = dataBaseConfig.instance.createObjectStore(dataBaseConfig.storeNames.books, { keyPath: "title" });
    logStatement.updateLogger("Table created with the name '" + dataBaseConfig.storeNames.books + "'");

    // Define the columns. This would help in better UI. Splitting the object to sort or search
    let bookTitle = store.createIndex("by_title", "title", { unique: true });
    let bookAuthor = store.createIndex("by_author", "author");
    let bookType = store.createIndex("by_type", "type");
    
    // Adding initial values to the table. You can use "store.put({...})" or "transaction"
    store.put({
      title: "Merchant of Venice",
      author: "William Shakespear",
      type: "Drama"
    });
  }

  openRequest.onsuccess = (e) => {
    logStatement.updateLogger("Database successfully created / opened");
  }

  dataBaseConfig.setDefaultErrorHandling(openRequest);

});

document.querySelector('#readDB').addEventListener('click', () => {
  // Check if the database is present
  if (!isDatabasePresent(openRequest)) {
    return;
  }

  // Use transaction to read the database
  let transaction = dataBaseConfig.instance.transaction([dataBaseConfig.storeNames.books], "readonly");
  let objectStore = transaction.objectStore(dataBaseConfig.storeNames.books);
  // Use openCursor to read a stream of data.
  let cursor = objectStore.openCursor();

  cursor.onsuccess = (e) => {
    let result = e.target.result;
    logStatement.updateLogger("Reading Database");
    if(result) {
      logStatement.updateLogger("Name of the book: " + result.key);
      logStatement.updateLogger("author of the book: " + result.value.author);
      logStatement.updateLogger("type of the book: " + result.value.type);
      result.continue();
    } else {
      logStatement.updateLogger("No more records");
    }
  }

});

document.querySelector('#deleteDB').addEventListener('click', () => {
  if (!isDatabasePresent(openRequest)) {
    return;
  }

  logStatement.updateLogger("Deleting Database");
  openRequest.result.close();
  let deleteRequest = indexedDB.deleteDatabase(dataBaseConfig.databaseName);

  // OnBlocked for some reason, database could not be deleted
  dataBaseConfig.setDefaultErrorHandling(openRequest);

  deleteRequest.onsuccess = logStatement.updateLogger("Database deleted successfully");

  dataBaseConfig.instance = {};
  openRequest = undefined;

});

// Clearing the logs from html
document.querySelector('#clear-logger').addEventListener('click', () => {
  logStatement.clearLogger();
});

document.querySelector('#addDB').addEventListener('click', () => {
  // Check if the database is present
  if (!isDatabasePresent(openRequest)) {
    return;
  }

  logStatement.updateLogger('Database adding started');
  let bookObject = {
    title: document.querySelector('[name="title"]').value,
    author: document.querySelector('[name="author"]').value,
    type: document.querySelector('[name="type"]').value,
  }

  let transaction = dataBaseConfig.instance.transaction([dataBaseConfig.storeNames.books], "readwrite");
  let objectStore = transaction.objectStore("books");
  objectStore.add(bookObject);

  logStatement.updateLogger('Database adding completed');
});
