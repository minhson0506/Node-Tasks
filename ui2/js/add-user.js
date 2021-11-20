'use strict';
const url = 'http://localhost:3000'; // change url when uploading to server

// select existing html elements
const addUserForm = document.querySelector('#addUserForm');

// submit add user form
addUserForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  const data = serializeJson(addUserForm);
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  };

  const response = await fetch(url + '/user', fetchOptions);
  const json = await response.json();
  alert(json.message);
  location.href = 'front.html';
});
