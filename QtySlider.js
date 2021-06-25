/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import Slider from 'react-native-slider';
import { Text, View, TextInput } from 'react-native';
import DialogManager, { DialogButton } from 'react-native-dialog-component';
import Cart from './Cart';

export default class QtySlider extends Component {
	constructor(props) {
		super(props);

		this.state = {
			qty: 1,
			member_id: this.props.member,
			type: this.props.type,
		};

		console.log(props);

		this.showCart = props.showCartIconFunction;
		this.setCartItems = props.setCartItemsFunction;
		this.setCartQty = props.setCartQtyFunction;
		this.addToCart.bind(this);
	}

	componentDidMount() {
	}

	addToCart(item) 
	{
		const aitem = {...item};
		aitem.type = this.state.type;
		aitem.member_id = this.state.member_id;
		Cart.addToCart(aitem, this.state.qty);
		this.showCart();
		this.setCartItems(Cart.getCartItems().length);
		this.setCartQty(Cart.getCartItems().reduce((a,c) => a += c.cart_qty, 0));
	}

	render() {
		const item = this.props.item;
		return (
			<View>
				<View>
					<Slider
						style={{
							width: '100%',
							height: 30,
						}}
						value={this.state.qty}
						step={1}
						onValueChange={(value) => {
							this.setState({ qty: value });
						}}
						minimumValue={0}
						maximumValue={Math.max(0,parseInt(item.qty - Cart.getCartItemQty(item)))}
						minimumTrackTintColor={colors.tealSecondary}
						maximumTrackTintColor={colors.gray}
					/>
					<Text ref={(r) => (this.text_ref = r)}>{this.state.qty}</Text>
					<DialogButton
						align="center"
						text="Add to Cart"
						onPress={this.addToCart.bind(this,item)}
					/>
					{/* <DialogButton
						align="center"
						text="OK"
						onPress={() => {
							fetch(
								`http://${config.dbApi}:${config.apiPort}/${this.state.type === 'INVENTORY' ? 'inventoryquantity' : 'noninventoryquantity'}`,
								{
									method: 'POST',
									body: JSON.stringify({
										member_id: this.state.member_id,
										itemno: item.itemno,
										qty: this.state.qty,
										notes: this.state.notes
									}),
									headers: {
										'Content-Type': 'application/json'
									}
								}
							).then((resp) => {
								if (resp.status === 200) {
									DialogManager.dismissAll(() => {
										Alert.alert(
											`Successfully ordered ${this.state.qty} of ${item.itemno}`
										);
									});
								}
							});
						}}
					/> */}
					<DialogButton
						align="center"
						text="CANCEL"
						onPress={() => {
							DialogManager.dismissAll();

							Cart.empty();
							this.setCartItems(0);
							this.setCartQty(0);
						}}
					/>
				</View>
			</View>
		);
	}
}

const colors = {
	tealPrimary: '#6BD4CF',
	tealSecondary: '#7BE4DF',
	gray: '#808080',
	darkgray: '#404040',
};
