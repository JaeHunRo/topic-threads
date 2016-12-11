var React = require('react');
var ReactDOM = require('react-dom');
var App = React.createFactory(require('./src/js/App'));

ReactDOM.render(<App />, document.getElementById('body'));
