const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const defaultRepoDir = path.resolve(rootDir, '..', 'vscode-repo');
const defaultScopePath = 'extensions/json-language-features';
const defaultRemote = 'origin';
const defaultBranch = 'main';

function parseArgs(argv) {
  const options = {
    repo: defaultRepoDir,
    scopePath: defaultScopePath,
    remote: defaultRemote,
    branch: defaultBranch,
    fetch: true,
    output: null,
    from: null,
    to: null,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    switch (arg) {
      case '--repo':
        options.repo = argv[++index];
        break;
      case '--path':
        options.scopePath = argv[++index];
        break;
      case '--remote':
        options.remote = argv[++index];
        break;
      case '--branch':
        options.branch = argv[++index];
        break;
      case '--from':
        options.from = argv[++index];
        break;
      case '--to':
        options.to = argv[++index];
        break;
      case '--output':
        options.output = argv[++index];
        break;
      case '--no-fetch':
        options.fetch = false;
        break;
      case '--help':
      case '-h':
        printHelp();
        process.exit(0);
      default:
        throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return options;
}

function printHelp() {
  console.log(`Fetch all changes in vscode ${defaultScopePath} since last-upstream-hash.

Usage:
  node scripts/fetch-vscode-json-language-features-changes.cjs [options]

Options:
  --repo <path>      Path to the vscode repo. Default: ../vscode-repo
  --path <path>      Repo subpath to inspect. Default: ${defaultScopePath}
  --remote <name>    Remote to fetch from. Default: ${defaultRemote}
  --branch <name>    Branch to compare against. Default: ${defaultBranch}
  --from <ref>       Start ref. Default: contents of last-upstream-hash
  --to <ref>         End ref. Default: <remote>/<branch> after fetch, else HEAD
  --output <file>    Write output to a file instead of stdout
  --no-fetch         Skip git fetch before collecting changes
  --help, -h         Show this help
`);
}

function runGit(repoDir, args, options = {}) {
  return execFileSync('git', ['-C', repoDir, ...args], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    maxBuffer: 1024 * 1024 * 50,
    ...options,
  }).trimEnd();
}

function requireArgValue(flag, value) {
  if (!value || value.startsWith('--')) {
    throw new Error(`Missing value for ${flag}`);
  }
}

function validateArgs(argv) {
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (['--repo', '--path', '--remote', '--branch', '--from', '--to', '--output'].includes(arg)) {
      requireArgValue(arg, argv[index + 1]);
    }
  }
}

function ensureRepo(repoDir) {
  if (!fs.existsSync(repoDir)) {
    throw new Error(`vscode repo not found: ${repoDir}`);
  }

  const isRepo = runGit(repoDir, ['rev-parse', '--is-inside-work-tree']);
  if (isRepo !== 'true') {
    throw new Error(`Not a git repository: ${repoDir}`);
  }
}

function readLastUpstreamHash() {
  const hashFile = path.join(rootDir, 'last-upstream-hash');
  if (!fs.existsSync(hashFile)) {
    throw new Error(`Missing last-upstream-hash file: ${hashFile}`);
  }

  const hash = fs.readFileSync(hashFile, 'utf8').trim();
  if (!hash) {
    throw new Error(`last-upstream-hash is empty: ${hashFile}`);
  }

  return hash;
}

function resolveRef(repoDir, ref) {
  return runGit(repoDir, ['rev-parse', ref]);
}

function collectChanges(repoDir, fromRef, toRef, scopePath) {
  return runGit(repoDir, [
    'log',
    '--reverse',
    '--stat',
    '--patch',
    '--full-index',
    '--find-renames',
    '--find-copies',
    '--format=commit %H%nAuthor: %an <%ae>%nDate: %ad%nSubject: %s%n',
    `${fromRef}..${toRef}`,
    '--',
    scopePath,
  ]);
}

function writeOutput(output, destination) {
  if (!destination) {
    process.stdout.write(output.endsWith('\n') ? output : `${output}\n`);
    return;
  }

  const resolvedOutput = path.resolve(rootDir, destination);
  fs.mkdirSync(path.dirname(resolvedOutput), { recursive: true });
  fs.writeFileSync(resolvedOutput, output);
  process.stderr.write(`Wrote changes to ${resolvedOutput}\n`);
}

function main() {
  validateArgs(process.argv.slice(2));
  const options = parseArgs(process.argv.slice(2));
  const repoDir = path.resolve(rootDir, options.repo);

  ensureRepo(repoDir);

  if (options.fetch) {
    process.stderr.write(`Fetching ${options.remote}/${options.branch} from ${repoDir}\n`);
    runGit(repoDir, ['fetch', options.remote, options.branch]);
  }

  const fromRef = options.from || readLastUpstreamHash();
  const toRef = options.to || (options.fetch ? `${options.remote}/${options.branch}` : 'HEAD');
  const resolvedFrom = resolveRef(repoDir, fromRef);
  const resolvedTo = resolveRef(repoDir, toRef);
  const logBody = collectChanges(repoDir, resolvedFrom, resolvedTo, options.scopePath);
  const header = [
    `Repository: ${repoDir}`,
    `Path: ${options.scopePath}`,
    `From: ${fromRef} (${resolvedFrom})`,
    `To: ${toRef} (${resolvedTo})`,
    '',
  ].join('\n');

  writeOutput(`${header}${logBody}`.trimEnd(), options.output);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
}