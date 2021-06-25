import * as React from 'react';
import { NavigationContainer, StackActions } from '@react-navigation/native';


export const navigationRef = React.createRef();

export function navigate(name, params) {
    navigationRef.current?.navigate(name, params);
}

export function goBack(...args) {
    navigationRef.current?.dispatch(StackActions.pop());
}