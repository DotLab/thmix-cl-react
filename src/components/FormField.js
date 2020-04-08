import React from 'react';

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
