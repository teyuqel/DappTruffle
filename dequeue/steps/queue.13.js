class FunixQueue {
  elements = [];
  constructor() {
    this.element = {};
    this.tail = 0;
    this.head = 0;
  }
  size() {
    return this.elements.length;
  }
  add(element) {
    this.elements[this.tail] = element;
    this.tail++;
    return this.elements.length;
  }
  peek() {
    return this.elements[this.head];
  }
  dequeue() {
    this.elements.shift();
    return this.elements[this.head];
  }
}

module.exports = FunixQueue;
