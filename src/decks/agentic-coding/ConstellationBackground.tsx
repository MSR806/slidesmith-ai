import { useEffect, useState } from 'react';

type ConstellationPoint = { x: number; y: number };
type ConstellationCluster = {
  className: string;
  duration: number;
  links: [number, number][];
  nodes: ConstellationPoint[][];
  radii: number[];
};

const constellationClusters: ConstellationCluster[] = [
  {
    className: 'cluster-a',
    duration: 7,
    links: [[0, 1], [1, 2], [0, 2]],
    radii: [1.2, 1.1, 1.3],
    nodes: [
      [{ x: 858, y: 116 }, { x: 888, y: 96 }, { x: 842, y: 136 }, { x: 858, y: 116 }],
      [{ x: 956, y: 75 }, { x: 940, y: 132 }, { x: 1002, y: 90 }, { x: 956, y: 75 }],
      [{ x: 1015, y: 120 }, { x: 980, y: 162 }, { x: 1038, y: 102 }, { x: 1015, y: 120 }],
    ],
  },
  {
    className: 'cluster-b',
    duration: 8,
    links: [[0, 1], [1, 2], [0, 2], [2, 3]],
    radii: [1.2, 1.1, 1.2, 1.1],
    nodes: [
      [{ x: 470, y: 286 }, { x: 490, y: 324 }, { x: 452, y: 306 }, { x: 470, y: 286 }],
      [{ x: 515, y: 323 }, { x: 548, y: 278 }, { x: 500, y: 358 }, { x: 515, y: 323 }],
      [{ x: 572, y: 292 }, { x: 592, y: 334 }, { x: 535, y: 276 }, { x: 572, y: 292 }],
      [{ x: 612, y: 343 }, { x: 576, y: 374 }, { x: 632, y: 316 }, { x: 612, y: 343 }],
    ],
  },
  {
    className: 'cluster-c',
    duration: 9,
    links: [[0, 1], [1, 2]],
    radii: [1.2, 1.1, 1.3],
    nodes: [
      [{ x: 466, y: 508 }, { x: 498, y: 538 }, { x: 452, y: 548 }, { x: 466, y: 508 }],
      [{ x: 532, y: 530 }, { x: 558, y: 492 }, { x: 506, y: 570 }, { x: 532, y: 530 }],
      [{ x: 586, y: 590 }, { x: 612, y: 552 }, { x: 558, y: 620 }, { x: 586, y: 590 }],
    ],
  },
  {
    className: 'cluster-d',
    duration: 6,
    links: [[0, 1]],
    radii: [1, 1],
    nodes: [
      [{ x: 205, y: 34 }, { x: 226, y: 52 }, { x: 190, y: 58 }, { x: 205, y: 34 }],
      [{ x: 235, y: 61 }, { x: 210, y: 88 }, { x: 256, y: 42 }, { x: 235, y: 61 }],
    ],
  },
  {
    className: 'cluster-e',
    duration: 7,
    links: [[0, 1], [1, 2], [2, 3]],
    radii: [1.1, 1.2, 1.1, 1],
    nodes: [
      [{ x: 670, y: 96 }, { x: 694, y: 68 }, { x: 646, y: 116 }, { x: 670, y: 96 }],
      [{ x: 720, y: 65 }, { x: 750, y: 104 }, { x: 698, y: 118 }, { x: 720, y: 65 }],
      [{ x: 758, y: 112 }, { x: 724, y: 144 }, { x: 778, y: 78 }, { x: 758, y: 112 }],
      [{ x: 704, y: 138 }, { x: 668, y: 118 }, { x: 736, y: 164 }, { x: 704, y: 138 }],
    ],
  },
  {
    className: 'cluster-f',
    duration: 8,
    links: [[0, 1], [1, 2]],
    radii: [1.1, 1.2, 1.1],
    nodes: [
      [{ x: 120, y: 360 }, { x: 148, y: 330 }, { x: 106, y: 386 }, { x: 120, y: 360 }],
      [{ x: 174, y: 333 }, { x: 198, y: 378 }, { x: 150, y: 350 }, { x: 174, y: 333 }],
      [{ x: 214, y: 384 }, { x: 178, y: 410 }, { x: 236, y: 350 }, { x: 214, y: 384 }],
    ],
  },
  {
    className: 'cluster-g',
    duration: 9,
    links: [[0, 1], [1, 2], [2, 3]],
    radii: [1.1, 1.2, 1.1, 1.2],
    nodes: [
      [{ x: 930, y: 432 }, { x: 962, y: 404 }, { x: 910, y: 460 }, { x: 930, y: 432 }],
      [{ x: 985, y: 392 }, { x: 1012, y: 438 }, { x: 948, y: 420 }, { x: 985, y: 392 }],
      [{ x: 1040, y: 444 }, { x: 1004, y: 470 }, { x: 1070, y: 402 }, { x: 1040, y: 444 }],
      [{ x: 1095, y: 405 }, { x: 1060, y: 382 }, { x: 1120, y: 438 }, { x: 1095, y: 405 }],
    ],
  },
  {
    className: 'cluster-h',
    duration: 7,
    links: [[0, 1], [1, 2]],
    radii: [1.1, 1.2, 1.1],
    nodes: [
      [{ x: 230, y: 594 }, { x: 252, y: 560 }, { x: 210, y: 620 }, { x: 230, y: 594 }],
      [{ x: 282, y: 555 }, { x: 316, y: 590 }, { x: 250, y: 585 }, { x: 282, y: 555 }],
      [{ x: 328, y: 610 }, { x: 294, y: 638 }, { x: 350, y: 574 }, { x: 328, y: 610 }],
    ],
  },
  {
    className: 'cluster-i',
    duration: 6,
    links: [[0, 1], [1, 2]],
    radii: [1.1, 1.2, 1.1],
    nodes: [
      [{ x: 760, y: 535 }, { x: 786, y: 508 }, { x: 742, y: 562 }, { x: 760, y: 535 }],
      [{ x: 806, y: 508 }, { x: 832, y: 548 }, { x: 778, y: 546 }, { x: 806, y: 508 }],
      [{ x: 853, y: 548 }, { x: 820, y: 578 }, { x: 876, y: 518 }, { x: 853, y: 548 }],
    ],
  },
];

