import $ from 'jquery';

export let getFormElements = () => {
  let bookObject = {
    title: $('[name="title"]').val(),
    author: $('[name="author"]').val(),
    type: $('[name="type"]').val()
  }
  return bookObject;
}

export let setFormElements = function(title, author, type) {
  $('[name="title"]').val(title);
  $('[name="author"]').val(author);
  $('[name="type"]').val(type);
}

export let objectifyBookObject = (bookObject) => {
  return {
    title: bookObject.title,
    author: bookObject.author,
    type: bookObject.type
  };
};

export let createObject = (title, author, type) => {
  return {
    title: title,
    author: author,
    type: type
  }
}
