const expect = require('chai').expect;
import Path from '../../../src/shape/path';
import { getColor } from '../../get-color';
const canvas = document.createElement('canvas');
canvas.width = 500;
canvas.height = 500;
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

describe('test path', () => {
  const p1 = [
    ['M', 10, 10],
    ['L', 20, 20],
  ];
  const p11 = [
    ['M', 10, 10],
    ['L', 20, 10],
    ['L', 20, 20],
  ];
  const p2 = [
    ['M', 10, 10],
    ['Q', 20, 20, 30, 10],
  ];

  const p3 = [
    ['M', 10, 10],
    ['L', 20, 20],
    ['C', 30, 10, 40, 30, 50, 20],
  ];
  const p4 = [['M', 10, 10], ['L', 20, 20], ['A', 20, 20, 0, 0, 1, 60, 20], ['Z'], ['M', 200, 200], ['L', 300, 300]];
  const p5 =
    'M 100,300' +
    'l 50,-25' +
    'a 25,25 -30 0,1 50,-25' +
    'l 50,-25' +
    'a 25,50 -30 0,1 50,-25' +
    'l 50,-25' +
    'a 25,75 -30 0,1 50,-25' +
    'l 50,-25' +
    'a 25,100 -30 0,1 50,-25' +
    'l 50,-25' +
    'l 0, 200,' +
    'z';
  const path = new Path({
    attrs: {
      path: [
        ['M', 10, 10],
        ['l', 2, 2],
      ],
      stroke: 'red',
    },
  });
  it('init', () => {
    expect(path.attr('stroke')).eqls('red');
    expect(path.attr('lineWidth')).eqls(1);
    expect(path.attr('path')).eqls([
      ['M', 10, 10],
      ['L', 12, 12],
    ]);
    expect(path.get('hasArc')).eqls(false);

    path.attr('path', [
      ['M', 2, 2],
      ['Q', 3, 4, 4, 2, 5, 6],
    ]);
    expect(path.get('hasArc')).eqls(true);
  });

  it('draw line', () => {
    path.attr('path', p1);
    expect(path.get('hasArc')).eqls(false);
    path.draw(ctx);
    expect(getColor(ctx, 15, 15)).eqls('#ff0000');
    expect(getColor(ctx, 15, 16)).eqls('#000000');
  });

  it('draw polygon', () => {
    ctx.clearRect(0, 0, 100, 100);
    path.attr('stroke', 'blue');
    path.attr('path', p11);
    path.draw(ctx);
    expect(getColor(ctx, 15, 10)).eqls('#0000ff');
    expect(getColor(ctx, 15, 15)).eqls('#000000');

    expect(path.isHit(15, 10)).eqls(true);
    expect(path.isHit(15, 15)).eqls(false);
  });

  it('draw and hit curve Q', () => {
    // const p2 = [['M', 10, 10], ['Q', 20, 20, 30, 10]];
    ctx.clearRect(0, 0, 100, 100);
    path.attr('stroke', 'blue');
    path.attr('path', p2);
    path.draw(ctx);
    expect(getColor(ctx, 20, 15)).eqls('#0000ff');
    expect(getColor(ctx, 20, 16)).eqls('#000000');
    expect(path.isHit(20, 15)).eqls(true);
    expect(path.isHit(20, 15.4)).eqls(true);
    expect(path.isHit(20, 16)).eqls(false);

    ctx.clearRect(0, 0, 100, 100);
    path.attr('lineWidth', 4);
    path.draw(ctx);
    expect(getColor(ctx, 20, 16)).eqls('#0000ff');
    expect(path.isHit(20, 16)).eqls(true);
  });

  it('draw and hit curve C', () => {
    // const p3 = [['M', 10, 10], ['L', 20, 20], ['C', 30, 10, 40, 30, 50, 20]];
    ctx.clearRect(0, 0, 100, 100);
    path.attr({ stroke: 'blue', lineWidth: 1 });
    path.attr('path', p3);
    path.draw(ctx);

    expect(getColor(ctx, 15, 15)).eqls('#0000ff');
    expect(getColor(ctx, 35, 20)).eqls('#0000ff');
    expect(path.isHit(15, 15)).eqls(true);
    expect(path.isHit(35, 20)).eqls(true);
  });

  it('draw and hit curve A', () => {
    // const p4 = [['M', 10, 10], ['L', 20, 20], ['A', 20, 20, 0, 10, 10, 60, 20], ['Z'], ['M', 200, 200], ['L', 300, 300]];
    ctx.clearRect(0, 0, 100, 100);
    path.attr({ stroke: 'blue', lineWidth: 1 });
    path.attr('path', p4);
    path.draw(ctx);

    expect(getColor(ctx, 19, 19)).eqls('#0000ff');
    expect(getColor(ctx, 20, 21)).eqls('#000000');
    expect(getColor(ctx, 40, 0)).eqls('#0000ff');
    expect(getColor(ctx, 40, 1)).eqls('#000000');

    expect(path.isHit(19, 19)).eqls(true);
    expect(path.isHit(20, 21)).eqls(false);
    expect(path.isHit(40, 0)).eqls(true);
    expect(path.isHit(40, 1)).eqls(false);
  });

  it('draw fill, one polyline', () => {
    ctx.clearRect(0, 0, 100, 100);
    // const p11 = [['M', 10, 10], ['L', 20, 10], ['L', 20, 20]];
    path.attr({
      path: p11,
      stroke: null,
      fill: 'red',
    });
    path.draw(ctx);
    expect(getColor(ctx, 15, 11)).eqls('#ff0000');
    expect(getColor(ctx, 15, 9)).eqls('#000000');

    expect(path.isHit(15, 11)).eqls(true);
    expect(path.isHit(15, 9)).eqls(false);
  });

  it('multiple polygon fill hit', () => {
    const p5 = [
      ['M', 10, 10],
      ['L', 30, 10],
      ['L', 30, 30],
      ['L', 10, 30],
      ['Z'],
      ['M', 100, 100],
      ['L', 120, 100],
      ['L', 120, 130],
      ['M', 200, 200],
      ['L', 220, 200],
      ['L', 220, 220],
      ['Z'],
    ];

    path.attr({
      path: p5,
      stroke: null,
      fill: 'red',
    });
    expect(path.isHit(10, 20)).eqls(true);
    expect(path.isHit(15, 9)).eqls(false);
    expect(path.isHit(15, 15)).eqls(true);
    expect(path.isHit(30, 20)).eqls(true);

    expect(path.isHit(110, 110)).eqls(true);
    expect(path.isHit(215, 210)).eqls(true);
    expect(path.isHit(215, 199)).eqls(false);
  });

  it('curve fill hit', () => {
    // const p2 = [['M', 10, 10], ['Q', 20, 20, 30, 10]];
    path.attr({
      path: p2,
      fill: 'red',
    });
    expect(path.isHit(10, 11)).eqls(false);
    expect(path.isHit(20, 15)).eqls(true);
    expect(path.isHit(20, 10)).eqls(true);
    expect(path.isHit(20, 9)).eqls(false);
  });

  it('box', () => {
    path.attr('path', p1);
    const bbox = path.getBBox();
    expect(bbox.minX).equal(10);
    expect(bbox.minY).equal(10);
    expect(bbox.maxX).equal(20);
    expect(bbox.maxY).equal(20);

    path.attr('path', p4);
    expect(path.getInnerBox()).eqls({
      x: 10,
      y: 0,
      width: 290,
      height: 300,
    });
  });

  it('getTotalLength', () => {
    path.attr('path', p1);
    expect(path.getTotalLength()).eqls(14.142135623730951);
    path.attr('path', p2);
    expect(path.getTotalLength()).eqls(22.955857143237814);
    path.attr('path', p3);
    expect(path.getTotalLength()).eqls(46.891433122566326);
    path.attr('path', p4);
    expect(path.getTotalLength()).eqls(258.5855635430996);
    path.attr('path', p5);
    expect(path.getTotalLength()).eqls(1577.9692907990257);
  });

  it('getPoint', () => {
    path.attr('path', p1);
    expect(path.getPoint(0)).eqls({
      x: 10,
      y: 10,
    });
    expect(path.getPoint(0.5)).eqls({
      x: 15,
      y: 15,
    });
    expect(path.getPoint(1)).eqls({
      x: 20,
      y: 20,
    });
    path.attr('path', p2);
    expect(path.getPoint(0)).eqls({
      x: 10,
      y: 10,
    });
    expect(path.getPoint(0.5)).eqls({
      x: 20,
      y: 14.999999999999998,
    });
    expect(path.getPoint(1)).eqls({
      x: 30,
      y: 10,
    });
    path.attr('path', p3);
    expect(path.getPoint(0)).eqls({
      x: 10,
      y: 10,
    });
    expect(path.getPoint(0.5)).eqls({
      x: 28.522547029794815,
      y: 17.365222549782033,
    });
    expect(path.getPoint(1)).eqls({
      x: 50,
      y: 20,
    });
    path.attr('path', p4);
    expect(path.getPoint(0)).eqls({
      x: 10,
      y: 10,
    });
    expect(path.getPoint(0.5)).eqls({
      x: 202.08037692855933,
      y: 202.08037692855933,
    });
    expect(path.getPoint(1)).eqls({
      x: 300,
      y: 300,
    });
    path.attr('path', p5);
    expect(path.getPoint(0)).eqls({
      x: 100,
      y: 300,
    });
    expect(path.getPoint(0.5)).eqls({
      x: 448.76286067241284,
      y: 30.42057291686797,
    });
    expect(path.getPoint(1)).eqls({
      x: 100,
      y: 300,
    });
  });

  it('getStartRangent and getEndTangent', () => {
    path.attr('path', p1);
    expect(path.getStartTangent()).eqls([
      [20, 20],
      [10, 10],
    ]);
    expect(path.getEndTangent()).eqls([
      [10, 10],
      [20, 20],
    ]);
    path.attr('path', p2);
    expect(path.getStartTangent()).eqls([
      [20, 20],
      [10, 10],
    ]);
    expect(path.getEndTangent()).eqls([
      [20, 20],
      [30, 10],
    ]);
    path.attr('path', p3);
    expect(path.getStartTangent()).eqls([
      [20, 20],
      [10, 10],
    ]);
    expect(path.getEndTangent()).eqls([
      [40, 30],
      [50, 20],
    ]);
    path.attr('path', p4);
    expect(path.getStartTangent()).eqls([
      [20, 20],
      [10, 10],
    ]);
    expect(path.getEndTangent()).eqls([
      [200, 200],
      [300, 300],
    ]);
    path.attr('path', p5);
    expect(path.getStartTangent()).eqls([
      [150, 275],
      [100, 300],
    ]);
    expect(path.getEndTangent()).eqls([
      [550, 275],
      [100, 300],
    ]);
  });
});
