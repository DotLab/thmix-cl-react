import React from 'react';
import NoImageAvailable from './NoImageAvailable.jpg';

const ROW = 5;

export const FormField = (p) => (
  <div className="form-group row">
    <label className="col-sm-3 col-form-label text-right">{p.label}</label>
    <div className="col-sm-9"><input className="form-control" type="text" name={p.name} value={p.value} onChange={p.onChange}/></div>
  </div>
);

export const FormFieldTextArea = (p) => (
  <div className="form-group row">
    <label className="col-sm-3 col-form-label text-right">{p.label}</label>
    <div className="col-sm-9">
      <textarea className="form-control" value={p.value} name={p.name} rows={ROW} onChange={p.onChange}/>
    </div>
  </div>
);

export const FormFieldImageUpload = (p) => (
  <div className="form-group row">
    <label className="col-sm-3 col-form-label text-right">{p.label}</label>
    <div className="col-sm-9 p-2">
      <img className="H(200px) shadow-sm" src={p.coverUrl || NoImageAvailable} alt=""/>
      <input className="D(b) W(a) mt-2 form-control-file" type="file" accept={p.accept} onChange={p.onChange}/>
    </div>
  </div>
);
