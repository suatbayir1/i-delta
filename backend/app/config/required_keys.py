auth = dict(
    signUp = ["username", "password", "role"],
    signIn = ["username", "password"],
)

project = dict(
    add = ["projectName", "infrastructure", "userID"],
    delete = ["id"],
    clone = ["infrastructure", "projectName", "userID"],
    update = ["id"],
    getById = ["id"],
)

action = dict(
    add = ["actionName", "projectID", "transactions"],
    get = ["projectID"],
    delete = ["id"],
)

transaction = dict(
    add = ["actionID", "source", "target", "transactionMessage"],
    delete = ["actionID", "transactionID"],
)