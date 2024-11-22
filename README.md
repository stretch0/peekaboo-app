# Peekaboo 🌟

**Peekaboo** is a secure, simple, and reliable way to share your secret keys or environment variables with your team. With a unique link that automatically expires after being viewed, Peekaboo ensures your secrets remain safe and accessible only to the intended recipient.

## How It Works 🚀

Peekaboo uses **RSA-OAEP encryption** to protect your secrets. Here's how the process works:

1. **Encrypting Your Secret**:
   - When you share a secret, Peekaboo generates a unique RSA key pair.
   - Your secret is encrypted using the public key.
   - A unique link containing the private key is created for you to share.

2. **Viewing the Secret**:
   - The recipient enters the shared link.
   - The private key in the link is used (client-side) to decrypt the secret directly in their browser.
   - Once the secret is viewed, the link expires, and the encrypted secret is deleted from the server.

3. **Security By Design**:
   - Peekaboo **never stores or receives your private keys**.
   - Your secrets are stored encrypted on the server.
   - Decryption happens entirely in the browser, keeping your secrets secure.

## Why Peekaboo? 🤔

- **Secure**: RSA-OAEP encryption ensures robust protection of your data.
- **Ephemeral**: Shared secrets are deleted immediately after being viewed.
- **Confidential**: Peekaboo has no access to your keys or decrypted secrets.
- **Easy to Use**: A simple interface for sharing secrets confidently.

## Usage ✨

### Sharing a Secret
1. Visit [Peekaboo.sh](https://peekaboo.sh).
2. Enter your secret and click **Share**.
3. Copy the unique link and share it with the intended recipient.

### Viewing a Secret
1. Open the unique link provided to you.
2. The secret will be decrypted in your browser and displayed.
3. The link will automatically expire after viewing.

## License 📜

Peekaboo is open source and available under the [MIT License](LICENSE).

---

**Start sharing your secrets securely today with [Peekaboo.sh](https://peekaboo.sh)!**