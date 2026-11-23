const Database = require('better-sqlite3');
const db = new Database('mydatabase.db');
db.pragma('foreign_keys = ON');
db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        Name TEXT NOT NULL UNIQUE,
        Password TEXT NOT NULL,
        gmail TEXT NOT NULL,
        level INTEGER NOT NULL
    )`)
db.exec(`CREATE TABLE IF NOT EXISTS Acces_login(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    unic_id TEXT NOT NULL UNIQUE,    
    Name TEXT NOT NULL,
    ip_address TEXT NOT NULL,
    login_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Name) REFERENCES users(Name)
    )`)   // <- this will be the 2 step outification with gmail for the future :p //
db.exec(`CREATE table if not exists communication_encrypt(
    id integer primary key autoincrement,
    identify TEXT not null unique,
    key TEXT NOT NULL,
    iv TEXT NOT NULL
    )`)    
db.exec(`Create table if not exists dispozitiv(
    id_dispozitiv TEXT primary key,
    key_dispozitiv TEXT not null,
    type_dispozitiv TEXT,
    manual_or_auto TEXT not null default 'manual'
    )`)
db.exec(`Create table if not exists encrypt_dispozitiv(
    id_message integer primary key autoincrement,
    key TEXT not null,
    iv TEXT not null,
    date_message DATETIME default current_timestamp,
    id_dispozitiv TEXT not null,
    FOREIGN KEY (id_dispozitiv) REFERENCES dispozitiv(id_dispozitiv)
    )`)    
db.exec(`Create table if not exists dispozitiv_ownd_users(
    id integer primary key autoincrement,
    id_dispozitiv TEXT not null,
    Name TEXT not null,
    FOREIGN KEY (id_dispozitiv) REFERENCES dispozitiv(id_dispozitiv),
    FOREIGN KEY (Name) REFERENCES users(Name)
    )`)
db.exec(`Create table if not exists window_preferences(
    id integer primary key autoincrement,
    Name TEXT not null,
    id_dispozitiv TEXT not null,
    preferences TEXT not null,
    FOREIGN KEY (id_dispozitiv) REFERENCES dispozitiv(id_dispozitiv),
    FOREIGN KEY (Name) REFERENCES users(Name)
    )`)   
     
db.exec(`Create table if not exists message_dispozitiv(
    id_message integer primary key autoincrement,
    id_dispozitiv TEXT not null,
    message TEXT not null,
    date_message DATETIME default current_timestamp,
    FOREIGN KEY (id_dispozitiv) REFERENCES dispozitiv(id_dispozitiv)
    )`)
db.exec(`Create table activated_dispozitiv(
    id integer primary key autoincrement,
    id_dispozitiv TEXT not null,
    type TEXT not null,
    operetion TEXT not null,
    numver INTEGER not null,
    action TEXT not null,
    FOREIGN KEY (id_dispozitiv) REFERENCES dispozitiv(id_dispozitiv)
    )`)        
db.exec(`Insert into dispozitiv (id_dispozitiv, key_dispozitiv, type_dispozitiv) VALUES ('dispozitiv1', 'key_dispozitiv1', 'DUP')`);
db.exec(`Insert into encrypt_dispozitiv (key, iv, id_dispozitiv) VALUES ('022467c5fd009bb6b13f9a6b24072b04c8b8e06d152a53c95dc902e94d7047fc', 'c6ea10c27ed4ae8617459b180973663c', 'dispozitiv1')`);
db.exec(`Insert into message_dispozitiv (id_dispozitiv, message) VALUES ('dispozitiv1', '20')`);
db.exec(`Insert into dispozitiv (id_dispozitiv, key_dispozitiv, type_dispozitiv) VALUES ('dispozitiv2', 'key_dispozitiv2', 'Pompa_apa')`);
db.exec(`Insert into encrypt_dispozitiv (key, iv, id_dispozitiv) VALUES ('022467c5fd009bb6b13f9a6b24072b04c8b8e06d152a53c85dc902e94d7047fc', 'c7ea10c27ed4ae8617459b180973663c', 'dispozitiv2')`);
db.exec(`INSERT into users (Name, Password, gmail, level) VALUES ('ady','1234', 'adrianagopian987@gmail.com', 0)`);

    
db.exec(`Insert into dispozitiv_ownd_users (id_dispozitiv, Name) VALUES ('dispozitiv1', 'ady')`);    
db.exec(`Insert into dispozitiv_ownd_users (id_dispozitiv, Name) VALUES ('dispozitiv2', 'ady')`);    

db.exec(`Insert into message_dispozitiv (id_dispozitiv, message) VALUES ('dispozitiv2', 'ON:414134')`);
