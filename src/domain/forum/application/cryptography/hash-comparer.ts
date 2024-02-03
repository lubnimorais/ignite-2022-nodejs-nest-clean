export abstract class HashComparer {
  // COMPARA
  abstract compare(plain: string, hash: string): Promise<boolean>;
}
