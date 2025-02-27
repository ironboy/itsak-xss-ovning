function renderRegistrationForm() {
  return `
    <h1>Register</h1>
    <form name="registration">
      <label>
        <span>First name:</span><input required minlength="2" name="firstName" type="text">
      </label>
      <label>
        <span>Last name:</span><input required minlength="2" name="lastName" type="text">
      </label>
      <label>
        <span>Email:</span><input required name="email" type="email">
      </label>
      <label>
        <span>Password:</span><input required minlength="8" name="password" type="password">
      </label>
      <label>
        <span>Repeat password:</span><input required minlength="8"  name="passwordRepeated" type="password">
      </label>
      <input type="submit" value="Register">
    </form>
  `;
}

document.querySelector('body').addEventListener('submit', async (event) => {

  let target = event.target;

  if (!target.closest('form[name="registration"]')) { return; }

  event.preventDefault();

  let formElements = document.forms.registration.elements;
  let requestBody = {};
  for (let element of formElements) {
    if (element.type === 'submit') { continue; }
    requestBody[element.name] = element.value;
  }

  if (requestBody.password !== requestBody.passwordRepeated) {
    alert('The passwords doesn\'t match!\nPlease fill in the same password twice!');
    return;
  }

  delete requestBody.passwordRepeated;

  let result = {};
  try {
    result = await (await fetch('/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    })).json();
  }
  catch (ignore) { }

  if (!result.changes) {
    document.querySelector('.register').innerHTML = `
      <h3>Something went wrong!</h3>
      <p>We could not register you right now because of a technical problem.</p>
      <p>Please try again later!</p>
    `;
    return;
  }

  document.querySelector('.register').innerHTML = `
    <h3>Welcome as a member!</h3>
    <p>You are now successfully registrered as a member!</p>
  `;
});

document.querySelector('body').addEventListener('click', (event) => {

  if (!event.target.closest('a[href="/register"]')) { return; }

  event.preventDefault();

  let registerDiv = document.querySelector('.register');
  registerDiv.innerHTML = renderRegistrationForm();
  registerDiv.classList.remove('hidden');
  document.querySelector('.modal-hider').classList.remove('hidden');
});