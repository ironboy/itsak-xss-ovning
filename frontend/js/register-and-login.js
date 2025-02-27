async function getLogInfo() {
  let div = document.querySelector('.register-and-login-links');
  let loggedIn;
  try {
    loggedIn = await (await fetch('/api/login')).json();
  }
  catch (ignore) { }
  if (!loggedIn || loggedIn._error) {
    div.innerHTML = `
      <a href="/register">Register</a>
      <a href="/login">Login</a>
    `
  }
  else {
    div.innerHTML = `
        Logged in as ${loggedIn.firstName} ${loggedIn.lastName}
        <a href="/logout">Logout</a>
    `;
    start(loggedIn?.userRole);
  }

}

getLogInfo();


document.querySelector('body').addEventListener('click', async (event) => {

  if (!event.target.closest('a[href="/logout"]')) { return; }

  event.preventDefault();

  let result;
  try {
    result = await (await fetch('/api/login', { method: 'DELETE' })).json();
  }
  catch (ignore) { }

  location.reload();

});