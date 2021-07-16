# Getting Started with I-Delta

I-DELTA is a ITEA 3 project that focuses on Distributed Ledger Technologies (DLT), it is led by 19 consortiums from 6 contries. Distributed Ledger Technologies (DLT) undoubtedly are a cutting-edge new breed of technologies with the potential to completely transform the way our society works. DLT will foster switching from the “Internet of information" era to the “Internet of Value" era, whereby decentralised and immutable contracts define business interactions and secure exchanges of information. I-DELTA aims to create an interoperable DLT based platform enhanced by AI, integrating with existing IT systems such as ERP and IoT applications.

## REST API

Within the scope of the I-Delta project, a REST API was developed using the **Python** language and the **Flask** framework. To run the API, you should go to the **/backend/app/controllers** folder and run the `python3 Api.py` command. 

### Folder Structure

The folder structure where the backend processes are located is created as follows. The development of the following folder structure will be welcomed, however, developers are also expected to comply with this structure as much as possible in terms of project integrity.

```
├── app
│   ├── config
│   │   ├── request_keys.py
│   │   ├── required_keys.py
│   │   ├── response_messages.py
│   │   └── secret.py
│   ├── controllers
│   │   ├── Api.py
│   │   ├── AuthController.py
│   ├── helpers
│   │   ├── HelperFunctions.py
│   │   ├── ModelHelper.py
│   ├── middlewares
│   │   ├── ApiBase.py
│   └── models
│       ├── AuthModel.py
└── core
    ├── databases
    │   ├── MongoDB.py
    ├── loggers
    └── scripts
```

### Config

There are constant values used in the project in the **config** folder. In the config folder, there are properties and response messages that should be present in requests to the API. In addition, confidential information such as passwords are kept here. For example, the code below contains the `response_messages.py` file with the return responses.

```
# GENERAL
general = dict(
    unexpected_error = "An unexpected error occurred",
    payload_empty = "field(s) cannot be empty or undefined",
)

# AUTH
signUp = dict(
    already_exists = "This username already exists",
    success = "User created successfully",
)

signIn = dict(
    not_found = "User not found",
    wrong_password = "Wrong password",
    success = "Login successful"
)

token = dict(
    not_found = "Token not found",
    authorization_error = "This user cannot access this method",
    token_expired = "Token expired",
    token_invalid = "Token invalid",
)
```

### Controllers

Methods that respond to http requests are located in the controllers folder. The file named `Api.py` is the file that raises the service and the subclasses are collected in this file and routing is done. **AuthController** is the class where login and account creation are made and it is imported to **Api.py** file from outside and registered as a submodule. New classes to be added should be registered in the file named Api.py with this logic.

```
if __name__ == "__main__":
    app = Flask(__name__)
    CORS(app,supports_credentials=True)
    Api.register(app, route_base = '/api/')
    AuthController.register(app, route_base = '/api/auth/')
    app.run(debug = True, port = 9632)
```

A helper method has been created by using the **decorator** feature of the Python language so that only authorized users can access the methods. If you want only users with the roles you want to access the methods you have developed, you should call the decorator named `@token_control` above the function as follows. In addition, a base class named `ApiBase` has been created and all subclasses are derived from this class in order to carry out common operations to be performed in subclasses from a single place and to easily implement future developments.

```
class Api(FlaskView, ApiBase):
    def __init__(self):
        pass

    @route("test", methods = ["POST"])
    @token_control(roles = ["admin", "user"])
    def test(self):
        return ApiBase.response(self, data = ["one", "two"], message = "response msg", success = True)

```

### Helpers

In the **helpers** folder, there are helper methods that perform general operations that will be used in many places during application development. It is expected that the new helper methods to be added will be defined in this folder. An example helper method appears below.

