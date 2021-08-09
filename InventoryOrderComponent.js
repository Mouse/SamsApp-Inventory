/* eslint-disable react/prop-types */
/* global fetch:false */

import React, { Component } from 'react';
import { Button, Alert, TouchableHighlight, Modal } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import QtySlider from './QtySlider';
import { Picker } from '@react-native-community/picker';
//import RNPickerSelect from 'react-native-picker-select';
import fetch from 'node-fetch';
import config from './DatabaseServer/config.json';

export default class InventoryOrderComponent extends Component {
	constructor(props) {
		super(props);

		this.state = {
			selected_checkout_item: '',
			parts: [],
			qtySliderVisible: false
		};

		this.showCartIcon = props.showCartIconFunction;
		this.setCartItems = props.setCartItemsFunction;
		this.setCartQty = props.setCartQtyFunction;
		this.showQtySliderFunction = props.showQtySliderFunction;
	}

	componentDidMount() {
		fetch(`http://${config.dbApi}:${config.apiPort}/inventoryquantity`)
			.then((response) => response.json())
			.then((data) => {
				this.setState({ parts: data });
			});
	}

	componentDidUpdate(prevProps, prevState) {
		// fetch(`http://${config.dbApi}:${config.apiPort}/inventoryquantity`)
		// 	.then((response) => response.json())
		// 	.then((data) => {
		// 		this.setState({ parts: data });
		// 	});
	}
	

	render() {
		const parts_data =
			this.state.parts &&
			this.state.parts.length > 0 &&
			this.state.parts
				.filter((val) => val.qty > 0)
				.map((val) => {
					return { label: val.name, value: val.itemno, key: val.itemno };
				});
		console.log(parts_data);
		return (
			<>
				<TouchableHighlight>
					<Button
						underlayColor={colors.tealSecondary}
						title="QR Checkout"
						onPress={() => {
							const inst = this;
							const camera = (
								<QRCodeScanner
									permissionDialogTitle={'Need Camera Permission'}
									permissionDialogMessage={
										'Please allow us permission to use the camera to continue'
									}
									showMarker={true}
									onRead={(ev) => {
										if (
											inst.state.parts
												.map((val) => val.itemno)
												.includes(ev.data)
										) {
											const item = inst.state.parts.find(
												(val) => val.itemno === ev.data
											);

											if (parseInt(item.qty) === 0) {
												Alert.alert('Error!', 'Selected Item is Out of Stock');
											} else {
												inst.props.hideCameraFunction();
												inst.showQtySliderFunction(item);
											}
										}
										else
										{
											Alert.alert('Error!', 'This QR code does not match an item in the database.');
										}
									}}
								/>
							);
							
							setTimeout(() => {
								inst.props.showCameraFunction(camera);
								// try {
								// 	DialogManager.dismissAll();
								// } catch (err) {
								// 	console.log(err);
								// }
								//history.push('/');
							}, 500);
						}}
					/>
				</TouchableHighlight>
				<Picker
					selectedValue={this.state.selected_checkout_item}
					style={{ height: 30, width: '100%' }}
					onValueChange={(itemValue, itemIndex) =>
						this.setState({ selected_checkout_item: itemValue })
					}
				>
					{this.state.parts
						.filter((val) => val.qty > 0)
						.map((val) => {
							return (
								<Picker.Item
									key={val.itemno}
									label={`${val.itemno} - ${val.name.substr(0,40)}...`}
									value={val.itemno}
								/>
							);
						})}
				</Picker>
				{/* <RNPickerSelect
					selectedValue={this.state.selected_checkout_item}
					style={{ height: 40 }}
					onValueChange={(iv) => {
						this.setState({ selected_checkout_item: iv });
					}}
					items={ parts_data }
				/> */}
				{this.state.parts
					.map((v) => v.itemno)
					.includes(this.state.selected_checkout_item) && (
					<QtySlider
						showCartIconFunction={this.showCartIcon}
						setCartItemsFunction={this.setCartItems}
						setCartQtyFunction={this.setCartQty}
						type="INVENTORY"
						member={this.props.member}
						item={this.state.parts.find(
							(v) => v.itemno === this.state.selected_checkout_item
						)}
					/>
				)}
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
