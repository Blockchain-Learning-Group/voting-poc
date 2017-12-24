import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Connect, SimpleSigner } from 'uport-connect'
import { abi } from './build/contracts/Vote.json'
// import Web3 from 'web3'

// Material UI
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';

let Vote
const voteAddress = '0xf79e7fbe199ed688f58024493dc89473fcce4257'

// Init uport connection to app
const uport = new Connect('Voting POC', {
  clientId: '2okhTBhy6sNxB8VKY32y5DCshXDBFiCqDnm',
  network: 'rinkeby',
  signer: SimpleSigner('fe6b79ba68235deee2f6113079714c34e2ab3162bb285403f75b2f641f48f602')
})

const web3 = uport.getWeb3()

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      question: '',
      forVotes: 0,
      against: 0,
      activeUser: 'None',
      vote: true
    }
  }

  castVote(vote) {
    console.log(vote)
    Vote.castVote(vote, (err, tx) => {
      if (err) console.error(err)
      console.log(tx)
    })
  }

  async componentDidMount() {
    this.login()

    Vote = web3.eth.contract(abi).at(voteAddress)

    Vote.getQuestion((err, question) => {
      this.setState({ question })
    })

    Vote.for_((err, forVotes) => {
      this.setState({ forVotes: forVotes.toNumber() })
    })

    Vote.against_((err, against) => {
      this.setState({ against: against.toNumber() })
    })

    // const fullWeb3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    // const fullVote = web3.eth.contract(abi).at(voteAddress)

    // Listen for events
    // Vote.LogError({ fromBlock: 'latest', toBlock: 'latest' }).watch((error, log) => {
    //   console.log(error)
    //   console.log(log)
    //   // alert(`Error: ${log.args.error}`)
    // })
    //
    // Vote.LogVoteCast({ fromBlock: 'latest', toBlock: 'latest' }).watch((error, log) => {
    //   console.log(error)
    //   console.log(log)
    //   // alert(`Vote cast: ${log.args.vote}`)
    // })
  }

  handleDropDownChange = (event, index, vote) => {
    this.setState({ vote })
  }

  async login() {
    const user = await uport.requestCredentials({
      requested: ['name', 'avatar', 'phone', 'country'],
      notifcations: true
    })

    this.setState({ activeUser: user.name })
  }

  render() {
    return (
      <MuiThemeProvider>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">BLG Active Vote</h1>
          </header>
          <h1>{this.state.question}</h1>
          <h3>YES: {this.state.forVotes}</h3>
          <h3>NO: {this.state.against}</h3>
          <h4>Active User: {this.state.activeUser}</h4>
          <h5 className="App-intro">Cast your vote!</h5>
          <DropDownMenu maxHeight={300} width={500} value={this.state.vote} onChange={this.handleDropDownChange}>
            <MenuItem value={true} key='yes' primaryText='YES' />
            <MenuItem value={false} key='no' primaryText='NO' />
          </DropDownMenu>
          <br />
          <RaisedButton label="VOTE" labelPosition="before" primary={true}
           onClick={() => this.castVote(this.state.vote)}
          />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
