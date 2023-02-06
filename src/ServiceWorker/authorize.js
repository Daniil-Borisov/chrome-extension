/* eslint-disable no-var */
/* exported getAccessToken */
import { LOG } from '../Utils/debug';
// eslint-disable-next-line no-use-before-define
const browser = browser || chrome;
const REDIRECT_URL = browser.identity.getRedirectURL();
const { oauth2 } = browser.runtime.getManifest();

const CLIENT_ID = oauth2.client_id;
const SCOPES = oauth2.scopes;

const AUTH_URL =
`https://accounts.google.com/o/oauth2/auth\
?client_id=${CLIENT_ID}\
&response_type=token\
&redirect_uri=${encodeURIComponent(REDIRECT_URL)}\
&scope=${encodeURIComponent(SCOPES.join(' '))}`;

LOG(4, "Service worker - REDIRECT_URL", REDIRECT_URL);
LOG(4, "Service worker - OAUTH", {oauth2});
LOG(4, "Service worker - AUTH_URL", {AUTH_URL});

const VALIDATION_BASE_URL = "https://www.googleapis.com/oauth2/v3/tokeninfo";

function extractAccessToken(redirectUri) {
  const m = redirectUri.match(/[#?](.*)/);
  if (!m || m.length < 1)
  return null;
  const params = new URLSearchParams(m[1].split("#")[0]);
  return params.get("access_token");
}

function validate(redirectURL) {
  const accessToken = extractAccessToken(redirectURL);
  if (!accessToken) {
    throw new Error("Authorization failure");
  }
  const validationURL = `${VALIDATION_BASE_URL}?access_token=${accessToken}`;
  const validationRequest = new Request(validationURL, {
    method: "GET"
  });
  
  function checkResponse(response) {
    return new Promise((resolve, reject) => {
      if (response.status !== 200) {
        LOG(2, "Service worker - checkResponse ", "Token validation error");
        reject(new Error("Token validation error"));
      }
      response.json().then((json) => {
        if (json.aud && (json.aud === CLIENT_ID)) {
          resolve(accessToken);
        } else {
        LOG(2, "Service worker - checkResponse:json ", "Token validation error");
        reject(new Error("Token validation error"));
        }
      });
    });
  }

  return fetch(validationRequest).then(checkResponse);
}

export default function authorize(callbackFn) {
  return browser.identity.launchWebAuthFlow({
    interactive: true,
    url: AUTH_URL
  }, (rq) => {
    validate(rq).then(callbackFn);
  });
}

// function getAccessToken() {
//   return authorize();
// }
