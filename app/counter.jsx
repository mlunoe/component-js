const React = require('react');

module.exports = React.createClass({
    displayName: 'Counter',

    getInitialState() {
        return {
            count: 0
        };
    },

    componentDidMount() {
        setInterval(() => {
            const { count } = this.state;
            this.setState({ count: count + 1});
        }, 1000);
    },

    render() {
        const { count } = this.state;
        return (
            <div>Seconds passed since you have opened this page: {count}</div>
        );
    }
})