```
def token_control(f=None, roles=None):
    if not f:
        return functools.partial(token_control, roles=roles)
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('token')

        if not token:
            return response(success = False, message = response_messages.token["not_found"], code = 403), 403

        try:
            data = jwt.decode(token, secret.authentication["SECRET_KEY"])
            current_time = time.mktime((datetime.datetime.now()).timetuple())

            if data["expiry_time"] > current_time:
                if data["role"] in roles:
                    return f(data)
                else:
                    return response(success = False, message = response_messages.token["authorization_error"], code = 401), 401
            else:
                return response(success = False, message = response_messages.token["token_expired"], code = 401), 401
        except:
            return response(data = [], success = False, message = response_messages.token["token_invalid"]), 401

        return f(*args, **kwargs)
    return decorated
```

### Middlewares

In the **middlewares** folder, it is aimed to define the middlewares between the **Controller** and the **UI**, and to perform the necessary actions before the relevant method that will respond to the *HTTP* request works. For example, in the code below, a middleware named `ApiBase` is defined and methods are defined to control the json properties in the request and to standardize the JSON data returned in response.

```
class ApiBase():
    def __init__(self):
        pass

    def response(self, data = [], message = "success", success = True, total_count = 0, code = 0):
        return {
            "data": {
                "data": dumps(data),
                "success": success,
                "message": message,
                "summary": {
                    "total_count": total_count,
                    "code": code
                }
            }
        }

    def request_validation(self, payload, required_keys):
        confirm = True
        missed_keys = ""

        for key in required_keys:
            if key not in payload or str(payload[key]).strip() == "":
                confirm = False
                missed_keys += f"{key}, "
        
        return missed_keys[:-2], confirm

    def check_request_params(self, payload, request_keys):
        params = {}

        for key in request_keys:
            if key in payload:
                params[key] = payload[key]

        return params
```

### Models

In the **models** folder, intermediary classes are defined to communicate with the database. It is aimed to carry out database codes in a separate layer due to the desire to write a cleaner code, to distinguish the operations performed from each other, and to provide easier maintenance against future problems. It is recommended to create a Model for each Controller. Below is an example model class that communicates with the database.

```
class AuthModel():
    def __init__(self):
        self.db = MongoDB()
        self.collection = "users"
        self.modelHelper = ModelHelper()

    def add_user(self, payload):
        is_user_exists = self.is_user_exists(payload["username"])

        if not is_user_exists:
            payload["password"] = generate_password_hash(payload["password"])
            self.db.insert_one(self.collection, payload)
            
            return True
        return False

    def is_user_exists(self, username):
        where = {
            "username": username
        }
        
        return self.modelHelper.cursor_to_json(self.db.find(self.collection, where))
```

### Core

In the **core** folder, only code files that can be used in other projects that are not related to the developed project are defined, in which general operations are executed. For example, there is a class in which **MongoDB** queries are defined in the code below.

```
class MongoDB():
    def __init__(self):
        self.client = MongoClient(secret.mongo["MONGO_URI"])
        self.db = self.client[secret.mongo["DATABASE"]]

    def find(self, collection, filter = {}):
        return self.db[collection].find(filter)

    def find_by_columns(self, collection, filter = {}, columns = {}):
        return self.db[collection].find(filter, columns)

    def find_skip_limit(self, collection, filter = {}, skip = 0, limit = 10):
        return self.db[collection].find(filter).limit(limit).skip(skip)

    def aggregate(self, collection, pipeline = []):
        return self.db[collection].aggregate(pipeline)

    def get_collection_list(self):
        return self.db.collection_names()

    def insert_one(self, collection, data):
        return self.db[collection].insert_one(data)

    def insert_many(self, collection, data):
        return self.db[collection].insert_many(data)
    
    def update_one(self, collection, data, filter = {}, upsert = True):
        return self.db[collection].update_one(filter, data, upsert)

    def update_many(self, collection, data, filter = {}, upsert = True):
        return self.db[collection].update_many(filter, data, upsert)

    def delete_many(self, collection, filter = {}):
        return self.db[collection].delete_many(filter)

    def delete_one(self, collection, filter = {}):
        return self.db[collection].delete_one(filter)

    def count(self, collection, filter = {}):
        return self.db[collection].find(filter).count()
```

