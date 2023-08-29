export interface GetpositionCSSProps {
  pos?: {
    top?: string;
    left?: string;
    bottom?: string;
    right?: string;
  };
}

const getPositionCSS = (pos: GetpositionCSSProps): string => {
  return Object.entries(pos)
    .map(([key, value]) =>
      ['top', 'left', 'right', 'bottom'].includes(key)
        ? `${key}: ${value};`
        : '',
    )
    .join('');
};

export default getPositionCSS;
