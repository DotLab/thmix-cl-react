import React from 'react';
import NoImageAvailable from './NoImageAvailable.jpg';

const ROW = 5;

export const FormField = (s) => (
  <div className="form-group row">
    <label className="col-sm-3 col-form-label text-right">{s.label}</label>
    <div className="col-sm-9"><input className="form-control" type="text" name={s.name} value={s.value} onChange={s.onChange}/></div>
  </div>
);

export const FormFieldTextArea = (s) => (
  <div className="form-group row">
    <label className="col-sm-3 col-form-label text-right">{s.label}</label>
    <div className="col-sm-9">
      <textarea className="form-control" value={s.value} name={s.name} rows={ROW} onChange={s.onChange}/>
    </div>
  </div>
);

export const FormFieldCoverInput = (s) => (
  <div className="form-group row">
    <label className="col-sm-3 col-form-label text-right">{s.label}</label>
    <div className="col-sm-9 p-2">
      <img className="H(200px) shadow-sm" src={s.coverUrl || NoImageAvailable} alt=""/>
      <input className="D(b) W(a) mt-2 form-control-file" type="file" accept={s.accept} onChange={s.onChange}/>
    </div>
  </div>
);

export const FormFieldRadioButton = (s) => (
  <div className="form-check form-check form-check-inline">
    <input className="form-check-input" type="radio" name={s.name} id={s.id} value={s.value} onClick={s.onClick}/>
    <label className="form-check-label">{s.label}</label>
  </div>
);
