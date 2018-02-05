import axios from 'axios';
import $ from 'jquery';

import path from './path';
import dataBaseConfig from './databaseConfig';
import * as logStatement from './logger';
import * as keyContainerFunction from './keyContainerFunctions';
import * as addForm from './addForm';
import '../styles/style.scss';

let openRequest;

let isDatabasePresent = (openRequest) => {
  if(typeof openRequest === 'undefined') {
    logStatement.updateLogger("Database not present");
    return false;
  }
  return true;
}

let updateKeyContainer = (bookObject) => {
  $('#database-key-container').append(`<label class="key" data-book-type="${bookObject.type}" data-book-author="${bookObject.author}" data-book-title="${bookObject.title}"> ${bookObject.title} </label>`);
}

$('#database-key-container').on('click', '.key', function() {
addForm.setFormElements($(this).data('bookTitle'), $(this).data('bookAuthor'), $(this).data('bookType'));});

$('#createDB').on('click', () => {
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

    let initialDatabaseValue = addForm.createObject("Merchant of Venice", "William Shakespear", "Drama");

    // Adding initial values to the table. You can use "store.put({...})" or "transaction"
    store.put(initialDatabaseValue);

    updateKeyContainer(initialDatabaseValue);
  }

  openRequest.onsuccess = (e) => {
    logStatement.updateLogger("Database successfully created / opened");
  }

  dataBaseConfig.setDefaultErrorHandling(openRequest);
});

$('#readDB').on('click', () => {
  // Check if the database is present
  if (!isDatabasePresent(openRequest)) {
    return;
  }

  // Use transaction to read the database
  let transaction = dataBaseConfig.instance.transaction([dataBaseConfig.storeNames.books], "readonly");
  let objectStore = transaction.objectStore(dataBaseConfig.storeNames.books);
  // Use openCursor to read a stream of data.
  let cursor = objectStore.openCursor();
  keyContainerFunction.clearKeyContainer();

  cursor.onsuccess = (e) => {
    let result = e.target.result;
    logStatement.updateLogger("Reading Database");
    if(result) {
      logStatement.bookObjectLogger(result.value);
      updateKeyContainer(result.value);
      result.continue();
    } else {
      logStatement.updateLogger("No more records");
    }
  }
});

$('#deleteDB').on('click', () => {
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
  keyContainerFunction.clearKeyContainer();
});

$('#clear-logger').on('click', () => {
  logStatement.clearLogger();
});

$('#addDB').on('click', () => {
  // Check if the database is present
  if (!isDatabasePresent(openRequest)) {
    return;
  }

  logStatement.updateLogger('Record adding to database started');
  let bookObject = addForm.getFormElements();

  let transaction = dataBaseConfig.instance.transaction([dataBaseConfig.storeNames.books], "readwrite");
  let objectStore = transaction.objectStore("books");
  objectStore.add(bookObject);
  updateKeyContainer(bookObject);

  logStatement.updateLogger('Record added to database');
  document.forms['addDBForm'].reset();
});

let populateDatabase = data => {
  // Check if the database is present
  if (!isDatabasePresent(openRequest)) {
    return;
  }

  logStatement.updateLogger('Record adding to database started');

  data.books.forEach(datum => {
    // Use transaction to read the database
    let transaction = dataBaseConfig.instance.transaction([dataBaseConfig.storeNames.books], "readwrite");
    let objectStore = transaction.objectStore(dataBaseConfig.storeNames.books);
    let bookObject = addForm.objectifyBookObject(datum);

    objectStore.add(bookObject);

    transaction.oncomplete = datum => {
      logStatement.updateLogger(bookObject.title + ' is added to database');
      updateKeyContainer(bookObject);
    };

    dataBaseConfig.setDefaultErrorHandling(transaction);
  });
};

$('#populateAjax').on('click', () => {
  axios.get(path.apiPath + 'books.json').then(res => {
    console.log("data is ", res.data);
    populateDatabase(res.data);
  });
});