## UI

In the UI part of the project, the **React.js** library and the **clockface** component library developed by influxdata are used.

### `npm install`

If you are running the project for the first time, you need to go to the `/frontend` directory and download the npm modules with the `npm install` command.

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### Folder Structure

The folder structure where the frontend processes are located is created as follows. The development of the following folder structure will be welcomed, however, developers are also expected to comply with this structure as much as possible in terms of project integrity.

```
.
├── App.js
├── assets
│   └── images
│       ├── background.jpg
│       ├── login.svg
│       └── logo.png
├── components
│   ├── Auth
│   │   └── Logout.js
│   └── Home
│       ├── LeftSideOperations.js
│       ├── MiddleSequenceDiagram.js
│       └── RightSideInformation.js
├── config.js
├── containers
│   ├── Auth
│   │   ├── SignIn.js
│   │   └── SignUp.js
│   └── Home
│       ├── ExamplePage.js
│       └── HomePage.js
├── helpers
├── history.js
├── index.css
├── index.js
├── layouts
│   ├── AuthLayout.js
│   └── UserLayout.js
├── reportWebVitals.js
├── router
│   └── PrivateRoute.js
├── setupTests.js
├── shared
│   ├── components
│   │   ├── Footer.js
│   │   ├── Header.js
│   │   └── Sidebar.js
│   ├── constants
│   │   ├── navigation.js
│   │   ├── sampleData.js
│   │   └── tips.js
│   └── overlays
│       ├── RegisterBC.js
│       ├── RegisterSC.js
│       └── RegisterWallet.js
├── store
│   ├── auth
│   │   ├── authAction.js
│   │   ├── authReducer.js
│   │   └── authTypes.js
│   ├── general
│   │   ├── generalAction.js
│   │   ├── generalReducer.js
│   │   └── generalTypes.js
│   ├── index.js
│   ├── rootReducer.js
│   └── store.js
└── style
    ├── SigninForm.scss
    └── SignUpForm.scss

```
### Assets

There are external files such as images, logos and pdfs in the assets folder.

### Components

The components folder contains components used in web pages. Component structures are tried to be created as flexible as possible. In this way, it is aimed to use a developed component in several different places.

### Containers

In the **container** folder there are page frames that create web pages and assemble the necessary components. Containers created here are imported into the relevant Layout and accessed via route.

### Router

In the **router** folder, middlewares are defined for accessing the pages. For example, only users logged in to the web page can access the components requested in the `PrivateRoute.js` file below.

```
import React, { useEffect } from 'react'
import { Redirect, Route } from 'react-router-dom'
import { connect } from "react-redux";

const PrivateRoute = ({ user, token, component: Component, ...rest }) => {

    const isLoggedIn = token === "" ? false : true;

    return (
        <Route
            {...rest}
            render={props =>
                isLoggedIn ? (
                    <Component {...props} />
                ) : (
                    <Redirect to={{ pathname: '/sign-in', state: { from: props.location } }} />
                )
            }
        />
    )
}


const mapStateToProps = (state) => {
    return {
        token: state.auth.token,
        user: state.auth.user,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {}
};


export default connect(mapStateToProps, mapDispatchToProps)(PrivateRoute);

```

### Shared

Common components used in web pages are defined in the **shared** folder. For example, components such as sidebar, header, footer are in this folder. In addition, service classes that make requests to the API can also be defined in this folder.

### Store

Redux central state management library is used within the scope of the project. Thanks to Redux, data communication between components is managed from a central storage area and it is aimed to get rid of possible complexity. There are 3 different files in Redux, the codes are generally **Types**, **Action** and **Reducer**. Below is an example redux build.

`authTypes.js`

```
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_ERROR = "LOGIN_ERROR"

export const SIGNUP_SUCCESS = "SIGNUP_SUCCESS";
export const SIGNUP_ERROR = "SIGNUP_ERROR";

export const LOGOUT = "LOGOUT";
```

