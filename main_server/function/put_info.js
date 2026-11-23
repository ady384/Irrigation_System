const Database = require('better-sqlite3') 
const db =  Database('mydatabase.db')
const deycrept = require('./criptare.js')
const crypto = require('crypto');
function comunication_encrypt(identify, key, iv) {console.log("key " + key + " iv " + iv + "identify: " + identify); return db.prepare('INSERT INTO communication_encrypt (identify, key, iv) VALUES (?, ?, ?)').run(identify, key, iv);}

function Access_login_0(mesage, iddentify, ip_address ) {
    const [Name, password] = deycrept.verifyinfo_level_0(mesage, iddentify).split(':');
    var unic_id = crypto.randomBytes(64).toString('hex');
    db.prepare('INSERT INTO Acces_login (unic_id, Name, ip_address) VALUES (?, ?, ?)').run(unic_id, Name, ip_address);
    return unic_id;
}
function send_message_dispozitiv_user(unic_id,iddentify, message) {
    let info = deycrept.verifyinfo_level_0(message, iddentify);
    if(db.prepare(`select* from dispozitiv_ownd_users where id_dispozitiv = ? and Name = (select Name from Acces_login where unic_id = ?)`).get(info.split(':')[0], unic_id) !== undefined){
        db.prepare(`INSERT INTO message_dispozitiv (id_dispozitiv, message) VALUES (?, ?)`).run(info.split(':')[0], info.split(':')[1]);
        return true;
    }else{
        return false;
    }
}
function send_data_activation_dispozitiv(unic_id, iddentify, body1) {
    let info = deycrept.verifyinfo_level_0(body1, iddentify);
    console.log("info: " + info.split(':')[0] + " " + info.split(':')[1] + " " + info.split(':')[2] + " " + parseInt(info.split(':')[3]) + " " + info.split(':')[4]);
    if(db.prepare(`select* from dispozitiv_ownd_users where id_dispozitiv = ? and Name = (select Name from Acces_login where unic_id = ?)`).get(info.split(':')[0], unic_id) !== undefined){
        db.prepare(`INSERT INTO activated_dispozitiv (id_dispozitiv, type, operetion, numver, action) VALUES (?, ?, ?, ?, ?)`).run(info.split(':')[0], info.split(':')[1], info.split(':')[2], parseInt(info.split(':')[3]), info.split(':')[4]);
       console.log("info: " + info.split(':')[0] + " " + info.split(':')[1] + " " + info.split(':')[2] + " " + parseInt(info.split(':')[3]) + " " + info.split(':')[4]);
        return true;
    }else{
        return false;
    }
}
function message_dispozitiv(id_dispozitiv, message) {
    let info = deycrept.decrypt_dispozitiv_level_0(message, id_dispozitiv);
    //console.log("(put_info) info "+ info + "message"+message);
    let a = db.prepare(`Select * from dispozitiv where id_dispozitiv = ? and key_dispozitiv = ?`).get(id_dispozitiv, info.split(':')[0]);
    if(a !== undefined){
        db.prepare(`INSERT INTO message_dispozitiv (id_dispozitiv, message) VALUES (?, ?)`).run(id_dispozitiv, info.split(':')[1]);
        return true;
    }
    return false;
}
module.exports.send_message_dispozitiv_user = send_message_dispozitiv_user;
module.exports.comunication_encrypt = comunication_encrypt;
module.exports.Access_login_0 = Access_login_0;
module.exports.message_dispozitiv = message_dispozitiv;
module.exports.send_data_activation_dispozitiv = send_data_activation_dispozitiv;