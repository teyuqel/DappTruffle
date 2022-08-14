class FunixQueue {
  elements = [];
  constructor() {
    this.element = {};
    this.tail = 0;
  }
  size() {
    return this.elements.length;
  }
  add(element) {
    this.elements[this.tail] = element;
    return this.elements.length;
  }
}

module.exports = FunixQueue;
