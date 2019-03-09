import React from 'react';

class App extends React.Component {
  render() {
    return <div>
      <section className="Bgc($purple) container shadow text-light pt-4 pb-1">
        <h2 className="font-weight-normal">Help Center</h2>
      </section>
      <section className="Bgc($gray-700) Px(50px) container shadow text-light py-4">
        <h3>Bug/Crashes</h3>
        <p>Please report the problem with your device specs and the version of Touhou Mix to
          our <a className="text-warning" href="https://github.com/DotLab/Touhou-Mix-Unity/issues">GitHub issue tracker</a>.</p>

        <h3>Feature request</h3>
        <p>Please describe the feature that you wanted in
          our <a className="text-warning" href="https://github.com/DotLab/Touhou-Mix-Unity/issues">GitHub issue tracker</a>.</p>

        <h3>Online support</h3>
        <p>Join our discord server at <a className="text-warning" href="https://discord.gg/m2BeMbj">https://discord.gg/m2BeMbj</a></p>
        <p>Join our QQ group at <span className="text-warning">562614447</span></p>

        <h3>Other questions</h3>
        Please tell us your questions directly at the address listed below.
        <p>Email: <a className="text-warning" href="mailto:shinya3@yahoo.com">shinya3@yahoo.com</a> (24 hour response guaranteed)</p>
      </section>
    </div>;
  }
}

export default App;
