function renderLoginForm(retry = false) {
  return `
    <form name="login">
      <h1>Login</h1>
      ${!retry ? '' : `<p class="error">Something went wrong. Please try again!</p>`}
      <label>
        <span>Email:</span><input required type="email" name="email">
      </label>
       <label>
        <span>Password:</span><input required type="password" name="password">
      </label>
      <input type="submit" value="Log in">
    </form>
  `;
}

document.querySelector('body').addEventListener('submit', async (event) => {

  let target = event.target;

  if (!target.closest('form[name="login"]')) { return; }

  event.preventDefault();

  let formElements = document.forms.login.elements;
  let requestBody = {};
  for (let element of formElements) {
    if (element.type === 'submit') { continue; }
    requestBody[element.name] = element.value;
  }

  let result;
  try {
    result = await (await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    })).json();
  }
  catch (ignore) { }

  if (!result || result._error) {
    document.querySelector('.login').innerHTML = renderLoginForm(true);
    return;
  }

  location.reload();

});

document.querySelector('body').addEventListener('click', (event) => {
  if (!event.target.closest('a[href="/login"]')) { return; }
  event.preventDefault();
  let loginDiv = document.querySelector('.login');
  loginDiv.innerHTML = renderLoginForm();
  let elementsToHide = document.querySelectorAll('.register, .login, .modal-hider');
  for (element of elementsToHide) {
    element.classList.add('hidden');
  }
  loginDiv.classList.remove('hidden');
  document.querySelector('.modal-hider').classList.remove('hidden');
});

document.querySelector('body').addEventListener('click', (event) => {
  if (!event.target.closest('.modal-hider')) { return; }
  let elementsToHide = document.querySelectorAll('.register, .login, .modal-hider');
  for (element of elementsToHide) {
    element.classList.add('hidden');
  }
});