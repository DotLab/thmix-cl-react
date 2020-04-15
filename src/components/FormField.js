import React from 'react';

const ROW = 5;

export const FormField = (s) => (
  <div className="form-group row">
    <label className="col-sm-3 col-form-label text-right">{s.label}</label>
    <div className="col-sm-9"><input className="form-control" type={s.type || 'text'} name={s.name} value={s.value} onChange={s.onChange}/></div>
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

export const FormFieldButton = (s) => (
  <div className="form-group row">
    <div className="offset-sm-3 col-sm-9"><button className="btn btn-primary" onClick={s.onClick}>{s.label}</button></div>
  </div>
);
