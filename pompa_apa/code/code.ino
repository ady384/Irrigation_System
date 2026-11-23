// void setup() {
//   // put your setup code here, to run once:
//   pinMode(19,OUTPUT);
//   pinMode(17,OUTPUT);
//   pinMode(18,OUTPUT);
//   digitalWrite(18, HIGH); 
// }

// void loop() {
//   // put your main code here, to run repeatedly:
//     digitalWrite(19, HIGH); 
//     digitalWrite(17, LOW); 
//   delay(1000);            
//   digitalWrite(19, LOW); 
//   digitalWrite(17, HIGH); 
//   delay(1000);
// }

#include <WiFi.h>
#include <HTTPClient.h>
#include <WiFiClient.h>
#include <WiFiClientSecure.h>
//#include <Base64.h>
//const int PIN_POWER = D0;   
//const int PIN_AO    = A0;

const int VAL_USCAT  = 850;   
const int VAL_UD     = 350;  
int  ON_OFF = 0 ;
const char* ssid = "HUAWEI-R9Ct"; /// this is a secreat <---
const char* parola = "r7x3SrWY";
int a3 = 0;
#include <mbedtls/aes.h>
uint8_t cipher_key[32] = {
    0x02, 0x24, 0x67, 0xC5, 0xFD, 0x00, 0x9B, 0xB6,
    0xB1, 0x3F, 0x9A, 0x6B, 0x24, 0x07, 0x2B, 0x04,
    0xC8, 0xB8, 0xE0, 0x6D, 0x15, 0x2A, 0x53, 0xC8,
    0x5D, 0xC9, 0x02, 0xE9, 0x4D, 0x70, 0x47, 0xFC
};
uint8_t cipher_iv[16] = {
  0xC7, 0xEA, 0x10, 0xC2, 0x7E, 0xD4, 0xAE, 0x86,
  0x17, 0x45, 0x9B, 0x18, 0x09, 0x73, 0x66, 0x3C
};
void setup() {

  //pinMode(PIN_POWER, OUTPUT);
    pinMode(19,OUTPUT);
  pinMode(17,OUTPUT);
  pinMode(18,OUTPUT);
  digitalWrite(18, HIGH); 
  //digitalWrite(PIN_POWER, LOW);
  Serial.begin(115200);
  WiFi.begin(ssid, parola);

  Serial.print("Ma conectez");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConectat! IP: " + WiFi.localIP().toString());

  
  Serial.println("aaa");
}
void Motor_ON(){
         Serial.println("ON");
            digitalWrite(19, HIGH); 
            digitalWrite(17, LOW); 
            delay(1000);
            digitalWrite(19, LOW); 
            a3 = 1;
            ON_OFF = 2;
}
void Motor_OFF(){
            Serial.println("OF");
            digitalWrite(19, LOW); 
            digitalWrite(17, HIGH); 
            delay(1000);
            digitalWrite(17, LOW);
            a3 =1 ;
            ON_OFF = 1;
}
void loop() {
  //digitalWrite(PIN_POWER, HIGH);
  // delay(100);                    

  // long suma = 0;
  // for (int i = 0; i < 10; i++) {
  //   suma += analogRead(PIN_AO);
  //   delay(10);
  // }
  // int val = suma / 10;

  // digitalWrite(PIN_POWER, LOW);

  // int procent = map(val, VAL_USCAT, VAL_UD, 0, 100);
  // procent = constrain(procent, 0, 100);

   if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client;
    HTTPClient http;

    http.begin(client, "http://192.168.100.102:3005/get/info/pompa_apa");
    unsigned long ms = millis(); 
    String textencrypt = encrypt("key_dispozitiv2:"+String(ms));
    Serial.println("Plain len: " + String(textencrypt.length()));
    Serial.println("key_dispozitiv2:"+String(ms));
    Serial.println(textencrypt);
    http.addHeader("Cookie", "session=abc123; indentify=dispozitiv2");
    http.addHeader("Content-Type", "text/plain");
  //  String body = "{\"data\":\"salut\"}";
    int codHTTP = http.POST(textencrypt); 
    if (codHTTP > 0) {
     //Serial.println("l"+decrypt(http.getString()));
     String a1 = decrypt(http.getString());
     //"79,78"
     String bucata = a1.substring(0, 5); 

      if (bucata == "77,78"){ // pornire Manual :3 
        Motor_ON();
      }else if(bucata == "77,70"){
        Motor_OFF();
      } else if(ON_OFF == 1){
      if (bucata == "79,78"){ // pornire 
       Motor_ON();
      }
            
    http.end();
      } else if(ON_OFF == 2){
       if(bucata == "79,70"){ // oprire apa
        Motor_OFF();

    http.end();
      }
      }
      Serial.println("T1");
      if(a3 == 1){
    while(true){ 
      
      Serial.println("t2");
     http.begin(client, "http://192.168.100.102:3005/dispozitiv/message/send");
    unsigned long ms = millis(); 
    String textencrypt = encrypt("key_dispozitiv2:"+String(ms)); 
    http.addHeader("Cookie", "session=abc123; indentify=dispozitiv2");
    http.addHeader("Content-Type", "text/plain");
  //  String body = "{\"data\":\"salut\"}";
    int codHTTP = http.POST(textencrypt); 
    if (codHTTP > 0) {
      Serial.println("a functionat :3");
      break;
    }
    delay(1000);
    }
    

    http.end();
    a3 = 0;
      }
      //Serial.println(decrypt(http.getString()));
    } else {
      Serial.println("Eroare: " + http.errorToString(codHTTP));
      
    http.end();
    }

   }
   delay(1000);
}


