export abstract class HashGenerator {
  // CONVERTER A SENHA DE UM PLAIN TEXT PARA HASH
  abstract hash(plain: string): Promise<string>;
}
