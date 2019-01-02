[![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)](https://choosealicense.com/licenses/mit/)
[![Build Status](https://travis-ci.org/QUDUSKUNLE/Population-Management-System.svg?branch=master)](https://travis-ci.org/QUDUSKUNLE/Population-Management-System)
[![Coverage Status](https://coveralls.io/repos/github/QUDUSKUNLE/Population-Management-System/badge.svg?branch=master)](https://coveralls.io/github/QUDUSKUNLE/Population-Management-System?branch=master)

# Population Management System

Population Management System that contains a list of locations and the total number of residents in each location by gender.

## Getting Started

Clone the repository

```
$ git clone git@github.com:QUDUSKUNLE/Population-Management-System.git
```

Install packages

```
$ npm install
```

Change `.env.sample` to `.env` and add the needed values

Start application

```
$ npm run debug
```

### Endpoints

| Endpoint                | HTTP Method | Description                                |
| ------------------------| ----------- | ------------------------------------------ |
| /api/v1/signup          | POST        | Returns payload a new user sign up         |
| /api/v1/signin          | POST        | Returns payload a user sign in             |
| /api/v1/locations       | POST        | Create a new location with male and female population |
| /api/v1/locations       | GET         | Get a location by id or locations          |
| /api/v1/locations/:id   | PUT         | Update a location                          |
| /api/v1/locations/:id   | DELETE      | Delete a location by id                    |

### Documentation

Visit [API DOC](https://web.postman.co/collections/1515024-01a58e27-c509-4009-8033-baf1e6629ce5?workspace=1cebf9f6-06c8-4420-81c9-b5843b20c305) for API documentation

### Prerequisites

This application was built with Node js so you'll need the following to get it up and running

- [MongoDB](https://mongoosejs.com/)
- [Express](https://expressjs.com)
- [Node Js](https://nodejs.org/en/download/)


## Product Limitation

- This is just the API no frontend consuming it yet

## Want to Contribute?

- Fork the repository
- Make your contributions
- Ensure your codes follow the [AirBnB Javascript Styles Guide](http://airbnb.io/javascript/)
- Create Pull request against the develop branch.

## Author

- [Qudus Yekeen](https://github.com/QUDUSKUNLE)
