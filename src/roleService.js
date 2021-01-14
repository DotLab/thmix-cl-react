
const ROLE_MIDI_MOD = 'midi-mod';
const ROLE_MIDI_ADMIN = 'midi-admin';
const ROLE_CARD_MOD = 'card-mod';
const ROLE_CARD_ADMIN = 'card-admin';
const ROLE_CARDPOOL_MOD = 'cardPool-mod';
const ROLE_TRANSLATION_MOD = 'translation-mod';
const ROLE_SITE_OWNER = 'site-owner';
const ROLE_ROOT = 'root';
exports.ROLE_MIDI_MOD = ROLE_MIDI_MOD;
exports.ROLE_MIDI_ADMIN = ROLE_MIDI_ADMIN;
exports.ROLE_CARD_MOD = ROLE_CARD_MOD;
exports.ROLE_CARD_ADMIN = ROLE_CARD_ADMIN;
exports.ROLE_CARDPOOL_MOD = ROLE_CARDPOOL_MOD;
exports.ROLE_TRANSLATION_MOD = ROLE_TRANSLATION_MOD;
exports.ROLE_SITE_OWNER = ROLE_SITE_OWNER;
exports.ROLE_ROOT = ROLE_ROOT;

const ROLE_PARENT_DICT = {
  [ROLE_MIDI_MOD]: ROLE_MIDI_ADMIN,
  [ROLE_MIDI_ADMIN]: ROLE_SITE_OWNER,

  [ROLE_CARD_MOD]: ROLE_CARD_ADMIN,
  [ROLE_CARD_ADMIN]: ROLE_SITE_OWNER,

  [ROLE_CARDPOOL_MOD]: ROLE_SITE_OWNER,

  [ROLE_TRANSLATION_MOD]: ROLE_SITE_OWNER,

  [ROLE_SITE_OWNER]: ROLE_ROOT,
};
exports.ROLE_PARENT_DICT = ROLE_PARENT_DICT;

/**
 * @param {String[]} roles
 * @param {String} role
 * @return {Boolean}
 */
function checkUserRole(roles, role) {
  if (!roles || roles.length === 0) {
    return false;
  }
  if (roles.includes(role)) {
    return true;
  }
  while (ROLE_PARENT_DICT[role]) {
    role = ROLE_PARENT_DICT[role];
    if (roles.includes(role)) return true;
  }
  return false;
}
exports.checkUserRole = checkUserRole;
