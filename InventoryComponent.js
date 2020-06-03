/* global fetch:false */
import React, { Component, createRef } from 'react';
import { Text, View, StyleSheet, FlatList, Button, TouchableHighlight, TextInput, Alert, Dimensions } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSortAmountDownAlt, faSortAmountUpAlt } from '@fortawesome/free-solid-svg-icons';

import Dialog, { DialogFooter, DialogContent, DialogButton, DialogTitle } from 'react-native-popup-dialog';
import Slider from 'react-native-slider';
import RNPickerSelect from 'react-native-picker-select';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';

import Icon from 'react-native-vector-icons/Ionicons';
import * as Animatable from "react-native-animatable";

const config = require('./config.json');

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

export class InventoryComponent extends Component {
	constructor() {
		super();

		this.camera = null;

		this.state = {
			sort: 0,
			parts: [],
			co_visible: false,
			qr_visible: false,
			qty_visible: false,
			cname: null,
			citemno: null,
			cqty: null,
			wqty: 1,
			camera_on: false
		};
	}

	componentDidMount() {
		fetch(`http://${config.dbServer}:${config.apiPort}/inventoryquantity`)
			.then(response => response.json())
			.then(data => {
				this.setState({parts: data});
			});
	}

	makeSlideOutTranslation(translationType, fromValue) {
		return {
		  from: {
			[translationType]: SCREEN_WIDTH * -0.12
		  },
		  to: {
			[translationType]: fromValue
		  }
		};
	  }

	render() {
		return (
			<View>
				<View>
					<Text style={styles.titleText}>Inventory</Text>
				</View>
				<View style={styles.header}>
					<FontAwesomeIcon size={32} icon={this.state.sort === 0 ? faSortAmountDownAlt : faSortAmountUpAlt} />
					<Text>SORT</Text>
				</View>
				<View style={styles.header}>
					<TouchableHighlight style={{flex: 1}}>
						<Button style={styles.gridViewContainer} underlayColor={colors.tealSecondary} title="New Checkout" onPress={() => {
							this.setState({co_visible: true});
						}} />
					</TouchableHighlight>
				</View>
				<View style={styles.content}>
					<View style={[styles.col]}>
						<Text style={styles.headerText}>Items</Text>
					</View>
					<View style={[styles.col]}>
						<Text style={styles.headerText}>Quantity</Text>
					</View>
				</View>
				<View style={styles.content}>
					<FlatList 
						data={this.state.parts}
						extraData={this.state.parts}
						numColumns={2}
						style={styles.inventoryList}
						columnWrapperStyle={styles.col}
						keyExtractor={item => item.itemno}
						renderItem={({ item }) => (
							<View style={styles.row}>
								<View style={[styles.col]}>
									<Text style={styles.spanText}>{`${item.name} (${item.itemno})`}</Text>
								</View>
								<View style={[styles.col]}>
									<Text style={styles.spanTextSmall}>{item.qty}</Text>
								</View>
							</View>
						)}/>
				</View>
				<Dialog 
					visible={this.state.co_visible}
					onTouchOutside={() => { this.setState({co_visible:false});}}
					dialogTitle={<DialogTitle title="New Part Order Scan" />}
					width={1.0}
					footer={
						<DialogFooter>
							<DialogButton
								text="CANCEL"
								onPress={() => { this.setState({co_visible: false});}}
							/>
							<DialogButton
								text="OK"
								onPress={() => {}}
							/>
						</DialogFooter>
					}>
					<DialogContent>
						<TouchableHighlight>
							<Button underlayColor={colors.tealSecondary} title="QR Checkout" onPress={() => {
								const camera = (
									<QRCodeScanner
										permissionDialogTitle={"Need Camera Permission"}
										permissionDialogMessage={"Please allow us permission to use the camera to continue"}
										onRead={
											data => {
												Alert.alert("Stuff",data);
											}
										}
									/>
								);
								this.props.showCameraFunction(camera);
								// this.setState({qr_visible:true, camera_on: true}, () => {
								// 	function waitForCam(obj) {
								// 		return new Promise(function (resolve,reject) {
								// 			(function _waitForCam() {
								// 				if (obj !== null) {
								// 					console.log('FOUND');
								// 					return resolve();
								// 				}
								// 				setTimeout(_waitForCam,100);
								// 			})();
								// 		});
								// 	}
								// 	waitForCam(this.camera).then((val) => {
								// 		this.camera._setScanning(false);
								// 		console.log('Reset camera');
								// 	});
									
								// });
							}} />
						</TouchableHighlight>
						 <TextInput></TextInput>
						<RNPickerSelect selectedValue={this.state.selected_checkout_item}
							style={{height: 40}}
							onValueChange={(iv) => { this.setState({selected_checkout_item: iv}); }}
							items={this.state.parts && this.state.parts.length > 0 && this.state.parts.map((val) => {
								return {'label':val.name, 'value':val.itemno};
							})}

						/>
					</DialogContent>
				</Dialog>
					
				<Dialog
					visible={this.state.qty_visible}
					onTouchOutside={() => { this.setState({ qty_visible: false });}}
					dialogTitle={<DialogTitle title="Checkout Quantity" />}
					width={0.5}
					footer={
						<DialogFooter>
							<DialogButton
								text="CANCEL"
								onPress={() => { this.setState({ qty_visible: false });}}
							/>
						</DialogFooter>
					}>
					<DialogContent>
						<Slider
							style={{width: '85%', height: 30}}
							value={this.state.wqty}
							onValueChange={value => this.setState({value})}
							minimumValue={1}
							maximumValue={parseInt(this.state.cqty)}
							minimumTrackTintColor={colors.tealSecondary}
							maximumTrackTintColor={colors.gray}
						/>
						
					</DialogContent>
				</Dialog>
			</View>
		);
	}
}

