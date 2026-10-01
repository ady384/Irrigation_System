
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <bearssl/bearssl.h>
#include <Base64.h>
const int PIN_POWER = D0;   
const int PIN_AO    = A0;

const int VAL_USCAT  = 850;   
const int VAL_UD     = 350;  

const char* ssid = "HUAWEI-R9Ct";
const char* parola = "r7x3SrWY";

uint8_t cipher_key[32] = {
  0x02, 0x24, 0x67, 0xC5, 0xFD, 0x00, 0x9B, 0xB6,
  0xB1, 0x3F, 0x9A, 0x6B, 0x24, 0x07, 0x2B, 0x04,
  0xC8, 0xB8, 0xE0, 0x6D, 0x15, 0x2A, 0x53, 0xC9,
  0x5D, 0xC9, 0x02, 0xE9, 0x4D, 0x70, 0x47, 0xFC
};

uint8_t cipher_iv[16] = {
  0xC6, 0xEA, 0x10, 0xC2, 0x7E, 0xD4, 0xAE, 0x86,
  0x17, 0x45, 0x9B, 0x18, 0x09, 0x73, 0x66, 0x3C
};

void setup() {

  pinMode(PIN_POWER, OUTPUT);
  digitalWrite(PIN_POWER, LOW);
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

void loop() {
  digitalWrite(PIN_POWER, HIGH);
  delay(100);                    

  long suma = 0;
  for (int i = 0; i < 10; i++) {
    suma += analogRead(PIN_AO);
    delay(10);
  }
  int val = suma / 10;

  digitalWrite(PIN_POWER, LOW);

  int procent = map(val, VAL_USCAT, VAL_UD, 0, 100);
  procent = constrain(procent, 0, 100);

   if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client;
    HTTPClient http;

    http.begin(client, "http://192.168.100.102:3005/dispozitiv/message/send");
    unsigned long ms = millis(); 
    String textencrypt = encrypt("key_dispozitiv1:"+String(procent)+":"+String(ms));
    Serial.println("Plain len: " + String(textencrypt.length()));
    Serial.println("key_dispozitiv1:"+String(procent)+""+String(ms));
    Serial.println(textencrypt);
    http.addHeader("Cookie", "session=abc123; indentify=dispozitiv1");
    //String body = "{\"mesaj\":\"salut\"}";
    int codHTTP = http.POST(textencrypt); 
    if (codHTTP > 0) {
      Serial.println(http.getString());
    } else {
      Serial.println("Eroare: " + http.errorToString(codHTTP));
    }

    http.end();
   }
   delay(100000);
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
  uint8_t data[n_blocks * 16];
  memcpy(data, plain_data.c_str(), len);
  for (int i = len; i < n_blocks * 16; i++) data[i] = n_padding;

  uint8_t key[32], iv[16];
  memcpy(key, cipher_key, 32);
  memcpy(iv, cipher_iv, 16);

  br_aes_ct_cbcenc_keys encCtx;
  br_aes_ct_cbcenc_init(&encCtx, key, 32);
  br_aes_ct_cbcenc_run(&encCtx, iv, data, n_blocks * 16);

  return base64Encode(data, n_blocks * 16);
}
