export abstract class Encrypter {
  // PERMITIR QUE ELE RECEBA UM OBJETO
  abstract encrypt(payload: Record<string, unknown>): Promise<string>;
}
