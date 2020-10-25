export class Tokenizer {
  constructor(rules = []) {
    this.rules = rules;
  }
  addRule(test, fn) {
    this.rules.push({test, fn});
    return this;
  }
  tokenize(string, receiver = (token) => token) {
    function* generator(rules) {
      let index = 0;
      for (const rule of rules) {
        const result = rule.test(string);
        if (result) {
          const {value, length} = result;
          index += length;
          string = string.slice(length);
          const token = {...rule.fn(value), index};
          yield receiver(token);
          yield* generator(rules);
        }
      }
    }
    const tokenGenerator = generator(this.rules);
    const tokens = [];
    for (const token of tokenGenerator) {
      tokens.push(token);
    }
    if (string.length) {
      throw new Error(`parser error: string not fully parsed! ${string.slice(0, 25)}`);
    }
    return tokens;
  }
}
