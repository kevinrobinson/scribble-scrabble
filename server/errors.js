export class NotFoundError extends Error {
  constructor(text) {
    super(text);
    this.text = text;
    this.errorType = 'NotFoundError';
  }

  toString() {
    return `${this.errorType}: ${this.text}`;
  }
}