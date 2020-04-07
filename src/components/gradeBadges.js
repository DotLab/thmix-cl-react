import React from 'react';

export const GradeBadgeS = ({grade}) => <span className="Bgc($purple)! badge badge-dark badge-pill">{grade}</span>;
export const GradeBadgeA = ({grade}) => <span className="badge badge-warning badge-pill">{grade}</span>;
export const GradeBadgeB = ({grade}) => <span className="badge badge-light badge-pill">{grade}</span>;
export const GradeBadgeC = ({grade}) => <span className="badge badge-info badge-pill">{grade}</span>;
export const GradeBadgeD = ({grade}) => <span className="badge badge-danger badge-pill">{grade}</span>;
export const GradeBadgeF = ({grade}) => <span className="badge badge-dark badge-pill">{grade}</span>;

export const GradeBadge = ({gradeLevel, grade}) => {
  switch (gradeLevel) {
    case 'S': return <GradeBadgeS grade={grade || gradeLevel}/>;
    case 'A': return <GradeBadgeA grade={grade || gradeLevel}/>;
    case 'B': return <GradeBadgeB grade={grade || gradeLevel}/>;
    case 'C': return <GradeBadgeC grade={grade || gradeLevel}/>;
    case 'D': return <GradeBadgeD grade={grade || gradeLevel}/>;
    default: return <GradeBadgeF grade={grade || gradeLevel}/>;
  }
};
