/**
 *  * Sample React Native App
 *  * https://github.com/facebook/react-native
 *  *
 *  * @format
 *  * @flow strict-local
 *  */
import React, { Component } from 'react';
import {
	StyleSheet,
	View,
	Text,
	FlatList,
	ScrollView,
	TouchableHighlight,
} from 'react-native';

import { NativeRouter, Route, Link } from 'react-router-native';
import InventoryComponent from './InventoryComponent';
import NonInventoryComponent from './NonInventoryComponent';

//import colors from './includes';

const NullComponent = () => {
	return <Text>Click one of the buttons to begin</Text>;
};

export default class App extends Component {
	constructor() {
		super();

		this.state = {
			GridListItems: [
				{ key: 'Inventory', page: 'inventory' },
				{ key: 'Non-Inventory', page: 'noninv' },
				{ key: 'Reports', page: 'repo' },
				{ key: 'Checkout History', page: 'history' },
				{ key: 'Members', page: 'members' },
				{ key: 'Support', page: 'support' }
			],
			overlay_on: false,
			camera: null
		};
	}

	showCamera(cam) {
		this.setState({camera: cam});
	}

	render() {
		return (
			<NativeRouter>
				<View>
					<Text style={styles.titleText}>FPS - Inventory Control</Text>
				</View>
				<View>
					<FlatList
						data={this.state.GridListItems}
						extraData={this.state.GridListItems}
						renderItem={({ item }) =>
							<TouchableHighlight style={{flex: 1}} >
								<Link underlayColor={colors.tealSecondary} style={styles.gridViewContainer} to={`/${item.page}`}><Text>{item.key}</Text></Link>
							</TouchableHighlight>
						}
						numColumns={2}
					/>
				</View>
				{ 
					this.state.overlay_on && <View
						ref={r => this.overlay = r}
						style={
							{
								position: 'absolute',
								width: '100%',
								height: '100%',
								backgroundColor: 'rgba(2,2,2,0.2)',
							}
						}
						nativeID={"camera_overlay"}
					>
						{this.state.camera}
					</View>
				}
				<ScrollView style={styles.content}>
					<Route exact path="/" component={NullComponent} />
					<Route path="/inventory" component={InventoryComponent} />
					<Route path="/noninv" component={() => <NonInventoryComponent showCameraFunction={this.showCamera} /> }  />
				</ScrollView>
				
			</NativeRouter>
		);
	}
}

const colors = {
	tealPrimary: '#6BD4CF',
	tealSecondary: '#7BE4DF',
	gray: '#808080',
	darkgray: '#404040'
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
	titleText: {
		color: colors.gray,
		fontSize: 28,
		fontWeight: 'bold',
		textAlign: 'center'
	},
	content: {
		borderTopColor: colors.darkgray,
		borderTopWidth: StyleSheet.hairlineWidth
	}
});

