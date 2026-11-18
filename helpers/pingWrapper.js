var ping = require('ping');


async function Ping_wrapper() {
    try {
        const resp = await ping.promise.probe('google.com');
        return resp.avg;
    }
    catch (e) {
        console.log(`Error ${e}`)
        return "Undefined"
    }
}


module.exports = {
    Ping_wrapper,
}