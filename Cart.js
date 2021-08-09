import { Alert } from 'react-native';

export default class Cart {
	static _inst = [];
	
	static getCartItems() {
		return this._inst;
	}

	static setCartItems(arr) {
		this._inst = arr;
	}

	static emptyCart() {
		this._inst = [];
	}

	static getCartItemQty(item) {
		if (typeof item !== 'object' || typeof item.itemno === 'undefined') {
			console.log('This is not an item object');
			return 0;
		}
		const ino = item.itemno;
		const add = this._inst.find(i => i.itemno === item.itemno);
		if (add === undefined) {
			return 0;
		} else {
			return add.cart_qty;
		}
	}

	static addToCart(item,aqty) {
		if (typeof item !== 'object' || typeof item.itemno === 'undefined') {
			console.log('This is not an item object');
			return false;
		}

		const ino = item.itemno;
		const add = this._inst.find(i => i.itemno === item.itemno);
		if (add === undefined) {
			const nitem = {...item};
			nitem.cart_qty = aqty;
			this._inst.push(nitem);
			Alert.alert('Cart message',`Added ${nitem.name} [${nitem.cart_qty}] to cart`);
		} else if (add.cart_qty + aqty <= item.qty) {			
			add.cart_qty += aqty;
			Alert.alert('Cart message',`Set ${add.name} in cart to quantity: [${add.cart_qty}]`);
		} else {
			console.log('Cannot add that many items. No stock');
			return false;
		}
	}
    
	static changeQty(item,aqty) {
		const ino = item.itemno;
		const add = this._inst.find(i => i.itemno === item.itemno);
		if (add === undefined) {
			console.log('Hard to change something that isn\'t there');
			return false;
		} else if (aqty !== 0) {
			add.cart_qty = aqty;
			Alert.alert('Cart message',`Set ${add.name} in cart to quantity: [${add.cart_qty}]`);
		} else {
			this._inst = this._inst.filter((v) => v.itemno !== add.itemno);
		}
	}

	static removeFromCart(item) { //or id
		this._inst = this._inst.filter(a => a.itemno !== (typeof item === 'string' ? item : item.itemno));
	}
}