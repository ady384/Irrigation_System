const Database = require('better-sqlite3') 
const db =  Database('mydatabase.db')
const criptare = require('./criptare.js')
function key_iv(identify) {console.log("(in get_info )identify: " + identify+"|||||"); return db.prepare('SELECT key, iv FROM communication_encrypt WHERE identify = ? ').get(identify);}

function message_dispozitiv(id_dispozitiv,unic_id) {
 let a = db.prepare(`select* from dispozitiv_ownd_users where id_dispozitiv = ? and Name = (select Name from Acces_login where unic_id = ?)`).get(id_dispozitiv,unic_id);    
 if (a !== undefined){
    return db.prepare(`select  message date_message from message_dispozitiv where id_dispozitiv = ?`).get(id_dispozitiv);
 }
 return undefined;
}
function get_dispozitive_type(message,  unic_id, identify) {
   let continut = criptare.verifyinfo_level_0(message, identify);
   if(db.prepare(`select* from dispozitiv_ownd_users where id_dispozitiv = ? and Name = (select Name from Acces_login where unic_id = ?)`).get(continut,unic_id) !== undefined){
      //console.log("(get_dispozitive_type) get_dispozitive_type: " + continut + " unic_id: " + unic_id + " continut: " + continut);
      //console.log("(get_dispozitive_type) type_dispozitiv: " + db.prepare(`select type_dispozitiv from dispozitiv where id_dispozitiv = ?`).get(continut));
   
      return criptare.encrypt(db.prepare(`select type_dispozitiv from dispozitiv where id_dispozitiv = ?`).get(continut).type_dispozitiv, db.prepare('SELECT key, iv FROM communication_encrypt WHERE identify = ? ').get(identify).key, db.prepare('SELECT key, iv FROM communication_encrypt WHERE identify = ? ').get(identify).iv);}
}
function get_on_off_pompa_apa(message,identify){
   let continut1 = criptare.decrypt_esp32(message, db.prepare('SELECT key FROM encrypt_dispozitiv WHERE id_dispozitiv = ? ').get(identify).key, db.prepare('SELECT  iv FROM encrypt_dispozitiv WHERE id_dispozitiv = ? ').get(identify).iv);
   let continut = continut1.split(':')[0];
   console.log("continut: " + continut + " identify: " + identify);
   if(db.prepare(`select* from dispozitiv where id_dispozitiv = ? and type_dispozitiv = 'Pompa_apa' and key_dispozitiv = ?`).get(identify,continut) !== undefined){
   //       type TEXT not null,
   //  operetion TEXT not null,
   //  numver INTEGER not null,
      let a31 = db.prepare(`select message from message_dispozitiv where id_dispozitiv = ? order by date_message desc limit 1`).get(identify).message;
   
     
      if (a31.slice(0, 2)== "ON"){
         return criptare.encrypt("MN" + String(Math.random()), db.prepare('SELECT key FROM encrypt_dispozitiv WHERE id_dispozitiv = ? ').get(identify).key, db.prepare('SELECT  iv FROM encrypt_dispozitiv WHERE id_dispozitiv = ? ').get(identify).iv);
      } else if (a31.slice(0, 2) == "OF"){ /// MN = Manual ON , MF = Manual OFF
         return criptare.encrypt("MF" + String(Math.random()), db.prepare('SELECT key FROM encrypt_dispozitiv WHERE id_dispozitiv = ? ').get(identify).key, db.prepare('SELECT  iv FROM encrypt_dispozitiv WHERE id_dispozitiv = ? ').get(identify).iv);
      }
   
      if(db.prepare(`select manual_or_auto from dispozitiv where id_dispozitiv = ?`).get(identify).manual_or_auto == "auto"){
      const a = db.prepare(`select action,type,operetion,numver from activated_dispozitiv where id_dispozitiv = ?`).all(identify);
      
      for(let i = 0; i < a.length; i++){
         console.log("a: " + a[i].action + " " + a[i].type + " " + a[i].operetion + " " + a[i].numver);
         switch(a[i].action){
            case "ON":
               switch (a[i].operetion){
                  case"biger":
                     if(db.prepare(`select * from message_dispozitiv where id_dispozitiv = ? order by date_message desc limit 1`).get(a[i].type).message > a[i].numver){
                        console.log("message: " + db.prepare(`select * from message_dispozitiv where id_dispozitiv = ? order by date_message desc limit 1`).get(a[i].type).message + " numver: " + a[i].numver);
                        return criptare.encrypt("ON" + String(Math.random()), db.prepare('SELECT key FROM encrypt_dispozitiv WHERE id_dispozitiv = ? ').get(identify).key, db.prepare('SELECT  iv FROM encrypt_dispozitiv WHERE id_dispozitiv = ? ').get(identify).iv);
                     }
                  case"smaller":
                     if(db.prepare(`select * from message_dispozitiv where id_dispozitiv = ? order by date_message desc limit 1`).get(a[i].type).message < a[i].numver){
                        return criptare.encrypt("ON" + String(Math.random())  , db.prepare('SELECT key FROM encrypt_dispozitiv WHERE id_dispozitiv = ? ').get(identify).key, db.prepare('SELECT  iv FROM encrypt_dispozitiv WHERE id_dispozitiv = ? ').get(identify).iv);
                     }
                  case"equal":
                     if(db.prepare(`select * from message_dispozitiv where id_dispozitiv = ? order by date_message desc limit 1`).get(a[i].type).message == a[i].numver){
                        return criptare.encrypt("ON" + String(Math.random()), db.prepare('SELECT key FROM encrypt_dispozitiv WHERE id_dispozitiv = ? ').get(identify).key, db.prepare('SELECT  iv FROM encrypt_dispozitiv WHERE id_dispozitiv = ? ').get(identify).iv);
                     }
               }
               case "OF":
                  switch (a[i].operetion){
                     case"biger":
                        if(db.prepare(`select * from message_dispozitiv where id_dispozitiv = ? order by date_message desc limit 1`).get(a[i].type).message > a[i].numver){
                           return criptare.encrypt("OFF" + String(Math.random()), db.prepare('SELECT key FROM encrypt_dispozitiv WHERE id_dispozitiv = ? ').get(identify).key, db.prepare('SELECT  iv FROM encrypt_dispozitiv WHERE id_dispozitiv = ? ').get(identify).iv);
                        }
                     case"smaller":
                        if(db.prepare(`select * from message_dispozitiv where id_dispozitiv = ? order by date_message desc limit 1`).get(a[i].type).message < a[i].numver){
                           return criptare.encrypt("OFF" + String(Math.random()), db.prepare('SELECT key FROM encrypt_dispozitiv WHERE id_dispozitiv = ? ').get(identify).key, db.prepare('SELECT  iv FROM encrypt_dispozitiv WHERE id_dispozitiv = ? ').get(identify).iv);
                        }
                     case"equal":
                        if(db.prepare(`select * from message_dispozitiv where id_dispozitiv = ? order by date_message desc limit 1`).get(a[i].type).message == a[i].numver){
                           return criptare.encrypt("OFF" + String(Math.random()), db.prepare('SELECT key FROM encrypt_dispozitiv WHERE id_dispozitiv = ? ').get(identify).key, db.prepare('SELECT  iv FROM encrypt_dispozitiv WHERE id_dispozitiv = ? ').get(identify).iv);
                        }
                  }

         }
      }
   }
      return criptare.encrypt(a31, db.prepare('SELECT key FROM encrypt_dispozitiv WHERE id_dispozitiv = ? ').get(identify).key, db.prepare('SELECT  iv FROM encrypt_dispozitiv WHERE id_dispozitiv = ? ').get(identify).iv);
   }
   return undefined;
}

