import React from 'react';
import {Link} from 'react-router-dom';
import {formatNumber, getTimeSpan, formatTimeSpan, formatNumberShort} from '../utils';
import DefaultAvatar from './DefaultAvatar.jpg';

const Row = (s) => (<tr className="Bgc(#363b49) Bgc(#3b404f):h mb-1">
  <td className="px-2 py-1 rounded-left">#{formatNumber(s.index)}</td>
  <td className="px-2 py-1 text-left">
    <img className="H(1em) Va(m) rounded" src={s.avatarUrl || DefaultAvatar} alt="avatar"/>
    <Link className="Va(m) Mstart(.25em) text-warning" to={`/users/${s.id}`}>{s.name}</Link>
  </td>
  <td className="px-2 py-1 C($gray-500)">{formatTimeSpan(getTimeSpan(s.playTime))}</td>
  <td className="px-2 py-1 C($gray-500)">{formatNumber(s.trialCount)}</td>
  <td className="px-2 py-1 C($gray-500)">{formatNumberShort(s.score)}</td>
  <td className="px-2 py-1 C($gray-500)">{formatNumber(s.avgCombo, 0)}x</td>
  <td className="px-2 py-1 C($gray-500)">{formatNumber(s.avgAccuracy * 100, 2)}%</td>
  <td className="px-2 py-1 C($gray-500)">{formatNumberShort(s.score / s.trialCount)}</td>
  <td className="px-2 py-1 C($gray-500)">{formatNumber(s.performance / s.trialCount, 2)}</td>
  <td className="px-2 py-1">{formatNumber(s.performance)}</td>
  <td className="px-2 py-1 C($gray-500)">{formatNumber(s.sCount)}</td>
  <td className="px-2 py-1 C($gray-500)">{formatNumber(s.aCount)}</td>
  <td className="px-2 py-1 C($gray-500) rounded-right">{formatNumber(s.bCount)}</td>
</tr>);

export const UserRankTable = (p) => (<div className="table-responsive">
  <table className="Bdcl(s) Bdsp(0,.25em) text-nowrap text-center">
    <thead className="small">
      <tr>
        <td></td>
        <td className="w-100"></td>
        <td className="px-2 py-1 text-muted">play time</td>
        <td className="px-2 py-1 text-muted">play count</td>
        <td className="px-2 py-1 text-muted">scores</td>
        <td className="px-2 py-1 text-muted">avg. combo</td>
        <td className="px-2 py-1 text-muted">avg. acc.</td>
        <td className="px-2 py-1 text-muted">avg. score</td>
        <td className="px-2 py-1 text-muted">avg. perf.</td>
        <td className="px-2 py-1">performance</td>
        <td className="px-2 py-1 text-muted">S</td>
        <td className="px-2 py-1 text-muted">A</td>
        <td className="px-2 py-1 text-muted">B</td>
      </tr>
    </thead>
    <tbody>
      {p.users.map((user, i) => <Row {...user} key={i} index={!p.page ? i : p.page * 50 + i}/>)}
    </tbody>
  </table>
</div>);
