const fs = require('fs');


const getAllUsers = () => {
    fs.readFile('./users.json', 'utf-8', (err, data) => {
        if (err) {
            throw err
        } else{
            return JSON.parse(data)
        }
    })
}

module.exports.getAllUsers = getAllUsers


