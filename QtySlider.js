/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import Slider from 'react-native-slider';
import { Text, View, TouchableHighlight, Button } from 'react-native';
import Cart from './Cart';
import * as RootNavigation from './ThatsTheWayINavigate';

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
		this.setCartItems = props.setCartDistinctItemsQty;
		this.setCartQty = props.setCartTotalItemsQty;
		this.closeModal = props.closeModalFunction
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
		if (this.closeModal)
			this.closeModal();
		if (aitem.type === 'INVENTORY')
			RootNavigation.navigate('Inventory');
		else
			RootNavigation.navigate('Noninventory');
	}

	render() {
		const item = this.props.item;
		return (
			<View style={{ marginTop: 50 }}>
				{this.props.showItemName &&
					<Text>{this.props.item.itemno} - {this.props.item.name}</Text>	
				}
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
				<Text>{this.state.qty}</Text>
				<TouchableHighlight 
					underlayColor={colors.tealPrimary}
					style={{marginTop: 10, marginBottom: 25, width: "75%", alignSelf: 'center'}}
				>
					<Button
						underlayColor={colors.tealSecondary}
						style={{backgroundColor: colors.tealPrimary}}
						title="Add to Cart"
						onPress={this.addToCart.bind(this,item)}
					/>
				</TouchableHighlight>
				<TouchableHighlight underlayColor={colors.tealPrimary} style={{width: "75%", alignSelf: 'center'}}>
					<Button
						underlayColor={colors.tealSecondary}
						style={{backgroundColor: colors.tealPrimary}}
						title="Cancel"
						onPress={() => { RootNavigation.goBack(); }}
					/>
				</TouchableHighlight>
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
