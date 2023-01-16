class State {
  constructor() {
    this.currentState = false;
    this.data = null;
    this.setState = (st) => {
      this.currentState = st;
    };
    this.setData = (da) => {
      this.data = da;
    };
  }
}

const responseState = new State();

module.exports = responseState;
