import React from 'react';
import {Link} from 'react-router-dom';
// import ReCAPTCHA from 'react-google-recaptcha';

import SampleAvatar from './SampleAvatar.jpg';

const Row = () => (<tr className="Bgc($gray-200) Bgc($gray-300):h mb-1">
  <td className="px-2 py-1 rounded-left font-weight-bold">#1</td>
  <td className="px-2 py-1"><span className="badge badge-primary badge-pill">A+</span></td>
  <td className="px-2 py-1 text-left"><img className="H(1em) rounded" src={SampleAvatar} alt="avatar"/> <Link className="text-dark" to="/users/idke">idke</Link></td>
  <td className="px-2 py-1 C($gray-600)">342,234,444</td>
  <td className="px-2 py-1 C($gray-600)">34,342x</td>
  <td className="px-2 py-1 C($gray-600)">84%</td>
  <td className="px-2 py-1">1,334</td>
  <td className="px-2 py-1 C($gray-600)">23</td>
  <td className="px-2 py-1 C($gray-600)">23</td>
  <td className="px-2 py-1 C($gray-600)">644</td>
  <td className="px-2 py-1 C($gray-600) rounded-right">583</td>
</tr>);

const Reply = () => (<div className="Bdc($gray-400)! border-bottom">
  <div className="Cf Maw(1000px) mx-auto py-2">
    <div className="mt-2">
      <div className="W(10%) float-left pr-3">
        <img className="W(100%) rounded-circle shadow-sm" src={SampleAvatar} alt=""/>
      </div>
      <div className="W(90%) D(ib)">
        <div>
          <span className="badge badge-pill badge-primary">A+</span> <Link className="font-weight-bold font-italic" to="/users">domSaur</Link>
        </div>
        <div>finally a map for this song ;w;(albeit taco)</div>
        <div><span className="C($gray-600) small">7 days ago</span></div>
      </div>
    </div>
  </div>
</div>);

