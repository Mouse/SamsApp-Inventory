import React, { Component } from 'react';
import { View, TouchableHighlight, Button, Alert } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import RNFetchBlob from 'rn-fetch-blob';
const config = require('./DatabaseServer/config.json');
const util = require('./util');

export default class ReviewComponent extends Component {
	render() {
		return (
			<View style={{ flex: 1 }}>
				<TouchableHighlight style={{ marginBottom: 20 }}>
					<Button
						underlayColor={colors.tealSecondary}
						title="Download Inventory Quantities (.csv)"
						onPress={() => {
							data = [];
							request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE).then((r) => {
								switch (r) {
								case RESULTS.GRANTED:
									request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE).then(
										(response) => {
											if (response === RESULTS.GRANTED) {
												const fpath = `${
													RNFetchBlob.fs.dirs.DownloadDir
												}/INVENTORY_REPORT_${util.getTimeString()}.csv`;

												RNFetchBlob.config({
													fileCache: true,
													addAndroidDownloads: {
														useDownloadManager: true,
														notification: true,
														mime: 'text/plain',
														title: `INVENTORY_REPORT_${util.getTimeString()}.csv`,
														path: fpath,
													},
												})
													.fetch(
														'GET',
														`http://${config.dbApi}:${config.apiPort}/inventoryreport`
													)
													.then((res) => {
														res.text();
													});
											}
										}
									);
								}
							});
						}}
					/>
				</TouchableHighlight>
				<TouchableHighlight style={{ marginBottom: 20 }}>
					<Button
						underlayColor={colors.tealSecondary}
						title="Download Non-Inventory Quantities (.csv)"
						onPress={() => {
							data = [];
							request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE).then((r) => {
								switch (r) {
								case RESULTS.GRANTED:
									request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE).then(
										(response) => {
											if (response === RESULTS.GRANTED) {
												const fpath = `${
													RNFetchBlob.fs.dirs.DownloadDir
												}/NONINVENTORY_REPORT_${util.getTimeString()}.csv`;

												RNFetchBlob.config({
													fileCache: true,
													addAndroidDownloads: {
														useDownloadManager: true,
														notification: true,
														mime: 'text/plain',
														title: `NONINVENTORY_REPORT_${util.getTimeString()}.csv`,
														path: fpath,
													},
												})
													.fetch(
														'GET',
														`http://${config.dbApi}:${config.apiPort}/noninventoryreport`
													)
													.then((res) => {
														res.text();
													});
											}
										}
									);
								}
							});
						}}
					/>
				</TouchableHighlight>
				<TouchableHighlight style={{ marginBottom: 20 }}>
					<Button
						underlayColor={colors.tealSecondary}
						title="Download Checkout Report (.csv)"
						onPress={() => {
							data = [];
							request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE).then((r) => {
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
													.then((res) => {
														res.text();
													});
											}
										}
									);
								}
							});
						}}
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
