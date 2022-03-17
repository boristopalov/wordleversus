// make this queue user-specific if users have more to keep track of later on
// interface User {
//   id: string;
// }

export default class Queue {
  elements: Map<number, string>; //ES6 map
  head: number;
  tail: number;

  constructor() {
    this.elements = new Map<number, string>();
    this.head = 0;
    this.tail = 0;
  }
  enqueue(element: string) {
    this.elements.set(this.tail, element);
    this.tail++;
  }
  dequeue() {
    const item = this.elements.get(this.head);
    this.elements.delete(this.head);
    this.head++;
    return item;
  }
  peek() {
    return this.elements.get(this.head);
  }
  get length() {
    return this.tail - this.head;
  }
  get isEmpty() {
    return this.length === 0;
  }
}
