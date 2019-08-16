import { SUFFIXLOADING, SUFFIXSUCCESS, SUFFIXERROR } from '../configStore';
import { REQUEST_AUTH, TOKEN_FROM_LOCALSTORAGE, LOGOUT_USER, CLEAR_ERROR_MESSAGE } from '../actions/authActions';

const initialState = {
  tokenData: null,
  logedUser: null,
  loading: false,
  successfullRequest: undefined,
  error: false
}

function authReducer(state = initialState, action) {
  switch (action.type) {
    // request a new token from server
    case REQUEST_AUTH + SUFFIXLOADING:
      return {
        ...state,
        loading: true
      }

    case REQUEST_AUTH + SUFFIXSUCCESS:
      return {
        ...state,
        loading: false,
        successfulRequest: true,
        tokenData: {
          token: action.payload.access_token,
          token_type: action.payload.token_type,
          expires_at: action.payload.expires_at
        },
        logedUser: {
          id: action.payload.user.data.id,
          email: action.payload.user.data.email,
          role: action.payload.user.data.role,
        }
      }

    case REQUEST_AUTH + SUFFIXERROR:
      return {
        ...state,
        loading: false,
        error: action.payload
      }

    // get token data from localStorage
    case TOKEN_FROM_LOCALSTORAGE:
      return {
        ...state,
        ...action.meta
      }

    case LOGOUT_USER:
      return {
        ...initialState,
        logedUser: null
      }

    case CLEAR_ERROR_MESSAGE:
      return {
        ...initialState,
      }

    default:
      return state;
  }
}

export default authReducer;