function get_DUP_AZI_media(message,identify,unic_id){
   let continut = criptare.verifyinfo_level_0(message, identify);
   console.log("dd"+continut + " user" + unic_id)
   if(db.prepare(`select* from dispozitiv_ownd_users where id_dispozitiv = ? and Name = (select Name from Acces_login where unic_id = ?)`).get(continut,unic_id) !== undefined){
     const a = new Date().toISOString().split('T')[0];
     console.log(a + " type"+ typeof(toString(a)))
  
     console.log("dadadadad "+a) 
     let a2 = db.prepare(`select AVG(message)  from message_dispozitiv where id_dispozitiv = ? and date_message > ?`).get(continut,a[0])
      console.log("a2" + a2["AVG(message)"])
      const d = a2["AVG(message)"] +""

     return criptare.encrypt( d, db.prepare('SELECT key, iv FROM communication_encrypt WHERE identify = ? ').get(identify).key, db.prepare('SELECT key, iv FROM communication_encrypt WHERE identify = ? ').get(identify).iv);}
   

}
module.exports.get_on_off_pompa_apa = get_on_off_pompa_apa;
module.exports.get_DUP_AZI_media = get_DUP_AZI_media;
module.exports.get_dispozitive_type = get_dispozitive_type;
module.exports.message_dispozitiv = message_dispozitiv;
module.exports.key_iv = key_iv;
