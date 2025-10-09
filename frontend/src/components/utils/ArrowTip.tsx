import React from 'react';

type Position =
  | 'left'
  | 'left-top'
  | 'left-bottom'
  | 'right'
  | 'right-top'
  | 'right-bottom'
  | 'top'
  | 'top-left'
  | 'top-right'
  | 'bottom'
  | 'bottom-left'
  | 'bottom-right';

type Props = {
  position?: Position;
  size?: number; // em px (ex: 8)
  color?: string; // ex: 'var(--system-white)'
  offset?: number; // distância do topo/esquerda em px quando usar *-top/*-left etc
  zIndex?: number;
  style?: React.CSSProperties;
  className?: string;
};

const ArrowTip: React.FC<Props> = ({
  position = 'left',
  size = 8,
  color = 'var(--system-white)',
  offset = 12,
  zIndex = 20,
  style,
  className,
}) => {
  const s = Math.max(1, Math.round(size));
  const transparent = `${s}px solid transparent`;
  const common: React.CSSProperties = {
    position: 'absolute',
    width: 0,
    height: 0,
    zIndex,
    filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.08))',
  };

  const posStyle: React.CSSProperties = {};

  switch (position) {
    case 'left':
      Object.assign(posStyle, {
        left: -s,
        top: '50%',
        transform: 'translateY(-50%)',
        borderTop: transparent,
        borderBottom: transparent,
        borderRight: `${s}px solid ${color}`,
      });
      break;
    case 'left-top':
      Object.assign(posStyle, {
        left: -s,
        top: offset,
        transform: 'none',
        borderTop: transparent,
        borderBottom: transparent,
        borderRight: `${s}px solid ${color}`,
      });
      break;
    case 'left-bottom':
      Object.assign(posStyle, {
        left: -s,
        bottom: offset,
        transform: 'none',
        borderTop: transparent,
        borderBottom: transparent,
        borderRight: `${s}px solid ${color}`,
      });
      break;

    case 'right':
      Object.assign(posStyle, {
        right: -s,
        top: '50%',
        transform: 'translateY(-50%)',
        borderTop: transparent,
        borderBottom: transparent,
        borderLeft: `${s}px solid ${color}`,
      });
      break;
    case 'right-top':
      Object.assign(posStyle, {
        right: -s,
        top: offset,
        transform: 'none',
        borderTop: transparent,
        borderBottom: transparent,
        borderLeft: `${s}px solid ${color}`,
      });
      break;
    case 'right-bottom':
      Object.assign(posStyle, {
        right: -s,
        bottom: offset,
        transform: 'none',
        borderTop: transparent,
        borderBottom: transparent,
        borderLeft: `${s}px solid ${color}`,
      });
      break;

    case 'top':
      Object.assign(posStyle, {
        top: -s,
        left: '50%',
        transform: 'translateX(-50%)',
        borderLeft: transparent,
        borderRight: transparent,
        borderBottom: `${s}px solid ${color}`,
      });
      break;
    case 'top-left':
      Object.assign(posStyle, {
        top: -s,
        left: offset,
        transform: 'none',
        borderLeft: transparent,
        borderRight: transparent,
        borderBottom: `${s}px solid ${color}`,
      });
      break;
    case 'top-right':
      Object.assign(posStyle, {
        top: -s,
        right: offset,
        transform: 'none',
        borderLeft: transparent,
        borderRight: transparent,
        borderBottom: `${s}px solid ${color}`,
      });
      break;

    case 'bottom':
      Object.assign(posStyle, {
        bottom: -s,
        left: '50%',
        transform: 'translateX(-50%)',
        borderLeft: transparent,
        borderRight: transparent,
        borderTop: `${s}px solid ${color}`,
      });
      break;
    case 'bottom-left':
      Object.assign(posStyle, {
        bottom: -s,
        left: offset,
        transform: 'none',
        borderLeft: transparent,
        borderRight: transparent,
        borderTop: `${s}px solid ${color}`,
      });
      break;
    case 'bottom-right':
      Object.assign(posStyle, {
        bottom: -s,
        right: offset,
        transform: 'none',
        borderLeft: transparent,
        borderRight: transparent,
        borderTop: `${s}px solid ${color}`,
      });
      break;
  }

  return <div className={className} style={{ ...common, ...posStyle, ...style }} />;
};

export default ArrowTip;
