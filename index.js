// testnan — root entrypoint untuk OpenCode V2.
// Loader opencode resolve direktori plugin lokal ke <dir>/index.js
// (pola sama seperti caveman/docsnan). Teruskan ke entry .mjs.
import plugin, { parseCommandFile } from './.opencode/plugins/testnan.mjs';

export default plugin;
export { parseCommandFile };
