const FunixQueue = require("../src/queue.js");
const { expect } = require("chai");

let queue;

beforeEach(() => {
  queue = new FunixQueue();
});

describe("Creating the queue", () => {
  it("1. should be an instance of FunixQueue after creation", () => {
    expect(queue).to.be.an.instanceOf(FunixQueue);
  });
});

describe("Queue Size", () => {
  it("2. should have a `size` function to return the number of elements on the queue", () => {
    expect(typeof queue.size).to.equal("function");
  });

  it("3. should return the queue length when calling `size`", () => {
    expect(queue.size()).to.equal(0);
  });
});

describe("Adding elements", () => {
  it("4. should have an `add` function to enqueue an element", () => {
    // TODO: add test code here, 1 line of code expected
    expect(typeof queue.add).to.equal("function");
    // END TODO
  });

  it("5. should return the queue length when calling `add` with an element", () => {
    const result = queue.add("X");

    // TODO: add test code here, 1 line of code expected
    expect(result).to.equal(1);
    // END TODO
  });

  it("6. should return the queue length when calling `size()` with an element", () => {
    queue.add("X");

    // TODO: add test code here, 1 line of code expected
    expect(queue.size()).to.equal(1);
    // END TODO
  });
});

describe("Peeking elements", () => {
  it("7. should have a `peek` function to inspect the item at the front of the queue", () => {
    // TODO: add test code here, 1 line of code expected
    expect(typeof queue.peek).to.equal("function");
    // END TODO
  });

  it("8. should return the item at the front of the queue when calling `peek`", () => {
    queue.add("X");
    queue.add("E");

    // TODO: add test code here, 1 line of code expected
    expect(queue.peek()).to.equal("X");
    // END TODO
  });

  it("9. should not change the queue when calling `peek`", () => {
    queue.add("A");
    queue.add("B");
    queue.peek();

    // TODO: add test code here, 1 line of code expected
    expect(queue.size()).to.equal(2);
    // END TODO
  });

  it("10. should return undefined when calling `peek` in case the queue is empty", () => {
    expect(queue.size()).to.equal(0);

    // TODO: add test code here, 1 line of code expected
    expect(queue.peek()).to.equal(undefined);
    // END TODO
  });
});

describe("Dequeue elements", () => {
  it("11. should have a `dequeue` function to get the item at the front of the queue", () => {
    // TODO: add test code here, 1 line of code expected
    expect(typeof queue.dequeue).to.equal("function");
    // END TODO
  });

  it("12. should return the item at the front of the queue when calling `dequeue`", () => {
    queue.add("F");
    queue.add("P");
    queue.add("T");

    // TODO: add test code here, 1 line of code expected
    expect(queue.dequeue()).to.equal(queue.peek());
    expect(queue.peek()).to.equal("P")
    // END TODO
  });

  it("13. should remove the element returned when calling `dequeue`", () => {
    queue.add("F");
    queue.add("U");
    queue.add("T")
    queue.dequeue();

    // TODO: add test code here, 1 line of code expected
    // HINT: check si(ze()
    expect(queue.size()).to.equal(2);
    // END TODO
  });

  it("14. should throw error with there are no elements on the queue", () => {
    queue.add("X");
    queue.add("E");
    queue.dequeue();
    queue.dequeue();

    // TODO: add test code here, 1 line of code expected
    // HINT: call dequeue() again and check if it throws an error
    expect(()=>{queue.dequeue()}).to.throw();
    // END TODO
  });

  
});
