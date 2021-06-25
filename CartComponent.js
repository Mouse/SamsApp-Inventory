import React, { Component } from 'react';
import { Text, View, Button, ScrollView, TouchableHighlight, Alert, TextInput } from 'react-native';
import Cart from './Cart';
import * as RootNavigation from './ThatsTheWayINavigate'
const config = require('./DatabaseServer/config.json');

export default class CartComponent extends Component {
	constructor(props) {
		super(props);

		this.state = {
			items: [],
			notes: ''
		}

		this.onCartQtyChangedToNum.bind(this);
	}

	componentDidMount() {
		this.setState({ items: Cart.getCartItems() })
	}

	componentWillUnmount() {
		Cart.setCartItems(this.state.items)
	}

	completeOrder() {
		const aitems = [...this.state.items];
		for (let i of aitems)
			i.notes = this.state.notes;

		data = JSON.stringify({items: aitems})

		fetch(`http://${config.dbApi}:${config.apiPort}/order`,
		{ 
			method: 'POST',
			body: data,
			headers: {
				'Content-Type': 'application/json',
				'Content-Length': data.length.toString()
			},
			cache: 'default',
			redirect: 'follow'
		})
			.then((response) => response.text())
			.then((data) => {
				Alert.alert(`${data} item orders successful`);
				this.clearCart();
			});
	}

	onCartQtyChangedToNum(v,t) {
		if (t.length === 0)
			t = '0';
		if (isNaN(t.slice(-1)))
			t = t.substr(0,t.length-1);
		
		if (parseInt(t) + v.cart_qty > v.qty) {
			t = v.qty.toString();
			Alert.alert(`Only ${v.qty} units in stock for ${v.itemno}`);
		}

		const items = [...this.state.items];
		const item = items.find(f => v.itemno === f.itemno );
		const diff = parseInt(t) - item.cart_qty;
		item.cart_qty = parseInt(t) != NaN ? parseInt(t) : 0;

		this.setState({ items: items }, () => {
			this.props.setCartTotalItemsQty(this.props.getCartTotalItemsQty()+diff);
		});
	}

	clearCart() {
		this.setState({ items: [] });
		Cart.emptyCart();
		this.props.setCartDistinctItemsQty(0);
		this.props.setCartTotalItemsQty(0);
		this.props.hideCart();
		RootNavigation.goBack();
	}

	render() {
		return (
			<>
				<ScrollView>
					{this.state.items.map((v) => {
						return (
							<>
								<View
									style={{ flex: 1, alignSelf: 'stretch', flexDirection: 'row', borderBottomColor: '#000', borderBottomWidth: 4 }}
								>
									<View style={{ justifyContent: 'center', height: 40, flex: 1, alignSelf: 'stretch' }}>
										<Text style={{verticalAlign: 'center'}}>{v.itemno}</Text>
									</View>
									<View style={{ justifyContent: 'center', height: 40, flex: 2, alignSelf: 'stretch' }}>
										<Text style={{verticalAlign: 'center'}}>{v.name.length > 25 ? `${v.name.substr(0,25)}...` : v.name}</Text>
									</View>
									<View style={{ height: 40, flex: 0.6, alignSelf: 'stretch'}}>
										<TextInput keyboardType='numeric' selectTextOnFocus onChangeText={(t) => this.onCartQtyChangedToNum(v,t)} style={{width: '75%'}} value={v.cart_qty.toString()} />
									</View>									
									<View style={{ justifyContent: 'center', height: 40, flex: 0.4, alignSelf: 'stretch'}}>
										<Text style={{fontWeight: "700"}}>X</Text>
									</View>

								</View>
							</>
						);
					})}
				</ScrollView>
				<View>
					<Text>Notes</Text>
					<TextInput
						value={this.state.notes}
						onChangeText={(val) => this.setState({ notes: val })}
						multiline={true}
						numberOfLines={5}
						scrollEnabled={true}
						style={{
							borderWidth: 1,
							borderColor: 'black',
						}}
					/>
					<TouchableHighlight
						underlayColor={colors.tealSecondary}
						style={{backgroundColor: colors.tealPrimary}}
					>
						<Button
							underlayColor={colors.tealSecondary}
							style={{backgroundColor: colors.tealPrimary}}
							title="Submit Order"
							onPress={this.completeOrder.bind(this)}
						/>
					</TouchableHighlight>

					<TouchableHighlight
						underlayColor={colors.tealSecondary}
						style={{backgroundColor: colors.tealPrimary}}
					>
						<Button
							underlayColor={colors.tealSecondary}
							style={{backgroundColor: colors.tealPrimary}}
							title="CLEAR CART"
							onPress={this.clearCart.bind(this)}
						/>
					</TouchableHighlight>
				</View>
			</>
		);
	}
}


const colors = {
	tealPrimary: '#6BD4CF',
	tealSecondary: '#7BE4DF',
	gray: '#808080',
	darkgray: '#404040',
};
