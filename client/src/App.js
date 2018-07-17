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
    K/D/A: {match.kills}/{match.deaths}/{match.assists}
    <br/>
    Champion ID: {match.champion}
    <br/>
    Champion Level: {match.level}
    <br/>
    Total Creep Count: {match.minionKills}
    <br/>
    Items: {match.items.map(item => <div>{item}</div>)}
    <br/>
    Spell 1: {match.spell1}
    <br/>
    Spell 2: {match.spell2}
    <br/>
  </div>
)

    // Match ID: match.gameId
    // <br/>
    // {match.teams[0].win === 'Win' ? 'WON MATCH' : 'LOST MATCH'}
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
        {this.state.hit && this.state.data.map(match => <ListItem key={match.gameId} match={match} />)}
      </div>
    );
  }
}

export default App;

/*

        */