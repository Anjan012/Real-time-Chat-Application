class ChaCipher {
  constructor(secretKey) {
    this.secretKey = secretKey || "DefaultChatKey123";
    this.keyHash = this.generateKeyHash(this.secretKey);
  }

  generateKeyHash(key) {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = (hash << 5) - hash + key.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }

  encrypt(message) {
    if (!message || typeof message !== "string") return message;

    //Unicode → Base64 (emoji safe)
    const base64Message = Buffer.from(message, "utf8").toString("base64");

    let encrypted = "";
    const keyLen = this.secretKey.length;

    for (let i = 0; i < base64Message.length; i++) {
      const charCode = base64Message.charCodeAt(i);
      const keyChar = this.secretKey[i % keyLen];
      const shift = (keyChar.charCodeAt(0) + i + this.keyHash) % 256;
      encrypted += String.fromCharCode((charCode + shift) % 256);
    }

    return encrypted;
  }

  decrypt(encryptedMessage) {
    if (!encryptedMessage || typeof encryptedMessage !== "string") {
      return encryptedMessage;
    }

    try {
      let decryptedBase64 = "";
      const keyLen = this.secretKey.length;

      for (let i = 0; i < encryptedMessage.length; i++) {
        const charCode = encryptedMessage.charCodeAt(i);
        const keyChar = this.secretKey[i % keyLen];
        const shift = (keyChar.charCodeAt(0) + i + this.keyHash) % 256;
        let decoded = (charCode - shift) % 256;
        if (decoded < 0) decoded += 256;
        decryptedBase64 += String.fromCharCode(decoded);
      }

      //Base64 → Unicode (emoji restored)
      return Buffer.from(decryptedBase64, "base64").toString("utf8");
    } catch {
      return encryptedMessage;
    }
  }
}

export default ChaCipher;
