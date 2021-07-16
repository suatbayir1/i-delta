# Getting Started with I-Delta

I-DELTA is a ITEA 3 project that focuses on Distributed Ledger Technologies (DLT), it is led by 19 consortiums from 6 contries. Distributed Ledger Technologies (DLT) undoubtedly are a cutting-edge new breed of technologies with the potential to completely transform the way our society works. DLT will foster switching from the “Internet of information" era to the “Internet of Value" era, whereby decentralised and immutable contracts define business interactions and secure exchanges of information. I-DELTA aims to create an interoperable DLT based platform enhanced by AI, integrating with existing IT systems such as ERP and IoT applications.

## REST API

Within the scope of the I-Delta project, a REST API was developed using the **Python** language and the **Flask** framework. To run the API, you should go to the **/backend/app/controllers** folder and run the `python3 Api.py` command. 

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

There are constant values used in the project in the **config** folder. In the config folder, there are properties and response messages that should be present in requests to the API. In addition, confidential information such as passwords are kept here.

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

In the **helpers** folder, there are helper methods that perform general operations that will be used in many places during application development. It is expected that the new helper methods to be added will be defined in this folder.

In the **middlewares** folder, it is aimed to define the middlewares between the **Controller** and the **UI**, and to perform the necessary actions before the relevant method that will respond to the *HTTP* request works.

## UI

In the UI part of the project, the **React.js** library and the **clockface** component library developed by influxdata are used.

### `npm install`

If you are running the project for the first time, you need to go to the `/frontend` directory and download the npm modules with the `npm install` command.

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.
