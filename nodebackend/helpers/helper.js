exports.errorsToString = (errors) => {
    let message = "";

    errors.forEach(err => {
        message += `${err.param}: ${err.msg}\n`
    });

    return message;
}