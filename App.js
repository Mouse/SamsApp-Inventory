/** TODO
	1.) Delete node modules and lock files
	2.) react-native-router-flux causing issue?
**/
/**
 *  * Sample React Native App
 *  * https://github.com/facebook/react-native
 *  *
 *  * @format
 *  * @flow strict-local
 *  */

import 'react-native-gesture-handler';
import React, { Component } from 'react';
import {
	StyleSheet,
	View,
	Text,
	FlatList,
	TouchableHighlight,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { navigationRef } from './ThatsTheWayINavigate';

import * as RootNavigation from './ThatsTheWayINavigate';

//import { Router, Scene, Stack, Actions } from 'react-native-router-flux';

import InventoryComponent from './InventoryComponent';
import NonInventoryComponent from './NonInventoryComponent';
import ReviewComponent from './ReviewComponent';
import MembersComponent from './MembersComponent';
import CheckoutHistoryComponent from './CheckoutHistoryComponent';
import InventoryOrderComponent from './InventoryOrderComponent';
import NonInventoryOrderComponent from './NonInventoryOrderComponent';
import Cart from './Cart';
import CartComponent from './CartComponent';
import LogComponent from './LogComponent';

const config = require('./DatabaseServer/config.json');
//import colors from './includes';

import fetch from 'node-fetch';
import AbortController from 'abort-controller';
import { ScrollView } from 'react-native-gesture-handler';

if (!globalThis.fetch) {
	globalThis.fetch = fetch;
}

const controller = new AbortController();
const Stack = createStackNavigator();
//const API = React.createContext();

export default class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			GridListItems: [
				{ key: 'Inventory', page: 'Inventory' },
				{ key: 'Non-Inventory', page: 'Noninventory' },
				{ key: 'Reports', page: 'Repo' },
				{ key: 'Checkout History', page: 'History' },
				{ key: 'Members', page: 'Members' },
				{ key: 'Support', page: 'Support' },
				{ key: 'Log', page: 'Log'}
			],
			overlay_on: false,
			camera: null,
			status_lines: [],
			user: 0,
			users: [],
			cart_icon_showing: false,
			cart_items: 0,
			cart_qty: 0,
		};

		this.statusUpdate.bind(this);
		this.setUser.bind(this);
		this.setPage.bind(this);
	}

	setUser(u) {
		const { navigation } = this.props;
		this.setState({ user: u }, () => {
			RootNavigation.navigate('Choice');
		});
		
	}

	setPage(p) {
		RootNavigation.navigate(p);
	}

	showCartIcon = () => {
		this.setState({ cart_icon_showing: true });
	};

	hideCartIcon = () => {
		this.setState({ cart_icon_showing: false });
	}

	setCartDistinctItemsQty = (n) => {
		this.setState({ cart_items: n });
	};

	setCartTotalItemsQty = (n) => {
		this.setState({ cart_qty: n });
	};

	getCartDistinctItemsQty = (n) => {
		return this.state.cart_items;
	};

	getCartTotalItemsQty = (n) => {
		return this.state.cart_qty;
	};

	checkConnectionFetch = async () => {
		this.statusUpdate(
			`Attempting to connect to http://${config.dbApi}:${config.apiPort} - fetch`
		);
		const timeout = setTimeout(() => {
			controller.abort();
		}, 3000);

		return fetch(`http://${config.dbApi}:${config.apiPort}/members`, {
			signal: controller.signal,
		})
			.then((response) => response.json())
			.then((data) => {
				this.statusUpdate('Connected - fetch');
			})
			.catch((err) => {
				if (err.name === 'AbortError') {
					this.statusUpdate('Timed out - fetch');
					const old = config.dbApi;
					this.statusUpdate(`Old config.dbApi: ${old}`);
					config.dbApi = config.dbApiLocal;
					this.statusUpdate(`Changed config.dbAbi from ${old} to ${config.dbApi}`);
				} else {
					this.statusUpdate(`Connection error: ${err} - fetch`);
				}
			})
			.finally(() => {
				clearTimeout(timeout);
			});
	};

	// checkConnectionXMLRequest = async () => {
	// 	const xhr = new XMLHttpRequest();
	// 	const app_obj = this;

	// 	xhr.withCredentials = true;
	// 	xhr.timeout = 5000;

	// 	return new Promise((resolve, reject) => {
	// 		xhr.onload = (ev) => {
	// 			if (xhr.readyState === 4 && xhr.status === 200) {
	// 				app_obj.statusUpdate('Connected successfully - XMLHttpRequest');
	// 				resolve(xhr);
	// 			} else {
	// 				app_obj.statusUpdate(
	// 					`Connection failed: ${xhr.status} - ${xhr.response}`
	// 				);
	// 				reject(xhr);
	// 			}
	// 		};

	// 		xhr.onerror = (pev) => {
	// 			app_obj.statusUpdate('Connection crit failed: - XMLHttpRequest');
	// 			reject(xhr);
	// 		};

	// 		xhr.open(
	// 			'GET',
	// 			`http://${config.dbApi}:${config.apiPort}/members`,
	// 			true
	// 		);
	// 		this.statusUpdate(
	// 			`Attempting to connect to http://${config.dbApi}:${config.apiPort} - XMLHttpRequest`
	// 		);
	// 		xhr.send();
	// 	});
	// };

	componentDidMount() {
		this.checkConnectionFetch().then(() => {
			fetch(`http://${config.dbApi}:${config.apiPort}/members`)
			.then((response) => response.json())
			.then((data) => {
				this.setState({ users: data });
				this.statusUpdate(`Connecting with ${config.dbApi}:${config.apiPort}`);
			});
		});
		//await this.checkConnectionXMLRequest(); //reasons6		
	}

	componentDidUpdate(prevProps, prevState) {
		// if (this.state.status_lines.length > 3) {
		// 	this.state.status_lines.shift();
		// }
		// if (this.state.users.length !== prevState.users.length) {
		// 	return true;
		// }
	}

	statusUpdate(text) {
		console.log(text);
		this.setState({ status_lines: [...this.state.status_lines, text] });
	}

	showCamera(cam) {
		this.setState({ overlay_on: true, camera: cam });
	}

	hideCamera() {
		this.setState({ overlay_on: false, camera: null });
	}

	render() {
		//DO NOT EVER PUT ANOTHER RETURN HERE. IT DELETES EVERYTHING
		return (
			<>
				{this.state.overlay_on && (
					<View
						onTouchEnd={(e) => {
							this.setState({ overlay_on: false, camera: null });
						}}
						ref={(r) => (this.overlay = r)}
						style={{
							position: 'absolute',
							top: 0,
							left: 0,
							width: '100%',
							height: '100%',
							zIndex: 999,
							backgroundColor: 'rgba(2,2,2,0.75)',
						}}
						nativeID={'camera_overlay'}
					>
						{this.state.camera}
					</View>
				)}
				{!this.state.overlay_on && (
					<NavigationContainer ref={ navigationRef }> 
						<Stack.Navigator initialRouteName="Login" key="root">
							<Stack.Screen name="Login" options={{ title: "Login" }} initial>
								{props => 
									<View>
										<FlatList
											data={this.state.users}
											extraData={this.state.users}
											renderItem={({ item }) => 
												(
													<TouchableHighlight underlayColor={colors.tealPrimary} onPress={this.setUser.bind(this,item.id)}>
														<View style={{flex: 1, width: '100%', alignItems: 'center', paddingVertical: 15, marginBottom: 5, backgroundColor: colors.tealPrimary}}>
															<Text style={{fontSize: 20}}>{item.name}</Text>
														</View>
													</TouchableHighlight>
												)}
											numColumns={1}
										/>
									</View>
								}
							</Stack.Screen>
							
							<Stack.Screen name="Choice" options={{ title: "FPS Inventory System" }}>
								{ props => 
									<>
										<View>
											<FlatList
												data={this.state.GridListItems}
												extraData={this.state.GridListItems}
												renderItem={({ item }) => (
													<TouchableHighlight underlayColor={colors.tealPrimary} style={{ flex: 1 }} onPress={this.setPage.bind(this,item.page)}>
														<View style={{flex: 1, width: '98%', alignItems: 'center', paddingVertical: 15, marginBottom: 5, backgroundColor: colors.tealPrimary}}>
															<Text style={{fontSize: 15}}>{item.key}</Text>
														</View>
													</TouchableHighlight>
												)}
												numColumns={2}
											/>
										</View>
										<View style={{alignItems: 'center'}}><Text>Version: 1.0.0</Text></View>
									</>
								}
							</Stack.Screen>

							<Stack.Screen name="Inventory" options={{ title: "Inventory" }}>
								{ props => 
									<InventoryComponent
										member={this.state.user}
										showCameraFunction={this.showCamera.bind(this)}
										hideCameraFunction={this.hideCamera.bind(this)}
									/>
								}
							</Stack.Screen> 
							<Stack.Screen name="Noninventory" options={{ title: "Non-Inventory" }}>
								{ props => 
									<NonInventoryComponent
										member={this.state.user}
										showCameraFunction={this.showCamera.bind(this)}
										hideCameraFunction={this.hideCamera.bind(this)} 
									/>
								}
							</Stack.Screen>
							<Stack.Screen name="Repo" options={{ title: "Reports" }} component={ReviewComponent} />
							<Stack.Screen name="History" options={{ title: "Order History" }}>
								{ props => 
									<CheckoutHistoryComponent
										member={this.state.user}	
									/>
								}
							</Stack.Screen> 
							<Stack.Screen name="Members" options={{ title: "Members" }} component={MembersComponent} />
							<Stack.Screen name="Support" options={{ title: "Support" }}>
								{ props => 
									<View>
										<Text>Please contact Sam Rodriguez for assistance</Text>
									</View>
								}
							</Stack.Screen>
							<Stack.Screen name="Inventory_order" options={{ title: "Inventory Order" }}>
								{ props => 
									<InventoryOrderComponent
										member={this.state.user}
										showCameraFunction={this.showCamera.bind(this)}
										hideCameraFunction={this.hideCamera.bind(this)}
										showCartIconFunction={this.showCartIcon.bind(this)}
										setCartItemsFunction={this.setCartDistinctItemsQty.bind(this)}
										setCartQtyFunction={this.setCartTotalItemsQty.bind(this)}

									/>
								}
							</Stack.Screen>
							<Stack.Screen name="NonInventory_order" options={{ title: "Non-Inventory Order" }}>
								{ props => 
									<NonInventoryOrderComponent
										member={this.state.user}
										showCameraFunction={this.showCamera.bind(this)}
										hideCameraFunction={this.hideCamera.bind(this)}
										showCartIconFunction={this.showCartIcon.bind(this)}
										setCartItemsFunction={this.setCartDistinctItemsQty.bind(this)}
										setCartQtyFunction={this.setCartTotalItemsQty.bind(this)}

									/>
								}
							</Stack.Screen>
								
							<Stack.Screen name="Cart" options={{ title: "Cart" }}>
								{ props =>
									<CartComponent
										hideCart={this.hideCartIcon.bind(this)}
										showCart={this.showCartIcon.bind(this)}
										getCartDistinctItemsQty={this.getCartDistinctItemsQty.bind(this)}
										getCartTotalItemsQty={this.getCartTotalItemsQty.bind(this)}
										setCartDistinctItemsQty={this.setCartDistinctItemsQty.bind(this)}
										setCartTotalItemsQty={this.setCartTotalItemsQty.bind(this)}
									/>
								}
							</Stack.Screen>

							<Stack.Screen name="Log" options={{ title: "Log" }}>
								{ props =>
									<LogComponent
										log={this.state.status_lines}
									/>
								}	
							</Stack.Screen> 

						</Stack.Navigator>
					</NavigationContainer>
				)}
				{ this.state.cart_icon_showing > 0 &&
					<TouchableHighlight style={{
							backgroundColor: '#f00',
							position: 'absolute',
							bottom: 0,
							right: 0,
							paddingVertical: 20,
							paddingHorizontal: 20,						
							borderRadius: 20,
							zIndex: 999
						}}
						onPress={this.setPage.bind(this,'Cart')}
						underlayColor={colors.gray}>
						<Text style={{color: 'black'}}>{this.state.cart_items} - ({this.state.cart_qty})</Text>
					</TouchableHighlight>
				}
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

const styles = StyleSheet.create({
	gridViewContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		height: 50,
		margin: 5,
		backgroundColor: colors.tealPrimary,
	},
	titleText: {
		color: colors.gray,
		fontSize: 28,
		fontWeight: 'bold',
		textAlign: 'center',
	},
	content: {
		borderTopColor: colors.darkgray,
		borderTopWidth: StyleSheet.hairlineWidth,
	},
});
