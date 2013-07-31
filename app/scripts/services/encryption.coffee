"use strict"

class EncryptionService

  decrypt: (encryptedText, key = ENCRYPTION_KEY) ->
    Cryptographer.decrypt(encryptedText, key)

  encrypt: (plainText, key = ENCRYPTION_KEY) ->
    Cryptographer.encrypt(plainText, key)

angular.module "webApp.encryptionService", [], ($provide) ->
  $provide.factory "encryptionService", -> new EncryptionService()
