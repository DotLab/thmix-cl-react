import React from 'react';

export const GradeBadgeS = ({grade}) => <span className="Bgc($purple)! badge badge-pill">{grade}</span>;
export const GradeBadgeA = ({grade}) => <span className="badge badge-warning badge-pill">{grade}</span>;
export const GradeBadgeB = ({grade}) => <span className="badge badge-light badge-pill">{grade}</span>;
export const GradeBadgeC = ({grade}) => <span className="badge badge-info badge-pill">{grade}</span>;
export const GradeBadgeD = ({grade}) => <span className="badge badge-danger badge-pill">{grade}</span>;
export const GradeBadgeF = ({grade}) => <span className="badge badge-dark badge-pill">{grade}</span>;

export const GradeBadge = ({gradeLevel, grade}) => {
  switch (gradeLevel) {
    case 'S': return <GradeBadgeS grade={grade}/>;
    case 'A': return <GradeBadgeA grade={grade}/>;
    case 'B': return <GradeBadgeB grade={grade}/>;
    case 'C': return <GradeBadgeC grade={grade}/>;
    case 'D': return <GradeBadgeD grade={grade}/>;
    default: return <GradeBadgeF grade={grade}/>;
  }
};
