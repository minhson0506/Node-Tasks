'use strict';
const url = 'http://localhost:3000'; // change url when uploading to server

// get query parameter
const getQParam = (param) => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
};

// select existing html elements
const modForm = document.querySelector('#modCatForm');
const userList = document.querySelector('.add-owner');

// add existing cat data to form
const getCat = async (id) => {
  const response = await fetch(url + '/cat/' + id);
  const cat = await response.json();
  const inputs = modForm.querySelectorAll('input');
  inputs[0].value = cat.name;
  inputs[1].value = cat.birthdate;
  inputs[2].value = cat.weight;
  inputs[3].value = cat.cat_id;
  modForm.querySelector('select').value = cat.owner;
};

// create user options to <select>
const createUserOptions = (users) => {
  userList.innerHTML = '';
  users.forEach((user) => {
    // create options with DOM methods
    const option = document.createElement('option');
    option.value = user.user_id;
    option.innerHTML = user.name;
    option.classList.add('light-border');
    userList.appendChild(option);
  });
  // add cat data after userdata
  getCat(getQParam('id'));
};

// get users to form options
const getUsers = async () => {
  try {
    const response = await fetch(url + '/user');
    const users = await response.json();
    createUserOptions(users);
  } catch (e) {
    console.log(e.message);
  }
};
getUsers();

// submit modify form
modForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  const data = serializeJson(modForm);
  const fetchOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };

  console.log(fetchOptions);
  const response = await fetch(url + '/cat', fetchOptions);
  const json = await response.json();
  alert(json.message);
  location.href = 'front.html';
});
