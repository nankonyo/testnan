// testnan — OpenCode plugin (dual API, satu file). Mirror docsnan.mjs.
// V2: `id` + `setup`. V1: `server()`. Persist mode di `<config>/opencode/.testnan-active`.

import { createRequire } from 'module';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const require = createRequire(import.meta.url);
const { getTestnanInstructions } = require('../../hooks/testnan-instructions.cjs');
const { getDefaultMode, normalizePersistedMode } = require('../../hooks/testnan-config.cjs');
const { routeCommand } = require('../../hooks/testnan-command.cjs');
import { readFileSync } from 'fs';

function pluginVersion() {
  try {
    const pkg = JSON.parse(readFileSync(path.resolve(__dirname, '../../package.json'), 'utf8'));
    return typeof pkg.version === 'string' ? pkg.version : '?';
  } catch (e) {
    return '?';
  }
}

// ponytail: simpan state beside opencode config, sama seperti .docsnan-active.
const statePath = path.join(
  process.env.XDG_CONFIG_HOME || path.join(os.homedir(), '.config'),
  'opencode',
  '.testnan-active',
);

function readMode() {
  try {
    return normalizePersistedMode(fs.readFileSync(statePath, 'utf8').trim()) || getDefaultMode();
  } catch (e) {
    return getDefaultMode();
  }
}

function writeMode(mode) {
  fs.mkdirSync(path.dirname(statePath), { recursive: true });
  fs.writeFileSync(statePath, mode);
}

export function parseCommandFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return null;
  const description = match[1].match(/description:\s*(.+)/)?.[1]?.trim();
  return { description, template: match[2].trim() };
}

function frontmatterField(frontmatter, key) {
  const lines = frontmatter.split(/\r?\n/);
  const at = lines.findIndex((line) => line.startsWith(key + ':'));
  if (at === -1) return undefined;
  const value = lines[at].slice(key.length + 1).trim();
  if (value[0] !== '>' && value[0] !== '|') return value;
  const block = [];
  for (const line of lines.slice(at + 1)) {
    if (line.trim() && !/^\s/.test(line)) break;
    block.push(line.trim());
  }
  while (block.length && !block[block.length - 1]) block.pop();
  const joined = block.join(value[0] === '|' ? '\n' : ' ');
  return value.endsWith('-') ? joined : joined + '\n';
}

function readSkill() {
  const file = path.resolve(__dirname, '../../skills/testnan/SKILL.md');
  try {
    const content = fs.readFileSync(file, 'utf8');
    const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---[^\S\n]*\r?\n?([\s\S]*)$/);
    if (!match) return null;
    return {
      id: 'testnan',
      name: frontmatterField(match[1], 'name') || 'testnan',
      description:
        frontmatterField(match[1], 'description') ||
        'Wajibkan tiap ubah kode (semua bahasa) ditutup test di test/test_<slug>.*.',
      path: file,
      content: match[2],
    };
  } catch (e) {
    return null;
  }
}

function readCommands() {
  const dir = path.join(__dirname, '..', 'command');
  try {
    return fs
      .readdirSync(dir)
      .filter((file) => file.endsWith('.md'))
      .map((file) => {
        const parsed = parseCommandFile(path.join(dir, file));
        return parsed && { name: path.basename(file, '.md'), ...parsed };
      })
      .filter(Boolean);
  } catch (e) {
    return [];
  }
}

function versionTag() {
  return `(testnan ${readMode()} v${pluginVersion()})`;
}

async function server({ client } = {}) {
  const log = (level, message) => {
    try { client && client.app && client.app.log({ body: { service: 'testnan', level, message } }); } catch (e) {}
  };

  const skillsDir = path.resolve(__dirname, '../../skills');

  return {
    config: async (config) => {
      if (!config.command) config.command = {};
      for (const command of readCommands()) {
        config.command[command.name] = { description: command.description, template: command.template };
      }

      config.skills = config.skills || {};
      config.skills.paths = config.skills.paths || [];
      if (!config.skills.paths.includes(skillsDir)) {
        config.skills.paths.push(skillsDir);
      }
    },

    'experimental.chat.system.transform': async (_input, output) => {
      const mode = readMode();
      if (mode === 'off') return;
      output.system.push(getTestnanInstructions(mode));
    },

    'command.execute.before': async (input) => {
      if (!input || input.command !== 'testnan') return;
      const routed = routeCommand(input.arguments || '');
      if (routed.action === 'mode') {
        writeMode(routed.mode);
        log('info', 'testnan ' + routed.mode);
      } else if (routed.action === 'status') {
        log('info', 'testnan ' + readMode() + ' (v' + pluginVersion() + ')');
      } else if (routed.action === 'version') {
        log('info', 'testnan v' + pluginVersion());
      } else {
        log('info', 'testnan: unknown arg "' + routed.arg + '". Use on|off|version.');
      }
    },
  };
}

export default {
  id: 'testnan',

  async setup(ctx) {
    const skill = readSkill();
    if (skill) {
      await ctx.skill.transform((editor) => {
        editor.add(skill);
      });
    }

    const commands = readCommands();
    await ctx.command.transform((editor) => {
      for (const command of commands) {
        editor.add({
          name: command.name,
          description: command.description,
          execute: async ({ sessionID, prompt, delivery }) => {
            const routed = routeCommand(prompt.text || '');
            if (routed.action === 'mode') writeMode(routed.mode);
            let extra = versionTag();
            if (routed.action === 'unknown') {
              extra += `. Unknown arg "${routed.arg}". Use on|off|version.`;
            }
            await ctx.session.prompt({
              ...prompt,
              sessionID,
              text: command.template.replaceAll('$ARGUMENTS', prompt.text || '') + `\n\n${extra}`,
              delivery,
            });
          },
        });
      }
    });

    await ctx.session.hook('context', (event) => {
      const mode = readMode();
      if (mode === 'off') return;
      event.system.push({ type: 'text', text: getTestnanInstructions(mode) });
    });
  },

  server,
};
