import React, { Component } from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import fetch from 'node-fetch';
const config = require('./DatabaseServer/config.json');
import * as RootNavigation from './ThatsTheWayINavigate';
import * as util from './util';
export default class CheckoutHistoryComponent extends Component {
	constructor(props) {
		super(props);
    
		this.state = {
			checkouts: [],
			checkout_report_string: ''
		};
	}

	componentDidMount() {
		console.log('mounted order history');
		fetch(`http://${config.dbApi}:${config.apiPort}/checkoutreport`)
			.then(response => response.json())
			.then(data => {
				console.log(data.checkouts);
				this.setState({ checkouts: data.checkouts, checkout_report_string: data.checkout_report_string });
			});
	}
    
    
	render() {
		return (
			<>
			<View>
				<FlatList
					data={this.state.checkouts.filter(c => c.member_id === this.props.member)}
					extraData={this.state.checkouts.filter(c => c.member_id === this.props.member)}
					numColumns={1}
					renderItem={({item}) => (
						<View style={{
							flex: 1,
							width: '100%',
							height: 45,
							flexBasis: '100%',
						}}>
							<TouchableOpacity style={{
								width: '100%',
								height: 45,
								flexBasis: '100%',
								flexDirection: 'row'
							}}>
								<View style={{
									flex: 1,
									width: '100%',
									height: 45,
									flexDirection: 'row'
								}}>
									<View style={{flex: 0.25, borderRightWidth: 2, borderRightColor: 'black', borderBottomWidth: 2, borderBottomColor: 'black', alignItems: 'center', justifyContent: 'center'}}><Text style={{textAlign: 'center'}}>{item.name}</Text></View>
									<View style={{flex: 0.40, borderRightWidth: 2, borderRightColor: 'black', borderBottomWidth: 2, borderBottomColor: 'black', alignItems: 'center', justifyContent: 'center'}}><Text style={{textAlign: 'center'}}>{new Date(Date.parse(item.date_created)).toLocaleString("en-US")}</Text></View>
									<View style={{flex: 0.10, borderRightWidth: 2, borderRightColor: 'black', borderBottomWidth: 2, borderBottomColor: 'black', alignItems: 'center', justifyContent: 'center'}}><Text style={{textAlign: 'center'}}>{item.orderid}</Text></View>
									<View style={{flex: 0.25, borderBottomWidth: 2, borderBottomColor: 'black', alignItems: 'center', justifyContent: 'center'}}><Text>{item.notes}</Text></View>
								</View>
							</TouchableOpacity>
						</View>
					)} />
			</View>
			{/* <View>
				<TouchableHighlight>
					<Button 
						underlayColor={colors.tealSecondary}
						title="Download Report"
						onClick={() => {
							check(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE).then((r) => {
								switch (r) {
								case RESULTS.GRANTED:
									request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE).then(
										(response) => {
											if (response === RESULTS.GRANTED) {
												const fpath = `${
													RNFetchBlob.fs.dirs.DownloadDir
												}/CHECKOUT_REPORT_${util.getTimeString()}.csv`;

												RNFetchBlob.config({
													fileCache: true,
													addAndroidDownloads: {
														useDownloadManager: true,
														notification: true,
														mime: 'text/plain',
														title: `CHECKOUT_REPORT_${util.getTimeString()}.csv`,
														path: fpath,
													},
												})
													.fetch(
														'GET',
														`http://${config.dbApi}:${config.apiPort}/checkoutreport`
													)
													.then(res => res.json())
													.then(data => {
														return data.checkout_report_string;
													});
											}
										}
									);
								}
							});
						}}
					/>
				</TouchableHighlight>
			</View> */}
		</>
		);}
}

const colors = {
	tealPrimary: '#6BD4CF',
	tealSecondary: '#7BE4DF',
	gray: '#808080',
	darkgray: '#404040',
};

const styles = StyleSheet.create({
	listItem: {
		flex: 1,
		borderWidth: 1
	}
});
