auth = dict(
    signUp = ["username", "password", "firstname", "lastname", "role"],
    signIn = ["username", "password"],
)

project = dict(
    add = ["projectName", "infrastructure", "userID"],
    clone = ["infrastructure", "projectName", "userID"],
    update = ["projectName", "id", "infrastructure", "userID"],
)

action = dict(
    add = ["actionName", "projectID"],
)