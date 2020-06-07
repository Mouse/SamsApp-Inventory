import React, { Component } from 'react';
import Slider from 'react-native-slider';
import { Text, View, Alert } from 'react-native';
import DialogManager, { DialogButton } from 'react-native-dialog-component';
const config = require('./config.json');

export default class QtySlider extends Component {
	constructor(props) {
		super(props);

		this.state = {
			qty: 1,
		};
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
						minimumValue={1}
						maximumValue={parseInt(item.qty)}
						minimumTrackTintColor={colors.tealSecondary}
						maximumTrackTintColor={colors.gray}
					/>
					<Text ref={(r) => this.text_ref}>{this.state.qty}</Text>
					<DialogButton
						align="center"
						text="OK"
						onPress={() => {
							fetch(
								`http://${config.dbServer}:${config.apiPort}/inventoryquantity?itemno=${item.itemno}&qty=${this.state.qty}`
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
					/>
					<DialogButton
						align="center"
						text="CANCEL"
						onPress={() => {
							DialogManager.dismissAll();
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
