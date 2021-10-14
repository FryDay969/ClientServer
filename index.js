const http = require("http");
const fs = require('fs');
const lodash = require('lodash')
const cluster = require('cluster');
const totalCPUs = require('os').cpus().length;
require("dotenv").config();


const getMethods = require('./getMethonds');


const PORT = process.env.PORT || 3000;

if(cluster.isMaster){
    for(let i=0; i<totalCPUs; i++){
        cluster.fork();
    }
} else{
    const server = http.createServer((req, res) =>{
            if (req.url === "/api/users" && req.method === "GET") {
                res.writeHead(200, {"Content-Type": "application/json"});
                fs.readFile('./users.json', 'utf-8', (err, data) => {
                    if (err) {
                        throw err
                    } else{
                        JSON.parse(data);
                        res.write(data);
                        res.end();
                    }
                });
            } else if(req.url.match(/\/api\/users\/([0-9]+)/) && req.method === "GET") {
                res.writeHead(200, {"Content-Type": "application/json"});
                fs.readFile('./users.json', 'utf-8', (err, data) => {
                    if (err) {
                        throw err
                    } else {
                        let user = JSON.parse(data);
                        let ID = lodash.random(0,9);
                        res.write(`${user.users[ID].name} ${user.users[ID].lastname}`);
                        res.end();
                    }
                })

            }  else if(req.url === "/api/users" && req.method === "POST") {
                res.writeHead(200, {"Content-Type": "application/json"});
                fs.readFile('./users.json', 'utf-8', (err, data) => {
                    if (err) {
                        throw err
                    } else {
                        const newuser = {
                            "id": 11,
                            "name": "Paul",
                            "lastname": "Johnson"
                        }
                        let user = JSON.parse(data);
                        user.users.push(newuser);
                        res.write(`${JSON.stringify(user)}`)
                        res.end();
                    }
                })
            } else if (req.url.match(/\/api\/users\/([0-9]+)/) && req.method === "PATCH"){
                res.writeHead(200, {"Content-Type": "application/json"});
                fs.readFile('./users.json', 'utf-8', (err, data) => {
                    if (err) {
                        throw err
                    } else {
                        let user = JSON.parse(data);
                        let ID = lodash.random(0,9);
                        user.users[ID].name = "NewValue";
                        user.users[ID].lastname = "NewValue";
                        res.write(`${JSON.stringify(user)}`);
                        res.end();
                    }
                })
            }
            else if (req.url.match(/\/api\/users\/([0-9]+)/) && req.method === "DELETE"){
                res.writeHead(200, {"Content-Type": "application/json"});
                fs.readFile('./users.json', 'utf-8', (err, data) => {
                    if (err) {
                        throw err
                    } else {
                        let user = JSON.parse(data);
                        let ID = lodash.random(0,9);
                        delete user.users[ID];
                        console.log(user);
                        res.write(`${JSON.stringify(user)}`);
                        res.end();
                    }
                })
            }else if(!req.url.includes("/api/users")){
                res.writeHead(404, {"Content-Type": "text/plain"});
                res.end();
            }
            else if(req.header !== 'Bearer 12345'){
                res.writeHead(401, {"Content-Type": "text/plain"});
                res.write("Error");
                res.end();
            }

            else {
                res.writeHead(200, {"Content-Type": "application/json"});
                res.write("Hello World");
            }
        }

    );


    server.listen(PORT, ()=>{
        console.log(`Server started on : ${PORT}`)
    })

}