export default class MidiDetail extends React.Component {
  render() {
    return <div>
      <section className="container">
        {/* hero */}
        <div className="Bgp(c) Bgz(cv) text-light row shadow px-md-4" style={{backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, .8)), url(https://assets.ppy.sh/beatmaps/163112/covers/card.jpg?1521017332)`}}>
          <div className="col-md-8">
            <div className="pt-2 pb-2 pb-md-4">
              <div><i className="fa-fw fas fa-play"></i>45,994,345 <i className="fa-fw fas fa-chevron-up"></i>45,994 <i className="fa-fw fas fa-heart"></i>454</div>
              <div className="Lh(1.15) font-italic">
                <h2 className="h4 m-0 mt-4 ">Chirei "Gensoukyou Engi Fuujirareshi Youkai-tachi no Page"</h2>
                <div className="h5 m-0">Lexurus</div>
              </div>
              <div className="Cf mt-4">
                <img className="H(60px) rounded float-left" src={SampleAvatar} alt=""/>
                <div className="D(ib) Lh(1.15) ml-2 small">
                  <div className="mb-2">mapped by <Link className="text-light" to="/users/">W h i t e</Link></div>
                  <div>submitted on <strong>5 April 2014</strong></div>
                  <div>approved on <strong>5 May 2014</strong></div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="text-right mt-md-4">
              <span className="Fz(1em) badge badge-pill badge-dark p-3 shadow" style={{backgroundColor: '#00000080'}}>APPROVED</span>
            </div>
            <div className="mt-4 ml-md-auto px-3 py-2" style={{backgroundColor: '#00000060'}}>
              <div><i className="fa-fw fas fa-star"></i>4.8</div>
              <div><i className="fa-fw fas fa-sun"></i>3,384,854</div>
              <div><i className="fa-fw fas fa-link"></i>434x</div>
              <div><i className="fa-fw fas fa-bullseye"></i>100%</div>
            </div>
            <div className="Mt(2px) ml-md-auto px-3 py-2" style={{backgroundColor: '#00000060'}}>
              <div className="text-center">User Rating</div>
              <div>
                <i className="fa-fw fas fa-angle-up"></i>45,394 <span className="float-right"><i className="fa-fw fas fa-angle-down"></i>1,234</span>
              </div>
            </div>
          </div>
        </div>
        {/* desc */}
        <div className="shadow row px-md-4 mb-2">
          <div className="col-md-8">
            {/* left */}
            <div className="row py-2">
              <div className="col-lg-8 py-2">
                <h3 className="h6 m-0">Description</h3>
                <div className="small">
                  Until the day the scar in my heart heals
                  and the two of us become but a memory,
                  is it okay if I continue to love you?
                </div>
              </div>
              <div className="col-lg-4 py-2">
                <h3 className="h6 m-0">Source</h3>
                <div className="small"><Link to="/">CHUNITHM</Link></div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            {/* right */}
            <div className="Bgc($gray-200) ml-md-auto mt-md-3 px-3 py-2 shadow-sm">
              <div className="text-center mt-2">Pass Rate</div>
              <div>
                <i className="fa-fw fas fa-check"></i>45,394
                <div className="float-right"><i className="fa-fw fas fa-times"></i>1,234</div>
              </div>
              <div className="text-center mt-2">Grade Cutoff</div>
              <div>
                <div><span className="font-weight-bold">S </span><span className="float-right">45,394</span></div>
                <div><span className="font-weight-bold">A-</span><span className="float-right">44,394</span></div>
                <div><span className="font-weight-bold">B-</span><span className="float-right">40,394</span></div>
                <div><span className="font-weight-bold">C-</span><span className="float-right">30,394</span></div>
                <div><span className="font-weight-bold">D-</span><span className="float-right">20,394</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="Bgc($gray-800) pt-2 pb-3">
        {/* rank */}
        <div className="container bg-white shadow p-3 mb-3">
          {/* 1st */}
          <div className="rounded border shadow-sm px-3">
            <div className="D(ib) Lh(1) text-center align-middle">
              <div className="Fz(1.2em) font-weight-bold m-0">#1</div>
              <div className="badge badge-success badge-pill mt-1">A+</div>
            </div>
            <div className="D(ib) ml-3">
              <img className="H(80px) my-2 rounded shadow-sm" src={SampleAvatar} alt=""/>
            </div>
            <div className="Mend(120px)--xl Mend(20px)--lg D(ib) ml-2 align-middle">
              <h4 className="h6 m-0 font-italic">Alchyr</h4>
              <div className="small">achieved about 2 hour ago</div>
            </div>
            <div className="D(ib) mx-2 my-2 align-middle">
              <div className="Fz(.75em) font-weight-bold border-bottom">TOTAL SUNSHINE</div>
              <div className="Fz(1.25em)">453,432,435</div>
            </div>
            <div className="D(ib) mx-2 my-2 align-middle">
              <div className="Fz(.75em) font-weight-bold border-bottom">MAX COMBO</div>
              <div className="Fz(1.25em)">445x</div>
            </div>
            <div className="D(ib) mx-2 my-2 align-middle">
              <div className="Fz(.75em) font-weight-bold border-bottom">ACCURACY</div>
              <div className="Fz(1.25em)">90.4%</div>
            </div>
            <div className="D(ib) mx-2 my-2 align-middle">
              <div className="Fz(.75em) font-weight-bold border-bottom">PERF</div>
              <div className="Fz(1.25em)">453</div>
            </div>
            <div className="D(ib) mx-2 my-2 align-middle">
              <div className="Fz(.75em) font-weight-bold border-bottom">PERFECT</div>
              <div className="Fz(1em)">453</div>
            </div>
            <div className="D(ib) mx-2 my-2 align-middle">
              <div className="Fz(.75em) font-weight-bold border-bottom">GREAT</div>
              <div className="Fz(1em)">453</div>
            </div>
            <div className="D(ib) mx-2 my-2 align-middle">
              <div className="Fz(.75em) font-weight-bold border-bottom">GOOD</div>
              <div className="Fz(1em)">453</div>
            </div>
            <div className="D(ib) mx-2 my-2 align-middle">
              <div className="Fz(.75em) font-weight-bold border-bottom">MISS</div>
              <div className="Fz(1em)">453</div>
            </div>
          </div>
          {/* ranking */}
          <div className="table-responsive">
            <table className="Bdcl(s) Bdsp(0,.25em) text-nowrap text-center">
              <thead className="small">
                <tr>
                  <td></td>
                  <td></td>
                  <td className="w-100"></td>
                  <td className="px-2 py-1 text-muted">sunshine</td>
                  <td className="px-2 py-1 text-muted">combo</td>
                  <td className="px-2 py-1 text-muted">accuracy</td>
                  <td className="px-2 py-1">performance</td>
                  <td className="px-2 py-1 text-muted">perfect</td>
                  <td className="px-2 py-1 text-muted">great</td>
                  <td className="px-2 py-1 text-muted">good</td>
                  <td className="px-2 py-1 text-muted">miss</td>
                </tr>
              </thead>
              <tbody>
                <Row/>
                <Row/>
                <Row/>
                <Row/>
                <Row/>
                <Row/>
              </tbody>
            </table>
          </div>
        </div>
        {/* comments */}
        <div className="container bg-white shadow">
          {/* input */}
          {/* <div className="Cf Maw(1000px) mx-auto py-3">
            <h2 className="C($pink) h5 m-0">Comments <span className="badge badge-secondary badge-pill">3</span></h2>
            <div className="mt-2">
              <div className="W(10%) float-left pr-3">
                <img className="W(100%) rounded-circle shadow-sm" src={SampleAvatar} alt=""/>
              </div>
              <form className="W(90%) D(ib)">
                <textarea className="form-control" type="text" />
                <ReCAPTCHA className="mt-2 float-left" sitekey="6LfMg5YUAAAAAAJr_ANH5TVvhoSHsJEa6oGSHw6f" name="hi" onChange={this.onRecaptchaChange}/>
                <button className="btn btn-primary mt-2 ml-2" type="submit">Post</button>
              </form>
            </div>
          </div> */}
        </div>
        <div className="Bgc($gray-200) container">
          <div className="">
            <Reply />
            <Reply />
            <Reply />
            <Reply />
          </div>
        </div>
      </section>
    </div>;
  }
}
