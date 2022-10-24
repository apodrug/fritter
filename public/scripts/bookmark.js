/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 */

 function viewAllBookmarks() {
    fetch('/api/bookmarks')
      .then(showResponse)
      .catch(showResponse);
  }
  
  function viewBookmarksByUser(fields) {
    fetch(`/api/bookmarks?author=${fields.author}`)
      .then(showResponse)
      .catch(showResponse);
  }
  
  function createBookmark(fields) {
    fetch(`/api/bookmarks?freetId=${fields.freetId}`, {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
      .then(showResponse)
      .catch(showResponse);
  }
  
  function deleteBookmark(fields) {
    fetch(`/api/bookmarks/${fields.id}`, {method: 'DELETE'})
      .then(showResponse)
      .catch(showResponse);
  }
  