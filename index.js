const http = require("http");
const fs = require('fs');
const lodash = require('lodash')
const cluster = require('cluster');
const totalCPUs = require('os').cpus().length;
require("dotenv").config();
const { parse } = require('querystring');
const { v4: uuidv4 } = require('uuid');
const PORT = process.env.PORT || 3000;

// function regularExpression(string){
//     return `/\/api\/${string}\/([0-9]+)/`
// }

if(cluster.isMaster){
    for(let i=0; i<totalCPUs; i++){
        cluster.fork();
    }
} else{
    const server = http.createServer((req, res) =>{
            if (req.header && req.authorization !== 'Bearer 12345'){
                res.writeHead(401, {"Content-Type": "text/plain"});
                res.write("Error");
                res.end();
            }
            else if(req.url === "/" && req.method === "GET") {
                res.writeHead(200, {"Content-Type": "application/json"})
                res.write("Home page");
                res.end()
                }
            else if(req.url === "/api/users" && req.method === "GET") {
                res.writeHead(200, {"Content-Type": "application/json"});
                fs.readFile('./users.json', 'utf-8', (err, data) => {
                    if (err) {
                        throw err;
                        res.end(new Error(err));
                    } else{
                        res.write(data);
                        res.end();
                    }
                });
            } else if(req.url.match(/\/api\/users\/([0-9]+)/) && req.method === "GET") {
                if(userId > 9){
                    res.writeHead(400, {"Content-Type": "Bad request"});
                    res.end()
                }else{
                    res.writeHead(200, {"Content-Type": "application/json"});
                    fs.readFile('./users.json', 'utf-8', (err, data) => {
                        if (err) {
                            throw err
                            res.end(new Error(err));
                        } else {
                            let userId = req.url.replace('/api/users/', '');
                            let user = JSON.parse(data);
                            res.write(`${user.users[userId].name} ${user.users[userId].lastname}`);
                            res.end();
                        }
                    })
                }
            }  else if(req.url === "/api/users" && req.method === "POST") {
                res.writeHead(200, {"Content-Type": "application/json"})
                let body = '';
                req.on('data', chunk => {
                    body += chunk.toString();
                });
                req.on('end', () => {
                    let newUser = parse(body);
                    newUser['id'] = uuidv4();
                    fs.readFile('./users.json', 'utf-8', (err, data) => {
                        if (err) {
                            throw err
                            res.end(new Error(err));
                        } else {
                            let newUserList = JSON.parse(data);
                            newUserList.users.push(newUser);
                            res.write(`${JSON.parse(newUserList)}`)
                            res.end();
                        }
                    })
                });
            }
              else if (req.url.match(/\/api\/users\/([0-9]+)/) && req.method === "PATCH"){
                res.writeHead(200, {"Content-Type": "application/json"});
                let body = '';
                req.on('data', chunk => {
                    body += chunk.toString();
                });
                req.on('end', () => {
                    let updatedUserInfo = parse(body);
                    fs.readFile('./users.json', 'utf-8', (err, data) => {
                        if (err) {
                            throw err
                            res.end(new Error(err));
                        } else {
                            let userId = req.url.replace('/api/users/', '');
                            let users = JSON.parse(data);
                            users.users[userId].name = updatedUserInfo.name;
                            users.users[userId].lastname = updatedUserInfo.lastname;
                            res.write(`${JSON.stringify(users)}`);
                            res.end();
                        }
                    })
                });
            }
            else if (req.url.match(/\/api\/users\/([0-9]+)/) && req.method === "DELETE"){
                res.writeHead(200, {"Content-Type": "application/json"});
                fs.readFile('./users.json', 'utf-8', (err, data) => {
                    if (err) {
                        throw err
                        res.end(new Error(err));
                    } else {
                        let userId = req.url.replace('/api/users/', '');
                        let user = JSON.parse(data);
                        user.users.splice(userId - 1,1)
                        res.write(`${JSON.stringify(user.users)}`);
                        res.end();
                    }
                })
            }else if(!req.url.includes("/api/users")){
                res.writeHead(404, {"Content-Type": "text/plain"});
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







