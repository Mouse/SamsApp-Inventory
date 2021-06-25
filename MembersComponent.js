import React, { Component } from 'react';
import { View, FlatList, Text, TextInput } from 'react-native';
const config = require('./DatabaseServer/config.json');

export default class MembersComponent extends Component {
	constructor(props) {
		super(props);

		this.state = {
			members: [],
			filtered_members: [],
			search: ''
		};

		this.changeSearch.bind(this);
	}

	changeSearch(t) {
		this.setState({ search: t }, () => {
				this.setState({ filtered_members: this.state.members.filter(v => v.name.match(this.state.search) !== null)});
			}
		);
	}

	componentDidMount() {
		fetch(`http://${config.dbApi}:${config.apiPort}/members`)
			.then((response) => response.json())
			.then((data) => {
				this.setState({ members: data, filtered_members: data });
			});
	}

	render() {
		return (
			<>
				<View>
					<Text style={{textAlign: 'center'}}>Search</Text>
					<TextInput 
						style={{
							borderColor: 'gray',
							borderWidth: 2
						}}
						value={this.state.search}
						onChangeText={t => this.changeSearch(t)}
					/>
				</View>
				<View>
					<FlatList
						data={this.state.filtered_members}
						extraData={this.state.filtered_members}
						renderItem={({ item }) => (
							<Text>{item.name}</Text>
						)}
						numColumns={1}
					/>
				</View>
			</>
		);
	}
}
