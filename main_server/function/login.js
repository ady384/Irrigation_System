const Database = require('better-sqlite3') 
const db =  Database('mydatabase.db')
const deycrept = require('./criptare.js')
const put_info = require('./put_info.js')
function step_1(mesaej,iddentify) {
  //  console.log("decrypting message: " + deycrept.verifyinfo_level_0(mesaej, iddentify));
    const info = deycrept.verifyinfo_level_0(mesaej, iddentify);
    const [user, password] = info.split(':');
  //  console.log(user, password);
    let a = db.prepare('SELECT * FROM users WHERE Name = ? AND Password = ?').get(user, password);
    return !!a;
}
function Access_login_1(mesage,unic_id,ip_address , iddentify) { //i dont think i need this
    console.log("(login access_login_1 )mesage: " + mesage + " unic_id: " + unic_id + " ip_address: " + ip_address + " iddentify: " + iddentify);
    const [Name, password] = deycrept.verifyinfo_level_0(mesage, iddentify).split(':');
    console.log("Name: " + Name + " password: " + password + " unic_id: " + unic_id + " ip_address: " + ip_address);
    let a = db.prepare('SELECT * FROM Acces_login WHERE unic_id = ? and Name = ? AND ip_address = ?').get(unic_id, Name, ip_address);
    if (!a) {
        return false;
    }
    return true;
}
function Access_login_2(unic_id,ip_address) {
    let a = db.prepare('SELECT * FROM Acces_login WHERE unic_id = ? AND ip_address = ?').get(unic_id, ip_address);
    if (!a) {
        return false;
    }
    return true;
}


function step_0_comunication() {
    const {key, iv, indentify} = deycrept.generateRandomKey_iv();
    put_info.comunication_encrypt(indentify, key, iv);
    return {key, iv, indentify};
}
module.exports.Access_login_1 = Access_login_1;
module.exports.Access_login_2 = Access_login_2;
module.exports.step_0_comunication = step_0_comunication;
module.exports.step_1 = step_1;
