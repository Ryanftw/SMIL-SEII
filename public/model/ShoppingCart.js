import { Product } from "./product.js";

export class ShoppingCart {
  constructor(uid) {
    this.uid = uid;
    this.items = []; // array of serialized Product object
  }

  addItem(product) {
    const item = this.items.find((e) => product.docId == e.docId);
    if (!item) {
      // new item
      product.qty = 1;
      const newItem = product.serialize();
      newItem.docId = product.docId;
      this.items.push(newItem);
    } else {
      // item exists
      ++product.qty;
      ++item.qty;
    }
    this.saveToLocalStorage();
  }

  removeItem(product) {
    // decrement qty, or remove qty if it becomes 0
    const index = this.items.findIndex((e) => product.docId == e.docId);
    if (index < 0) return;

    --this.items[index].qty;
    --product.qty;
    if (product.qty == 0) {
      this.items.splice(index, 1);
    }

    this.saveToLocalStorage();
  }

  saveToLocalStorage() {
    window.localStorage.setItem(`cart-${this.uid}`, this.stringify());
  }

  stringify() {
    return JSON.stringify({
      uid: this.uid,
      items: this.items,
    });
  }

  static parse(cartString) {
    if (!cartString) return null;
    const obj = JSON.parse(cartString);
    const sc = new ShoppingCart(obj.uid);
    sc.items = obj.items;
    return sc;
  }

  isValid() {
    if (!this.uid) return false;
    if (!this.items || !Array.isArray(this.items)) return false;
    for (let i = 0; i < this.items.length; i++) {
      if (!Product.isSerializedProduct(this.items[i])) return false;
    }
    return true;
  }

  getTotalQty() {
    let n = 0;
    this.items.forEach((e) => {
      n += e.qty;
    });
    return n;
  }

  getTotalPrice() {
    let total = 0;
    this.items.forEach((item) => {
      total += item.price * item.qty;
    });
    return total;
  }

  empty() {
    this.items.length = 0;
  }
}
