/* eslint-disable react/prop-types */
/* global fetch:false */
import React, { Component } from 'react';
import {
	Text,
	View,
	StyleSheet,
	FlatList,
	Button,
	TouchableHighlight,
	Alert,
	Dimensions,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
	faSortAmountDownAlt,
	faSortAmountUpAlt,
} from '@fortawesome/free-solid-svg-icons';
import * as RootNavigation from './ThatsTheWayINavigate';
//import { withRouter, Link } from 'react-router-native';

const config = require('./DatabaseServer/config.json');

const SCREEN_WIDTH = Dimensions.get('window').width;

export class InventoryComponent extends Component {
	constructor() {
		super();

		this.camera = null;
		this.new_part_dialog = null;

		this.state = {
			sort: 0,
			parts: [],
			co_visible: false,
			qr_visible: false,
			qty_visible: false,
			cname: null,
			citemno: null,
			cqty: null,
			camera_on: false,
			selected_checkout_item: ''
		};
	}

	componentDidMount() {
		fetch(`http://${config.dbApi}:${config.apiPort}/noninventoryquantity`)
			.then((response) => response.json())
			.then((data) => {
				this.setState({ parts: data });
			});
	}

	render() {
		return (
			// <API.Consumer>
			<View>				
				<View>
					<FontAwesomeIcon
						size={32}
						icon={
							this.state.sort === 0 ? faSortAmountDownAlt : faSortAmountUpAlt
						}
						style={{alignSelf: 'center'}}
					/>
					<Text style={{alignSelf: 'center'}}>SORT</Text>
				</View>
				<View>
					<TouchableHighlight underlayColor={colors.tealPrimary} onPress={() => { RootNavigation.navigate('NonInventory_order') }}>
						<View style={{width: '100%', alignItems: 'center', paddingVertical: 20, backgroundColor: colors.tealPrimary}}>
							<Text style={{fontSize: 20, alignSelf: 'center'}}>New Checkout</Text>
						</View>
					</TouchableHighlight>
				</View>
				<View style={[styles.content, {marginTop: 50}]}>
					<View style={[styles.col]}>
						<Text style={styles.headerText}>Items</Text>
					</View>
					<View style={[styles.col]}>
						<Text style={styles.headerText}>Quantity</Text>
					</View>
				</View>
				<View style={{marginTop: 20}}>
					<FlatList
						data={this.state.parts}
						extraData={this.state.parts}
						numColumns={2}
						columnWrapperStyle={styles.col}
						keyExtractor={(item) => item.itemno}
						renderItem={({ item }) => (
							<View style={styles.row}>
								<View style={[styles.col]}>
									<Text
										style={styles.spanText}
									>{`${item.name} (${item.itemno})`}</Text>
								</View>
								<View style={[styles.col]}>
									<Text style={styles.spanTextSmall}>{item.qty}</Text>
								</View>
							</View>
						)}
					/>
				</View>
			</View>
			// </API.Consumer>
		);
	}
}

const colors = {
	tealPrimary: '#6BD4CF',
	tealSecondary: '#7BE4DF',
	gray: '#808080',
	darkgray: '#404040',
};

const styles = StyleSheet.create({
	gridViewContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		height: 50,
		margin: 5,
		zIndex: 1,
		backgroundColor: colors.tealPrimary,
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
		justifyContent: 'flex-start',
	},
	right: {
		alignSelf: 'center',
		alignItems: 'center',
		justifyContent: 'center',
	},
	headerText: {
		textDecorationLine: 'underline',
		textAlign: 'center',
		borderBottomWidth: 4,
		borderBottomColor: colors.darkgray,
		fontSize: 16,
		marginBottom: 10,
		marginTop: 30,
	},
	titleText: {
		fontSize: 16,
		fontWeight: 'bold',
		textDecorationLine: 'underline',
		textAlign: 'center',
	},
	spanText: {
		fontSize: 16,
		fontWeight: '300',
		textDecorationLine: 'none',
		textAlign: 'center',
	},
	spanTextSmall: {
		fontSize: 14,
		textDecorationLine: 'none',
		fontWeight: '200',
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
		alignItems: 'center'
	},
	button: {
		paddingVertical: 20,
		alignItems: 'center',
		backgroundColor: colors.tealPrimary,
		flex: 1
	},
});

export default InventoryComponent;

