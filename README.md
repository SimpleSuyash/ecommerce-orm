
[![Express JS](https://img.shields.io/badge/express.js-blue?style=for-the-badge&logo=express&logoColor=white&labelColor=red)](https://expressjs.com/) [![node.js](https://img.shields.io/badge/Node.js-blue?style=for-the-badge&logo=Node.js&logoColor=white&labelColor=red)](https://nodejs.org/en) [![npm](https://img.shields.io/badge/npm-blue?style=for-the-badge&logo=npm&logoColor=white&labelColor=red)](https://www.npmjs.com/)
[![mysql](https://img.shields.io/badge/mysql-blue?style=for-the-badge&logo=mysql&logoColor=white&labelColor=red)](https://www.mysql.com/) [![dotenv](https://img.shields.io/badge/dotenv-blue?style=for-the-badge&logo=dotenv&logoColor=white&labelColor=red)](https://www.npmjs.com/package/dotenv) [![sequelize](https://img.shields.io/badge/sequelize-blue?style=for-the-badge&logo=sequelize&logoColor=white&labelColor=red)](https://sequelize.org/api/v6/identifiers)


<div align="right"> 
<a href= "http://www.wtfpl.net/about/"><img src = "https://img.shields.io/badge/License-WTFPL-brightgreen.svg"></a>
</div>

# Ecommerce ORM   

This app creates a simple backend application of an internet retail company, so that various API endpoints can be tested in any API Clients such as `Postman`, `Insomnia`.

##  Description

E-commerce websites are vital in the world of electronics industry. They facilate businesses and consumers in participating in the online transcation of electronic products. To support the ever-growing electronic industry, e-commerce platforms are being developed rapidly. So nowdays, developers' job certainly includes creating such technologies. 

This app builds `Node.js` RESTful CRUD `API`s using `Express`, `Sequelize` ORM for `MySQL` database manipulation. `DotEnv` package is use to store sensitive data such as MySQL username, passwrod, database name etc.

By creating this project, I learnt to implement `ORM`, which stands for `Object-Relational Mapping`. ORMs provide a higher-level abstraction, allowing developers to work with JavaScript objects and classes rather than writing complex SQL queries. I learnt to use `Sequelize` to define `Model`s, create association between them, create connection to the database and manipulate the data through various API endpoints.
I also learnt to use `Postman` to test the APIs.


## Table of Contents

1. [Installation](#installation)
1. [Usage](#usage)
1. [Licence](#licence)
1. [Screenshots](#screenshots)
1. [Demo](#demo)


## Installation 

1. Download the [starter code](https://github.com/coding-boot-camp/fantastic-umbrella)
         
1. Install `Node Module`
    ```
    npm i
    ```
1. Create your Project/Repo folder, and paste all the contents of `Develop` from the starter code. Delete the Develop folder.

1. Change the  `.env.EXAMPLE` file to `.env`, and  type in your `database name`, `user` and `password`
1. Before starting the development of the project, run the following in the terminal in the root directory of the project. Every time code changes, the server will automatically restart.
    ```
    npm run dev
    ```

## Usage

To use this project,
- Get a copy of this repo to your local machine.
- Install the `Node Module`
- Change the `.env copy` file to `.env` and insert your database name, user and password
- Change the directory to `db` folder, and type in the following, and followed by your password to connect to your database 
    ```
    mysql - u root -p;
  ```
- Source the `schema`
    ```
    SOURCE schema.sql;
    ```
- Then, change the directory to the root of the project, and type in the following:
    ```
    npm run seed;
    ```
- And, start the `Express Server` by typing in the following:
    ```
    npm run start
    ```
- Open the `Postman` to test the various API endpoints.    
    Some api endpoints are:
    - GET All Categories
        ```
        localhost:3001/api/categories/
        ```
    - GET All Tags
        ```
        localhost:3001/api/tags/
        ```
    - GET All Products
        ```
        localhost:3001/api/products/
        ```



## Licence

This app is licensed under [**WTFPL**](http://www.wtfpl.net/about/)

## Screenshots

Screenshot showing the `Get All Products` endpoint being tested in Postman         
![All Products Get Enpoint](./assets/images/ecommerce-orm.png)


## Demo            
https://github.com/SimpleSuyash/ecommerce-orm/assets/149545043/8f6e8344-2b58-415f-b56e-24ddb41f93b2

