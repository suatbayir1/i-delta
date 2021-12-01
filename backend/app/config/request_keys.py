auth = dict(
    signUp = ["username", "password", "firstname", "lastname", "email"],
    signIn = ["username", "password"],
    editProfile = ["firstname", "lastname", "email", "location"],
)

project = dict(
    add = ["projectName", "infrastructure", "userID"],
    clone = ["infrastructure", "projectName", "userID"],
    update = ["projectName", "id", "infrastructure", "userID"],
)

action = dict(
    add = ["actionName", "projectID", "transactions"],
)

transaction = dict(
    add = ["actionID", "source", "target", "transactionMessage"],
    delete = ["actionID", "transactionID"],
)

bc = dict(
    add = ["userID", "selectedNetwork", "bcName", "infrastructure"],
)

sc = dict(
    add = ["userID", "abiContent", "contractAddress", "contractName", "infrastructure"],
)

did = dict(
    generate = ["name", "email", "location", "addresses"],
)