import React from 'react';

export default class EditUserDetail extends React.Component {
  render() {
    return <div>
      <section className="container p-0">
        <div className="Bgc($gray-900) Pt(50px) px-5 pb-4 text-light shadow">
          <h2 className="font-weight-light m-0"><span className="font-weight-normal">Account</span> Settings</h2>
        </div>
      </section>
      <section className="container px-md-5 mb-2">
        <div className="row text-light">
          <div className="Bgc($gray-700) shadow col-lg-3 py-3 px-4"><h2 className="h5 m-0">Profile</h2></div>
          <div className="Bgc($gray-600) shadow col-lg-9 pt-3">
            <div className="form-group row">
              <label className="col-sm-2 col-form-label text-right">username</label>
              <div className="col-sm-10">
                <input className="form-control" type="email"/>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>;
  }
}
