/*
 * Base icon styles that are used and extended across
 * various elements.
 */

var iconSpriteUrl = 'https://s3.amazonaws.com/sprintly-ui-icons/icons-sprite.png';

var IconBaseStyles = {
  small: {
    display: 'block',
    height: '8px',
    width: '8px',
    backgroundImage: 'url(' + iconSpriteUrl + ')',
    backgroundRepeat: 'no-repeat'
  },

  medium: {
    display: 'block',
    height: '16px',
    width: '16px',
    backgroundImage: 'url(' + iconSpriteUrl + ')',
    backgroundRepeat: 'no-repeat'
  }
};

module.exports = IconBaseStyles;