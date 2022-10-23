// /* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properites 'username' and 'password'
 */

function viewAllStatuses(fields) {
  fetch('/api/statuses')
    .then(showResponse)
    .catch(showResponse);
}

function viewStatusByAuthor(fields) {
  fetch(`/api/statuses?author=${fields.author}`)
    .then(showResponse)
    .catch(showResponse);
}

function createStatus(fields) {
  fetch('/api/statuses', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function deleteStatus(fields) {
  fetch(`/api/statuses/${fields.id}`, {method: 'DELETE'})
    .then(showResponse)
    .catch(showResponse);
}
