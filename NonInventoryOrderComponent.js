/* eslint-disable react/prop-types */
/* global fetch:false */

import React, { Component } from 'react';
import { Button, Alert, TouchableHighlight } from 'react-native';
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
		};

		this.showCartIcon = props.showCartIconFunction;
		this.setCartItems = props.setCartItemsFunction;
		this.setCartQty = props.setCartQtyFunction;
	}

	componentDidMount() {
		fetch(`http://${config.dbApi}:${config.apiPort}/noninventoryquantity`)
			.then((response) => response.json())
			.then((data) => {
				this.setState({ parts: data });
			});
	}

	componentDidUpdate(prevProps, prevState) {
		fetch(`http://${config.dbApi}:${config.apiPort}/noninventoryquantity`)
			.then((response) => response.json())
			.then((data) => {
				this.setState({ parts: data });
			});
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
							const camera = (
								<QRCodeScanner
									permissionDialogTitle={'Need Camera Permission'}
									permissionDialogMessage={
										'Please allow us permission to use the camera to continue'
									}
									onRead={(ev) => {
										if (
											this.state.parts
												.map((val) => val.itemno)
												.includes(ev.data)
										) {
											const item = this.state.parts.find(
												(val) => val.itemno === ev.data
											);

											if (parseInt(item.qty) === 0) {
												Alert.alert('Error!', 'Selected Item is Out of Stock');
											} else {
												this.props.hideCameraFunction();
												DialogManager.show({
													title: 'Quantity of ' + item.itemno,
													titleAlign: 'center',
													animationDuration: 200,
													ScaleAnimation: new ScaleAnimation(),
													children: (
														<DialogContent>
															<QtySlider
																showCartIconFunction={this.showCartIcon}
																setCartItemsFunction={this.setCartItems}
																setCartQtyFunction={this.setCartQty}
																type="NONINVENTORY"
																member={this.props.member}
																item={item}
															/>
														</DialogContent>
													),
												});
											}
										}
									}}
								/>
							);

							setTimeout(() => {
								this.props.showCameraFunction(camera);
								try {
									DialogManager.currentDialog.destroy();
								} catch (err) {
									console.log(err);
								}
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
						type="NONINVENTORY"
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
