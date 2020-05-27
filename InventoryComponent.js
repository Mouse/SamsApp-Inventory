/* global fetch:false */
import React, { Component } from 'react';
import { Text, View, StyleSheet, FlatList, Button, TouchableHighlight } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {faSortAmountDownAlt, faSortAmountUpAlt} from '@fortawesome/free-solid-svg-icons';

import Dialog, { DialogFooter, DialogContent, DialogButton, DialogTitle } from 'react-native-popup-dialog';
import RNPickerSelect from 'react-native-picker-select';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';

const config = require('./config.json');

export class InventoryComponent extends Component {
    constructor() {
        super();

        this.state = {
            sort: 0,
            parts: [],
            co_visible:false,
            selected_checkout_item: ''
        };
    }

    componentDidMount() {
        fetch(`http://${config.dbServer}:3000/inventoryquantity`)
            .then(response => response.json())
            .then(data => {
                this.setState({parts: data});
            });
    }

    render() {
        return (
            <>
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
                        this.setState({co_visible: true})
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
                    onTouchOutside={() => { this.setState({co_visible:false})}}
                    dialogTitle={<DialogTitle title="New Part Order Scan" />}
                    style={{height: 80, width: 100}}
                    footer={
                        <DialogFooter>
                            <DialogButton
                            text="CANCEL"
                            onPress={() => { this.setState({co_visible: false})}}
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
                                    this.setState({co_visible: true})
                                }} />
                            </TouchableHighlight>
                            <RNPickerSelect selectedValue={this.state.selected_checkout_item}
                                    style={{height: 40}}
                                    onValueChange={(iv) => { this.setState({selected_checkout_item: iv}); }}
                                    items={this.state.parts && this.state.parts.length > 0 && this.state.parts.map((val) => {
                                        return {"label":val.name, "value":val.itemno};
                                    })}

                            />
                         </DialogContent>

                </Dialog>
            </>
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
    

});


export default InventoryComponent;
