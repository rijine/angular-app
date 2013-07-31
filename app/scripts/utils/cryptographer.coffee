"use strict"

class Cryptographer

  @decrypt: (encryptedText, key = ENCRYPTION_KEY) ->
    #console.log encryptedText
    C = CryptoJS
    encryptedText = C.enc.Base64.parse(encryptedText)
    key = C.enc.Utf8.parse(key)
    aes = C.algo.AES.createDecryptor(key,
      mode: C.mode.CBC
      padding: C.pad.Pkcs7
      iv: key
    )
    decrypted = aes.finalize(encryptedText)
    x = C.enc.Utf8.stringify decrypted
    #console.log "Key is " + key
    #console.log "Decrypted is " + x
    x

  @encrypt: (plainText, key = ENCRYPTION_KEY) ->
    C = CryptoJS
    plainText = C.enc.Utf8.parse(plainText)
    key = C.enc.Utf8.parse(key)
    aes = C.algo.AES.createEncryptor(key,
      mode: C.mode.CBC
      padding: C.pad.Pkcs7
      iv: key
    )
    encrypted = aes.finalize(plainText)
    x = C.enc.Base64.stringify(encrypted)
    #console.log "Encrypted is " + x
    x

window.Cryptographer = Cryptographer
