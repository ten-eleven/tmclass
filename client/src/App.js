import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from "axios"
import {FormGroup, ControlLabel, FormControl, Button, Label, Badge} from "react-bootstrap"
import _ from "lodash"

let fromStatus = (status)=>{
  return {
    'exact':'success',
    'spelling':'spelling',
    'partial':'warning',
    'additional':'info',
  }[status]
}
let StatusLabel = ({type, classNumber})=> {
  if(type === 'exact'){
    return <Label bsStyle="success">{classNumber} Verified</Label>
  } else if(type === 'partial'){
    return <Label bsStyle="warning">{classNumber} Partial</Label>
  } else if(type === 'spelling'){
    return <Label bsStyle="spelling">{classNumber} Spelling</Label>
  }


}
class App extends Component {
  constructor(){
    super()
    this.state = {
      results:[]
    }
  }
  analyze = (e)=> {
    e.preventDefault()
    let query = this.state.query
    axios.post('/search', {query})
      .then((response)=> {
        this.setState({
          results:response.data
        })
      })

  }

  render() {
    return (
      <div className="App">
      <form onSubmit={this.analyze}>
        <FormGroup controlId="query">
          <ControlLabel>Description</ControlLabel>
          <FormControl rows={10} componentClass="textarea" onChange={(e)=> this.setState({query:e.target.value})}/>
        </FormGroup>
        <Button type="submit">Analyze</Button>

      </form>
        {
          this.state.results &&
          <ul>
            {this.state.results.map((item, index)=> {
              return (<li key={index}>
                <h5><StatusLabel type={item.type} classNumber={item.classNumber}/> {item.description}</h5>
                <ul>
                  {_.map(item.results, (item, index)=> {
                    return(
                      <li key={index} className={item.type}>
                        <Label bsStyle={fromStatus(item.type)}>{item.data.classNumber}</Label> {item.data.finalTerm}
                      </li>
                    )
                  })}
                </ul>
              </li>)
            })}
          </ul>
        }
      </div>
    );
  }
}

export default App;
