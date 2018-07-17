import React, { Component } from 'react';
import './App.css';

const ListItem = ({match}) => (
  <div className='listItem'>
    <div className='matchId'>
      MATCH ID: {match.gameId}
    </div>
    <div className={match.win ? 'matchWon' : 'matchLost' }>
      {match.win ? 'WIN' : 'LOSS'}
    </div>
    <div>
      Game Length: {match.duration}
    </div>
    <div>
      K/D/A: {match.kills}/{match.deaths}/{match.assists}
    </div>
    <div>
      Champion ID: {match.champion}
    </div>
    <div>
      Champion Level: {match.level}
    </div>
    <div>
      Total Creep Count: {match.minionKills}
    </div>
    <div>
      Creep Score Per Min: {match.minionKills / match.duration}
    </div>
    <div>
      Items: {match.items.map(item => <div>{item}</div>)}
    </div>
    <div>
      Spell 1: {match.spell1}
    </div>
    <div>
      Spell 2: {match.spell2}
    </div>
  </div>
)

class App extends Component {

  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      hit: false,
      error: "",
      data: []
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    let summoner = e.target.summoner.value;
    if (summoner === '') {
      return;
    }
    console.log("Getting stuff")
    console.log("summoner is", summoner)
    fetch(`/api/summoner/${summoner}`)
    .then(res => res.json())
    .then(res => {
      console.log("got stuff")
      console.log(res);
      let data = [];
      for (let match in res) {
        data.push(res[match]);
      }
      console.log("DATA FORMATTED:", data);
      this.setState({
        hit: true,
        data: data
      });
    })
    .catch(err => {
      this.setState({
        hit: true,
        error: err
      })
    })

  }

  render() {
    return (
      <div>
        <header>LOL STATS APP</header>
        <form onSubmit={e => this.handleSubmit(e)}>
          <input type='text' name='summoner' placeholder='Summoner name' />
          <input type='submit' value='Get info' />
        </form>
        {this.state.hit && this.state.data.map(match => <ListItem match={match} key={match.gameId} />)}
      </div>
    );
  }
}

export default App;

/*

        */