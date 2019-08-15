import Ajax from '../../util/Ajax';

// actions types
export const REQUEST_AUTH = 'REQUEST_AUTH';
export const TOKEN_FROM_LOCALSTORAGE = 'TOKEN_FROM_LOCALSTORAGE';
export const LOGOUT_USER = 'LOGOUT_USER';
export const CLEAR_ERROR_MESSAGE = 'CLEAR_ERROR_MESSAGE';

// actions creators
export function requestAuth(data) {
  if(localStorage.getItem('vntstdtkn'))
    localStorage.removeItem('vntstdtkn');
  let request = new Ajax('user/login', {
    method: 'POST',
    body: {
      email: data.email,
      password: data.password
    }
  });

  return {
    type: REQUEST_AUTH,
    payload: request.result()
  }
}

export function getTokenFromLocalStorage() {
  let fromStorage = localStorage.getItem('vntstdtkn');
  return {
    type: TOKEN_FROM_LOCALSTORAGE,
    meta: JSON.parse(fromStorage)
  }
}

export function logout() {
  return {
    type: LOGOUT_USER
  }
}

export function clearErrorMessage() {
  return {
    type: CLEAR_ERROR_MESSAGE
  }
}
