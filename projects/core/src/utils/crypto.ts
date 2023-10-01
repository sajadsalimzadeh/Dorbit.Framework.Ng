import {JSEncrypt} from "jsencrypt";

export class AsymmetricEncryption {
  private encryptor = new JSEncrypt();

  setKey(key: string) {
    this.encryptor.setKey(key);
  }

  encrypt(data: string) {
    return this.encryptor.encrypt(data);
  }

  async decrypt(data: string) {
    return this.encryptor.decrypt(data);
  }
}
