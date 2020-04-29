import React from 'react';
import PropTypes from 'prop-types';
import {postJSON} from '../helpers/fetching'


export default class PickName extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: ''
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e) {
    e.preventDefault();
    this.setState({name: e.target.value});
  }

  onSubmit(e) {
    e.preventDefault();

    const {name} = this.state;
    const {onDone} = this.props;
    postJSON('/api/players/name', {
      body: JSON.stringify({name})
    }).then(onDone);
  }

  render() {
    const {name} = this.state;
    return (
      <div className="PickName">
        <form onSubmit={this.onSubmit}>
          <div className="PickName-greeting">
            <div>Hello!</div>
            <div>What do folks call you?</div>
          </div>
          <input type="text" placeholder="M. Webster" value={name} onChange={this.onChange} />
          <button type="submit">Next</button>
        </form>
      </div>
    );
  }
}
PickName.propTypes = {
  onDone: PropTypes.func.isRequired
};
