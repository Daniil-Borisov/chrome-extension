import authorize from "./authorize";
import { LOG } from '../Utils/debug';

type AuthorizeFn = { ({ token, error }: { token: string; error: string; }): void; (arg0: { token?: string; error?: string; }): void; };

const authError = { 'status': 'error', 'message': "bad client id: APP_ID_OR_ORIGIN_NOT_MATCH" };

export const authorizeLaunchWebAuthFlow = (fn: AuthorizeFn) => {
  authorize((token: string) => {
    if (token) {
      fn({ token });
    } else {
      LOG(2, "Service worker - authorizeLaunchWebAuthFlow:err ", authError);
      fn({ error: authError.message });
    }
  });
}

export const authorizeGetAuthToken = (fn: AuthorizeFn) => {
  chrome.identity.getAuthToken({ 'interactive': true }, (token) => {
    // LOG(4, "token: ", token);
    const lastErr = chrome.runtime.lastError;
    if (lastErr) {
      LOG(2, `authorizeGetAuthToken lastError: ${JSON.stringify(lastErr)}`);
    }
    if (token) {
      fn({ token });
    } else {
      LOG(2, "Service worker - authorizeGetAuthToken:err ", authError);
      fn({ error: authError.message });
    }
  });
}
