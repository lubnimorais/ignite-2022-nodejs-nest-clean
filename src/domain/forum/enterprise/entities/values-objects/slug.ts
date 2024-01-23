class Slug {
  public value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(slug: string) {
    return new Slug(slug);
  }

  /**
   * Receives a string and normalizes it as a slug.
   *
   * Example: "An example title" => "an-example-title"
   *
   * @param text {string}
   */
  static createFromText(text: string) {
    /**
     * UTILIZA UMA CONVENÇÃO DE NORMALIZAÇÃO DO UNICODE
     * PADRONIZA A STRING REMOVENDO OU CONVERTENDO CARACTERES
     * QUE NÃO ESTEJAM DENTRO DE UM ARSENAL DE CARACTERES ACEITO
     * PARA UM CARACTER QUE SEJA ACEITO
     *
     * VAI REMOVER QUALQUER TIPO DE ACENTUAÇÃO DA STRING
     *
     */
    const slugText = text
      .normalize('NFKD')
      .toLowerCase()
      .trim()
      // s -> qualquer espaço em branco
      // g -> global
      .replace(/\s+/g, '-')
      // [] -> para fazer um match em um conjunto de caracteres
      .replace(/[^\w-]+/g, '')
      .replace(/_/g, '-')
      .replace(/--+/g, '-')
      .replace(/-$/g, '');

    return new Slug(slugText);
  }
}

export { Slug };