static const char b64_table[] =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

String base64Encode(const uint8_t* data, size_t len) {
  String out;
  out.reserve(((len + 2) / 3) * 4);
  for (size_t i = 0; i < len; i += 3) {
    uint32_t n = data[i] << 16;
    if (i + 1 < len) n |= data[i + 1] << 8;
    if (i + 2 < len) n |= data[i + 2];

    out += b64_table[(n >> 18) & 0x3F];
    out += b64_table[(n >> 12) & 0x3F];
    out += (i + 1 < len) ? b64_table[(n >> 6) & 0x3F] : '=';
    out += (i + 2 < len) ? b64_table[n & 0x3F]        : '=';
  }
  return out;
}

int b64Value(char c) {
  if (c >= 'A' && c <= 'Z') return c - 'A';
  if (c >= 'a' && c <= 'z') return c - 'a' + 26;
  if (c >= '0' && c <= '9') return c - '0' + 52;
  if (c == '+') return 62;
  if (c == '/') return 63;
  return -1;
}

size_t base64Decode(const String& in, uint8_t* out) {
  size_t outLen = 0;
  uint32_t buf = 0;
  int bits = 0;
  for (size_t i = 0; i < in.length(); i++) {
    char c = in[i];
    if (c == '=') break;
    int v = b64Value(c);
    if (v < 0) continue;
    buf = (buf << 6) | v;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      out[outLen++] = (buf >> bits) & 0xFF;
    }
  }
  return outLen;
}
String encrypt(String plain_data) {
  int len = plain_data.length();
  int n_blocks = len / 16 + 1;
  uint8_t n_padding = n_blocks * 16 - len;

  // buffer alocat dinamic pe heap (evită VLA și stack overflow)
  uint8_t *data = (uint8_t*) malloc(n_blocks * 16);
  if (!data) return String("");

  memcpy(data, plain_data.c_str(), len);
  for (int i = len; i < n_blocks * 16; i++) data[i] = n_padding;

  uint8_t key[32], iv[16];
  memcpy(key, cipher_key, 32);
  memcpy(iv,  cipher_iv, 16);   // mbedTLS modifică IV-ul -> folosim copie locală

  mbedtls_aes_context aes;
  mbedtls_aes_init(&aes);
  mbedtls_aes_setkey_enc(&aes, key, 256);   // AES-256
  mbedtls_aes_crypt_cbc(&aes, MBEDTLS_AES_ENCRYPT,
                        n_blocks * 16, iv, data, data);
  mbedtls_aes_free(&aes);

  String out = base64Encode(data, n_blocks * 16);
  free(data);
  return out;
}
String decrypt(String encrypted_b64) {
  // 1. Base64 decode
  //    Estimăm dimensiunea maximă: 3/4 din lungimea base64
  size_t max_len = (encrypted_b64.length() * 3) / 4 + 4;
  uint8_t *cipher = (uint8_t*) malloc(max_len);
  if (!cipher) return String("");

  size_t cipher_len = base64Decode(encrypted_b64, cipher);
  if (cipher_len == 0 || (cipher_len % 16) != 0) {
    // date invalide: lungimea trebuie să fie multiplu de 16
    free(cipher);
    return String("");
  }

  // 2. Pregătim bufferul de ieșire (aceeași dimensiune ca intrarea)
  uint8_t *plain = (uint8_t*) malloc(cipher_len);
  if (!plain) { free(cipher); return String(""); }

  // 3. Setup mbedTLS AES-256-CBC decrypt
  uint8_t key[32], iv[16];
  memcpy(key, cipher_key, 32);
  memcpy(iv,  cipher_iv, 16);   // mbedTLS modifică IV-ul -> copie locală

  mbedtls_aes_context aes;
  mbedtls_aes_init(&aes);
  mbedtls_aes_setkey_dec(&aes, key, 256);   // ← DEC, nu ENC
  mbedtls_aes_crypt_cbc(&aes, MBEDTLS_AES_DECRYPT,
                        cipher_len, iv, cipher, plain);
  mbedtls_aes_free(&aes);

  // 4. Eliminăm padding-ul PKCS#7
  uint8_t pad = plain[cipher_len - 1];
  if (pad == 0 || pad > 16 || pad > cipher_len) {
    // padding invalid -> cheie/IV greșit sau date corupte
    free(cipher); free(plain);
    return String("");
  }
  // verificare opțională: toți ultimii `pad` bytes trebuie să fie egali cu `pad`
  for (size_t i = cipher_len - pad; i < cipher_len; i++) {
    if (plain[i] != pad) {
      free(cipher); free(plain);
      return String("");
    }
  }

  size_t plain_len = cipher_len - pad;

  // 5. Construim String-ul rezultat (atenție: datele pot conține \0)
  String out;
  out.reserve(plain_len);
  for (size_t i = 0; i < plain_len; i++) out += (char) plain[i];

  free(cipher);
  free(plain);
  return out;
}