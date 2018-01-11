/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__databaseConfig__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__logger__ = __webpack_require__(2);



let openRequest;

// Create Database
document.querySelector('#createDB').addEventListener('click', () => {
  openRequest = window.indexedDB.open(__WEBPACK_IMPORTED_MODULE_0__databaseConfig__["a" /* default */].databaseName, __WEBPACK_IMPORTED_MODULE_0__databaseConfig__["a" /* default */].version);

  openRequest.onupgradeneeded = e => {
    __WEBPACK_IMPORTED_MODULE_1__logger__["b" /* updateLogger */]("Database needs update");
    // Creating a Database instance and storing it to config so that we can use it anywhere.
    __WEBPACK_IMPORTED_MODULE_0__databaseConfig__["a" /* default */].instance = openRequest.result;

    // Store is mainly the tables in the database. This one would create table with the name books
    let store = __WEBPACK_IMPORTED_MODULE_0__databaseConfig__["a" /* default */].instance.createObjectStore(__WEBPACK_IMPORTED_MODULE_0__databaseConfig__["a" /* default */].storeNames.books, { keyPath: "title" });
    __WEBPACK_IMPORTED_MODULE_1__logger__["b" /* updateLogger */]("Table created with the name '" + __WEBPACK_IMPORTED_MODULE_0__databaseConfig__["a" /* default */].storeNames.books + "'");

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
  };

  openRequest.onsuccess = e => {
    __WEBPACK_IMPORTED_MODULE_1__logger__["b" /* updateLogger */]("Database successfully created / opened");
  };

  __WEBPACK_IMPORTED_MODULE_0__databaseConfig__["a" /* default */].setDefaultErrorHandling(openRequest);
});

document.querySelector('#deleteDB').addEventListener('click', () => {
  if (typeof openRequest !== 'undefined') {
    __WEBPACK_IMPORTED_MODULE_1__logger__["b" /* updateLogger */]("Deleting Database");
    openRequest.result.close();
    let deleteRequest = indexedDB.deleteDatabase(__WEBPACK_IMPORTED_MODULE_0__databaseConfig__["a" /* default */].databaseName);

    deleteRequest.onsuccess = __WEBPACK_IMPORTED_MODULE_1__logger__["b" /* updateLogger */]("Database deleted successfully");

    // OnBlocked for some reason, database could not be deleted
    __WEBPACK_IMPORTED_MODULE_0__databaseConfig__["a" /* default */].setDefaultErrorHandling(openRequest);
  } else {
    __WEBPACK_IMPORTED_MODULE_1__logger__["b" /* updateLogger */]("Database not present");
  }
});

// Clearing the logs from html
document.querySelector('#clear-logger').addEventListener('click', () => {
  __WEBPACK_IMPORTED_MODULE_1__logger__["a" /* clearLogger */]();
});

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var _this = this;

let dbConfig = {
  databaseName: "library",
  version: 1,
  storeNames: {
    books: "books",
    author: "author"
  },
  instance: {},
  defaultErrorHandling: err => {
    logStatement.updateLogger("Error in ", err);
  },
  setDefaultErrorHandling: request => {
    if ("onerror" in request) {
      request.onerror = _this.defaultErrorHandling;
    }

    if ("onblocked" in request) {
      request.onblocked = _this.defaultErrorHandling;
    }
  }
};

/* harmony default export */ __webpack_exports__["a"] = (dbConfig);

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return updateLogger; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return clearLogger; });
let loggerElement = document.querySelector('.logger-container .logger');

let updateLogger = dataString => {
  let htmlString = '<b>' + new Date().toLocaleString() + '</b><span>' + dataString + '</span>';
  let childNode = document.createElement('div');
  childNode.addAtt;
  childNode.innerHTML = htmlString;
  loggerElement.appendChild(childNode);
};

let clearLogger = () => {
  loggerElement.innerHTML = "";
};

/***/ })
/******/ ]);