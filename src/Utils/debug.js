import { debugLog } from './Constants/EnvConstants'

function LOG(level, content, ...optionalParams) {
    if (debugLog >= level ) {
        if (optionalParams.length > 0)
            console.log(level + ' ' + content, optionalParams);
        else
            console.log(level + ' ' + content);
    }
}

export { LOG }