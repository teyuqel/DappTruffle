class FunixQueue {
  elements = [];
  constructor(){
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
  dequeue(){
    if (this.size() == 0) {
      throw "there are no elements on the queue";
    }
    this.elements.shift();
    return this.elements[this.head];
  }
}

module.exports = FunixQueue;