const colors = {
	tealPrimary: '#6BD4CF',
	tealSecondary: '#7BE4DF',
	gray: '#808080',
	darkgray: '#404040'
};

const overlayColor = "rgba(0,0,0,0.5)"; // this gives us a black color with a 50% transparency

const rectDimensions = SCREEN_WIDTH * 0.65; // this is equivalent to 255 from a 393 device width
const rectBorderWidth = SCREEN_WIDTH * 0.005; // this is equivalent to 2 from a 393 device width
const rectBorderColor = "red";

const scanBarWidth = SCREEN_WIDTH * 0.46; // this is equivalent to 180 from a 393 device width
const scanBarHeight = SCREEN_WIDTH * 0.0025; //this is equivalent to 1 from a 393 device width
const scanBarColor = "#22ff00";

const iconScanColor = "blue";

const qr_styles = {
  rectangleContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent"
  },

  rectangle: {
    height: rectDimensions,
    width: rectDimensions,
    borderWidth: rectBorderWidth,
    borderColor: rectBorderColor,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent"
  },

  topOverlay: {
    flex: 1,
    height: SCREEN_WIDTH,
    width: SCREEN_WIDTH,
    backgroundColor: overlayColor,
    justifyContent: "center",
    alignItems: "center"
  },

  bottomOverlay: {
    flex: 1,
    height: SCREEN_WIDTH,
    width: SCREEN_WIDTH,
    backgroundColor: overlayColor,
    paddingBottom: SCREEN_WIDTH * 0.25
  },

  leftAndRightOverlay: {
    height: SCREEN_WIDTH * 0.65,
    width: SCREEN_WIDTH,
    backgroundColor: overlayColor
  },

  scanBar: {
    width: scanBarWidth,
    height: scanBarHeight,
    backgroundColor: scanBarColor
  }
};

const styles = StyleSheet.create({
	gridViewContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		height: 50,
		margin: 5,
		backgroundColor: colors.tealPrimary
	},
	row: {
		flex: 1,
		width: '100%',
		flexBasis: '100%',
		flexDirection: 'row',
		overflow: 'scroll',
		borderWidth: StyleSheet.hairlineWidth,
		borderColor: 'black',
	},
	col: {
		flex: 0.5,
		flexBasis: '50%',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		textAlign: 'center',
		borderWidth: StyleSheet.hairlineWidth,
		borderColor: 'black',
	},
	left: {
		alignSelf: 'flex-start',
		alignItems: 'flex-start',
		justifyContent: 'flex-start'
	},
	right: {
		alignSelf: 'center',
		alignItems: 'center',
		justifyContent: 'center'
	},
	headerText: {
		textDecorationLine: 'underline',
		textAlign: 'center',
		borderBottomWidth: 4,
		borderBottomColor: colors.darkgray,
		fontSize: 24,
		marginBottom: 10,
		marginTop: 10,
	},
	titleText: {
		fontSize: 16,
		fontWeight: 'bold',
		textDecorationLine: 'underline',
		textAlign: 'center'
	},
	spanText: {
		fontSize: 16,
		fontWeight: '300',
		textDecorationLine: 'none',
		textAlign: 'center'
	},
	spanTextSmall: {
		fontSize: 14,
		textDecorationLine: 'none',
		fontWeight: '200'
	},
	header: {
		marginTop: 30,
		marginBottom: 30,
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',        
	},
	content: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		alignSelf: 'stretch'
	},
	button: {
		padding: 16,
		backgroundColor: colors.tealPrimary,
		flex: 1,
		marginBottom: 40
	}
    

});


export default InventoryComponent;