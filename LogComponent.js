import React, { Component } from 'react'
import { Text, View } from 'react-native'

export default class LogComponent extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
             log: this.props.log
        }
    }
    
    render() {
        return (
            <>
            {this.props.log.map((v) => {
                <View>
                    <Text>{v}</Text>
                </View>
                })}
            </>
            
        )
    }
}
