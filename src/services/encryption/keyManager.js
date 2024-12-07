export const generateKeyPair = async () => {
    const keyPair = await window.crypto.subtle.generateKey(
        {
            name: 'ECDH',
            namedCurve: 'P-256'
        },
        true,
        ['deriveKey', 'deriveBits']
    )

    const privateKeyBuffer = await window.crypto.subtle.exportKey('pkcs8', keyPair.privateKey)
    const privateKeyBase64 = btoa(String.fromCharCode(...new Uint8Array(privateKeyBuffer)))

    const publicKeyBuffer = await window.crypto.subtle.exportKey('spki', keyPair.publicKey)
    const publicKeyBase64 = btoa(String.fromCharCode(...new Uint8Array(publicKeyBuffer)))

    return {
        privateKey: privateKeyBase64,
        publicKey: publicKeyBase64
    }
}

export const exportPublicKey = async (publicKey) => {
    return window.crypto.subtle.exportKey('spki', publicKey)
}

const base64ToArrayBuffer = (base64) => {
    const binaryString = atob(base64);  // Decode Base64
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);  // Convert to bytes
    }
    return bytes.buffer;  // Return as ArrayBuffer
  };
  
  // Function to import the private key from a Base64 string
  export const importPrivateKey = async (privateKeyBase64) => {
    const keyBuffer = base64ToArrayBuffer(privateKeyBase64);  // Convert to ArrayBuffer
    return await window.crypto.subtle.importKey(
      "pkcs8",               // Format for private key
      keyBuffer,
      { name: "ECDH", namedCurve: "P-256" },  // Algorithm parameters
      true,                  // Key is extractable
      ["deriveKey", "deriveBits"]  // Key usages
    );
  };
  
  // Function to import the public key from a Base64 string
  export const importPublicKey = async (publicKeyBase64) => {
    const keyBuffer = base64ToArrayBuffer(publicKeyBase64);  // Convert to ArrayBuffer
    return await window.crypto.subtle.importKey(
      "spki",                // Format for public key
      keyBuffer,
      { name: "ECDH", namedCurve: "P-256" },  // Algorithm parameters
      true,                  // Key is extractable
      []                     // No usages needed for ECDH public keys
    );
  };

export const deriveSharedSecret = async (privateKey, otherPublicKey) => {
    return window.crypto.subtle.deriveBits(
        {
            name: 'ECDH',
            public: otherPublicKey
        },
        privateKey,
        256 // 256-bit shared secret
    )
}

export const deriveSymmetricKeyWithHKDF = async (sharedSecret, salt = "whisperSsaLltyyy_UwU", info = "ECDHKey") => {
    // Import the shared secret as a raw key
    const baseKey = await window.crypto.subtle.importKey(
      "raw",
      sharedSecret,
      { name: "HKDF" },
      false,
      ["deriveKey"]
    );
  
    // Derive the AES-GCM key using HKDF
    return await window.crypto.subtle.deriveKey(
      {
        name: "HKDF",
        hash: "SHA-256",       // Hash function
        salt: new TextEncoder().encode(salt),  // Salt should be random or derived
        info: new TextEncoder().encode(info),  // Context-specific info (optional)
      },
      baseKey,
      { name: "AES-GCM", length: 256 },       // Output key: AES-GCM with 256 bits
      true,
      ["encrypt", "decrypt"]                  // Key usages
    );
};


export const encryptMessage = async (message, symmetricKey) => {
    // Convert message to ArrayBuffer
    const encoder = new TextEncoder();
    const messageBuffer = encoder.encode(message);
  
    // Generate a random IV (12 bytes for AES-GCM)
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
  
    // Encrypt the message
    const encryptedBuffer = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv: iv },
      symmetricKey,
      messageBuffer
    );
  
    // Combine IV and ciphertext into one array
    const combined = new Uint8Array(iv.length + encryptedBuffer.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encryptedBuffer), iv.length);
  
    // Convert combined array to Base64 for easy transmission/storage
    return btoa(String.fromCharCode(...combined));
  }

  export const decryptMessage = async (encryptedBase64, symmetricKey) => {
    // Decode the Base64 string to get the combined IV and ciphertext
  const combined = Uint8Array.from(atob(encryptedBase64), c => c.charCodeAt(0));

  // Extract the IV and ciphertext
  const iv = combined.slice(0, 12);  // First 12 bytes are the IV
  const ciphertext = combined.slice(12);

  // Decrypt the message
  const decryptedBuffer = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv: iv },
    symmetricKey,
    ciphertext
  );

    // Convert decrypted ArrayBuffer to a string
    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
  }
  