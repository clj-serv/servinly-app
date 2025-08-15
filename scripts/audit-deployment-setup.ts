// scripts/audit-deployment-setup.ts
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

function sh(cmd: string) {
  try { return execSync(cmd, { stdio: ['ignore','pipe','pipe'] }).toString().trim(); }
  catch (e:any) { return `ERROR: ${e.message}`; }
}

function readJSON(p: string) {
  try { return JSON.parse(fs.readFileSync(p,'utf8')); } catch { return null; }
}

function readText(p: string) {
  try { return fs.readFileSync(p,'utf8'); } catch { return null; }
}

function pickEnv(keys: string[], src: string) {
  if (!src) return [];
  const out: string[] = [];
  for (const line of src.split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.+)\s*$/);
    if (m && keys.includes(m[1])) out.push(`${m[1]}=${m[2]}`);
  }
  return out;
}

const now = new Date().toISOString().replace(/[:T]/g,'-').slice(0,19);
const reportDir = path.join('reports');
fs.mkdirSync(reportDir, { recursive: true });
const out = (s:string) => fs.appendFileSync(path.join(reportDir, `deployment-audit-${now}.md`), s);

const gitBranch = sh('git rev-parse --abbrev-ref HEAD');
const gitBranches = sh('git branch -a --verbose --no-abbrev --decorate');
const gitRemote = sh('git remote -v');
const ghWorkflows = sh('ls -1 .github/workflows 2>/dev/null || true');
const vercelJson = readJSON('vercel.json');
const envLocal = readText('.env.local') ?? '';
const envExample = readText('.env.example') ?? '';
const supaToml = readText('supabase/config.toml') ?? '';
const hasSupabaseDir = fs.existsSync('supabase');

const vercelToken = process.env.VERCEL_TOKEN ? 'present' : 'missing';
const supabaseToken = process.env.SUPABASE_ACCESS_TOKEN ? 'present' : 'missing';

// Try optional Vercel + Supabase introspection (best-effort; may be ERROR without tokens)
const vercelProject = sh('npx -y vercel project ls --token "$VERCEL_TOKEN" 2>/dev/null | head -n 20');
const vercelEnv = sh('npx -y vercel env ls --token "$VERCEL_TOKEN" 2>/dev/null');
const supabaseProjects = sh('npx -y supabase projects list 2>/dev/null | head -n 50');

const keys = [
  'NEXT_PUBLIC_SUPABASE_URL','NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY','NEXT_PUBLIC_ONB_SUPABASE_SAVE'
];
const envLocalPicked = pickEnv(keys, envLocal);
const envExamplePicked = pickEnv(keys, envExample);

// Write report
out(`# Deployment Audit Report\n\n`);
out(`Generated: ${new Date().toString()}\n\n`);
out(`## Git\n`);
out(`- Current branch: \`${gitBranch}\`\n`);
out(`- Remotes:\n\`\`\`\n${gitRemote}\n\`\`\`\n`);
out(`- Branches:\n\`\`\`\n${gitBranches}\n\`\`\`\n`);

out(`## CI (GitHub Actions)\n`);
out(ghWorkflows.startsWith('ERROR') ? `- No workflows dir found.\n` : `- Workflows:\n\`\`\`\n${ghWorkflows}\n\`\`\`\n`);

out(`## Vercel\n`);
out(`- vercel.json present: ${vercelJson ? 'yes' : 'no'}\n`);
out(`- VERCEL_TOKEN: ${vercelToken}\n`);
out(`- Project list (best-effort):\n\`\`\`\n${vercelProject}\n\`\`\`\n`);
out(`- Env list (best-effort):\n\`\`\`\n${vercelEnv}\n\`\`\`\n`);

out(`## Supabase\n`);
out(`- supabase/ dir present: ${hasSupabaseDir ? 'yes' : 'no'}\n`);
out(`- supabase/config.toml present: ${supaToml ? 'yes' : 'no'}\n`);
out(`- SUPABASE_ACCESS_TOKEN: ${supabaseToken}\n`);
out(`- Projects (best-effort):\n\`\`\`\n${supabaseProjects}\n\`\`\`\n`);

out(`## Local Env Keys (.env.local)\n\`\`\`\n${envLocalPicked.join('\n') || '(none found)'}\n\`\`\`\n`);
out(`## Template Env Keys (.env.example)\n\`\`\`\n${envExamplePicked.join('\n') || '(none found)'}\n\`\`\`\n`);

out(`## Observations\n`);
out(`- Expect one Git branch per deploy lane: \`staging\` → servinly-staging (Preview), \`main\` → servinly (Prod).${'\n'}`);
out(`- Verify CI triggers and Vercel mappings align with that workflow before making changes.\n`);
console.log(`Report written to reports/deployment-audit-${now}.md`);
