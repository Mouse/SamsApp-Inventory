import { withNavigationFocus } from "react-navigation";
import QRCodeScanner from "react-native-qrcode-scanner";
import React, { Component } from 'react';
import { View } from "react-native";

class QRCam extends Component {

    constructor() {
        super();
    }

    renderCamera() {
       const isFocused = this.props.navigation.isFocused();
       
       if (!isFocused) {
           return null;
       } else if (isFocused) {
           return (
              <QRCodeScanner {...this.props} />
           )
       }
    }

    render() {
       return (
         <View style={{ flex: 1 }}>
            {this.renderCamera()}
         </View>
       );
   }
}

export default withNavigationFocus(QRCam);