import React, { Component } from 'react';


class User extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        console.log(this.props.match.params.id);
    }

    render() {
        return (
            <div>
                <h1>User</h1>
            </div>
        );
    }
}


export default User;
