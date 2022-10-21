
/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properites 'username' and 'password'
 */

function viewAllReacts(fields) {
  fetch('/api/reactions')
    .then(showResponse)
    .catch(showResponse);
}

function viewReactsByAuthor(fields) {
  fetch(`/api/reactions?userId=${fields.user}`)
    .then(showResponse)
    .catch(showResponse);
}

function viewReactsByFreet(fields) {
  fetch(`/api/reactions?freetId=${fields.freetId}`)
    .then(showResponse)
    .catch(showResponse);
}

function createReact(fields) {
  fetch(`/api/reactions?reactionType=${fields.reactionType}?freetId=${fields.freetId}`, {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function deleteReact(fields) {
  fetch(`/api/reactions/${fields.id}`, {method: 'DELETE'})
    .then(showResponse)
    .catch(showResponse);
}
