const Database = require('better-sqlite3') 
const db =  Database('mydatabase.db')

const get =require('./get_information.js')
const crypto = require('crypto');

function decrypt_esp32(base64EncryptedText, key, iv) {
  const keyBuffer =  Buffer.from(key,'hex')
  const ivBuffer = Buffer.from(iv, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', keyBuffer, ivBuffer);
  const encryptedBuffer = Buffer.from(base64EncryptedText, 'base64');
  let decrypted = decipher.update(encryptedBuffer);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
 return decrypted.toString('utf8').toString('hex');
}
function decrypt(base64EncryptedText, key, iv) {
  const keyBuffer =  Buffer.from(key,'hex')
  const ivBuffer = Buffer.from(iv, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', keyBuffer, ivBuffer);
  const encryptedBuffer = Buffer.from(base64EncryptedText, 'base64');
  let decrypted = decipher.update(encryptedBuffer);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
 // return decrypted.toString('utf8').toString('hex');
  const info = decrypted.toString('utf8');
  return info.split(',').map(Number).map(c => String.fromCharCode(c)).join('');
}


function encrypt(plainText, key, iv) {
  const keyBuffer = Buffer.from(key, 'hex');
  const ivBuffer = Buffer.from(iv, 'hex');
  console.log("plaintax"+typeof(plainText) + "d" + plainText)

  const cipher = crypto.createCipheriv('aes-256-cbc', keyBuffer, ivBuffer);

  // inversul lui: info.split(',').map(Number).map(c => String.fromCharCode(c)).join('')
  const info = plainText
    .split('')
    .map(c => c.charCodeAt(0))
    .join(',');

  const encryptedBuffer = Buffer.concat([
    cipher.update(Buffer.from(info, 'utf8')),
    cipher.final()
  ]);

  return encryptedBuffer.toString('base64');
}

function generateRandomKey_iv() {

        var indentify = crypto.randomBytes(64).toString('hex');
        var key = crypto.randomBytes(32).toString('hex');
        var iv = crypto.randomBytes(16).toString('hex');
        
  return { key, iv , indentify };
}
function verifyinfo(mesaej, iddentify) {
  //console.log("mesaej: "+mesaej + " iddentify: "+iddentify)
  const { key, iv } = get.key_iv(iddentify);
 // console.log("(criptare )key: "+key + " iv: "+iv)
  const continut = decrypt(mesaej, key, iv);
 // console.log("continut: "+continut)          
   
  const continutArray = continut.split(':');  
  
  for(const element of continutArray) {
    for(let i = 0; i < element.length; i++) {
        if(element[i] === '!' || element[i] === '@' || element[i] === '#' || element[i] === '$' || element[i] === '%' || element[i] === '^' || element[i] === '&' || element[i] === '*' || element[i] === '(' || element[i] === ')' || element[i] === '-' || element[i] === '+' || element[i] === '=' || element[i] === '{' || element[i] === '}' || element[i] === '[' || element[i] === ']' || element[i] === '|' || element[i] === '\\' || element[i] === ':' || element[i] === ';' || element[i] === '"' || element[i] === '\'' || element[i] === '<' || element[i] === '>' || element[i] === ',' || element[i] === '.' || element[i] === '?' || element[i] === '/' ) {
          console.log("Invalid character found: " + element[i]);
          return "Invalid character found in the input.";
      }
    }
}
return continut;
}
function decrypt_dispozitiv_level_0(mesaej, id_dispozitiv) {
  
 let { key, iv } = db.prepare(`Select key, iv from encrypt_dispozitiv where id_dispozitiv = ?`).get(id_dispozitiv);
  const continut = decrypt_esp32(mesaej, key, iv);
  console.log("(decriptare_dispozitiv)continut: "+mesaej+" key:" + key + " iv:"+ iv)
  
  const continutArray = continut.split(':');  
  for(const element of continutArray) {
    for(let i = 0; i < element.length; i++) {
        if(element[i] === '!' || element[i] === '@' || element[i] === '#' || element[i] === '$' || element[i] === '%' || element[i] === '^' || element[i] === '&' || element[i] === '*' || element[i] === '(' || element[i] === ')' || element[i] === '-' || element[i] === '+' || element[i] === '=' || element[i] === '{' || element[i] === '}' || element[i] === '[' || element[i] === ']' || element[i] === '|' || element[i] === '\\' || element[i] === ':' || element[i] === ';' || element[i] === '"' || element[i] === '\'' || element[i] === '<' || element[i] === '>' || element[i] === ',' || element[i] === '.' || element[i] === '?' || element[i] === '/' ) {
          //console.log("Invalid character found: " + element[i]);
          return "Invalid character found in the input.";
      }
     
    }
  }
   return continut;
}
module.exports.decrypt_esp32 = decrypt_esp32;
module.exports.encrypt = encrypt;
module.exports.decrypt = decrypt;
module.exports.verifyinfo_level_0 = verifyinfo;
module.exports.generateRandomKey_iv = generateRandomKey_iv;
module.exports.decrypt_dispozitiv_level_0 = decrypt_dispozitiv_level_0;