function coordinateValues(points: ConstellationPoint[], coordinate: 'x' | 'y') {
  return points.map((point) => point[coordinate]).join('; ');
}

export function ConstellationBackground() {
  const [reduceMotion, setReduceMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduceMotion(media.matches);

    onChange();
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  return (
    <svg className="constellation-bg" viewBox="0 0 1200 700" preserveAspectRatio="none" aria-hidden="true">
      {constellationClusters.map((cluster) => (
        <g key={cluster.className} className={`constellation-cluster ${cluster.className}`}>
          {cluster.links.map(([from, to], index) => {
            const fromPath = cluster.nodes[from];
            const toPath = cluster.nodes[to];

            return (
              <line
                key={`${cluster.className}-link-${index}`}
                className="constellation-link"
                x1={fromPath[0].x}
                y1={fromPath[0].y}
                x2={toPath[0].x}
                y2={toPath[0].y}
              >
                {!reduceMotion && (
                  <>
                    <animate attributeName="x1" values={coordinateValues(fromPath, 'x')} dur={`${cluster.duration}s`} repeatCount="indefinite" />
                    <animate attributeName="y1" values={coordinateValues(fromPath, 'y')} dur={`${cluster.duration}s`} repeatCount="indefinite" />
                    <animate attributeName="x2" values={coordinateValues(toPath, 'x')} dur={`${cluster.duration}s`} repeatCount="indefinite" />
                    <animate attributeName="y2" values={coordinateValues(toPath, 'y')} dur={`${cluster.duration}s`} repeatCount="indefinite" />
                  </>
                )}
              </line>
            );
          })}

          {cluster.nodes.map((path, index) => (
            <circle
              key={`${cluster.className}-node-${index}`}
              className="constellation-node"
              cx={path[0].x}
              cy={path[0].y}
              r={cluster.radii[index]}
            >
              {!reduceMotion && (
                <>
                  <animate attributeName="cx" values={coordinateValues(path, 'x')} dur={`${cluster.duration}s`} repeatCount="indefinite" />
                  <animate attributeName="cy" values={coordinateValues(path, 'y')} dur={`${cluster.duration}s`} repeatCount="indefinite" />
                </>
              )}
            </circle>
          ))}
        </g>
      ))}
    </svg>
  );
}
