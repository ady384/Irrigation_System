const Database = require('better-sqlite3') 
const db =  Database('mydatabase.db')
const put_info = require('./function/put_info.js')
const express = require('express');
const get_info = require('./function/get_information.js');
const login = require('./function/login.js');
const app = express('private');
const fs = require('fs').promises
app.use(express.urlencoded({ extended: true }));
app.get('/',async (req,res)=>{res.send(await fs.readFile('pagini/login.html', 'utf-8'));})
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.get('/homepage',async (req,res)=>{
let a = login.Access_login_2(req.cookies.user, req.socket.remoteAddress);
if(a){
  res.send(await fs.readFile('pagini/homepage.html', 'utf-8'));
}else{
  res.send(await fs.readFile('pagini/login.html', 'utf-8'));
}
})
app.post('/communication_encrypt',async (req,res)=>{
 try{
  const get = req.headers.cookie.valueOf('indentify');
  console.log(get);
  res.statusCode(200);
  res.send(false);
 } catch (error) {
  res.send(await login.step_0_comunication());
 }
})
app.get('/login',async (req,res)=>{
  res.send(await fs.readFile('pagini/login.html', 'utf-8'));
});
app.post('/homepage',async (req,res)=>{
 // console.log("body "+ req.body);
  let body1 = '';
   await req.on('data', chunk => {
      body1 += chunk.toString(); 
     // console.log("body1 before: " + body1);
    });
  // console.log("body1 after: " + body1);
  //console.log("1()11()1()1()1()1()1()1()1()1()1()1()1()1()1()1()1()1()1()1()1()1()1()1()1");
  // console.log(req.cookies.indentify);
   const on = login.step_1(body1, req.cookies.indentify);
   const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  // console.log("2()2()2()2()2()2()2()2()2()2()2()2()2()2()2()2()2()2()2()2()2()2()2()2()");
  // console.log("ip address: " + ip);
   if (on) {
        try{
          //console.log("(main 1 ! )unic_id: " + req.cookies.user + " indentify: " + req.cookies.indentify);
          if(!req.cookies.user){
            //console.log("(main 1 ! part !req )unic_id: " + req.cookies.user + " indentify: " + req.cookies.indentify);
            let av = put_info.Access_login_0(body1, req.cookies.indentify,ip);
            res.cookie('user', av  , { httpOnly: false , secure: false , maxAge: 15200000 });
            if(login.Access_login_1(body1,av,ip , req.cookies.indentify)){
              res.send("true");
            }
          }else{
          if(login.Access_login_1(body1,req.cookies.user,ip , req.cookies.indentify)){
            res.send("true");
          } else{
            res.status(401).send('Unauthorized');
          }
        }
        }catch(error){
         // console.log("error in main.js: " + error);
         // console.log("(main 2 ! )unic_id: " + req.cookies.user + " indentify: " + req.cookies.indentify);
        res.cookie('user', put_info.Access_login_0(body1, req.cookies.indentify,ip) , { httpOnly: false , secure: false , maxAge: 15200000 });
        res.send("true");
        }
    } else{
        res.status(401).send('Unauthorized');
    }
})
app.post('/verify_unic_id',async (req,res)=>{
   if(login.Access_login_2(req.cookies.user, req.socket.remoteAddress)){
      res.send("true");
    } else{
      res.send("false");
    }
})
app.post('/get/dispozitive/typee', async (req, res) => {
  let body1 = '';
  await req.on('data', chunk => {
    body1 += chunk.toString(); 
  });
  //console.log("body1: " + body1 + " unic_id: " + req.cookies.user + " indentify: " + req.cookies.indentify);
  res.send(get_info.get_dispozitive_type(body1, req.cookies.user, req.cookies.indentify)); 
});
app.post('/get/dispozitive', async (req, res) => { /// no security here . do it later
  res.send(db.prepare(`select id_dispozitiv from dispozitiv_ownd_users where Name = (select Name from Acces_login where unic_id = ?)`).all(req.cookies.user));});
  app.post('/dispozitiv/message/get', async (req, res) => {
  let body1 = '';
  await req.on('data', chunk => {
    body1 += chunk.toString(); 
  });
  return res.send(get_info.message_dispozitiv(body1, req.cookies.user)); /// i will need to modify this in the future because the security is not greate
})

app.post('/user/send/dispozitiv', async (req, res) => {
  let body1 = '';
  await req.on('data', chunk => {
    body1 += chunk.toString(); 
  });
  if(put_info.send_message_dispozitiv_user(req.cookies.user,req.cookies.indentify,body1)){
    res.status(200).send('Message sent successfully');
  } else{
    res.status(400).send('INVALID message or device');
  }
});
app.post('/send/data/activation/dispozitiv',async(req,res)=>{
  let body1 = '';
  await req.on('data', chunk => {
    body1 += chunk.toString(); 
  });
  console.log("body1: " + body1 + " unic_id: " + req.cookies.user + " indentify: " + req.cookies.indentify);
  if(put_info.send_data_activation_dispozitiv(req.cookies.user,req.cookies.indentify,body1)){
    res.status(200).send('Message sent successfully');
  } else{
    res.status(400).send('INVALID message or device');
  }
});

app.post(`/dispozitiv/message/send`,express.text(), async (req, res) => {
  // let body1 = '';
  // await req.on('data', chunk => {
  //   body1 += chunk.toString(); 
  // });
// console.log(body1+ "ddddddddddddddddddddddddd" + req.cookies.indentify+"//")
  if(put_info.message_dispozitiv(req.cookies.indentify,req.body)){
    res.status(200).send('Message sent successfully');
  } else{
    res.status(400).send('INVALID message or device');
  }
});
app.post('/get/info/pompa_apa',express.text(),async(req,res)=>{
  
    console.log(req.body);
  await  console.log("body1: " + req.body + " indentify: " + req.cookies.indentify);
  res.send(get_info.get_on_off_pompa_apa(req.body,req.cookies.indentify));
})
app.post('/get/dispozitiv/DUP/azi',async(req,res)=>{
  let body1 = '';
  await req.on('data', chunk => {
    body1 += chunk.toString(); 
   });
  // console.log("ddaaa" + typeof(get_info.get_DUP_AZI_media(body1,req.cookies.indentify,req.cookies.user)))
  res.send(get_info.get_DUP_AZI_media(body1,req.cookies.indentify,req.cookies.user));
})
const PORT = process.env.PORT || 3005;
app.listen(PORT, '0.0.0.0',() => {
  console.log(`Server is running on port ${PORT}`);
});