import React from 'react';

export const Header = (p) => (
  <section className="Bgc($gray-700) P(30px) text-light shadow">
    <h2 className="row Fw(n)">{p.title}</h2>
  </section>
);
