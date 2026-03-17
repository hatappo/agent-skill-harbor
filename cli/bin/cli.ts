#!/usr/bin/env node

export {};

const USAGE = `agent-skill-harbor CLI

Usage: harbor <command>

Commands:
  init      Scaffold a new project
  gen       Generate optional project templates
  collect   Collect skills from GitHub organization
  post-collect Run collect follow-up plugins
  build     Build the web catalog (static site)
  deploy    Deploy the built catalog
  dev       Start development server
  preview   Preview the built site

Options:
  --help    Show this help message`;

const command = process.argv[2];

switch (command) {
	case 'init':
		await import('../src/cli/commands/init.js');
		break;
	case 'gen':
		await import('../src/cli/commands/gen.js');
		break;
	case 'collect':
		await import('../src/cli/commands/collect.js');
		break;
	case 'post-collect':
		await import('../src/cli/commands/post-collect.js');
		break;
	case 'build':
		await import('../src/cli/commands/build.js');
		break;
	case 'deploy':
		await import('../src/cli/commands/deploy.js');
		break;
	case 'dev':
		await import('../src/cli/commands/dev.js');
		break;
	case 'preview':
		await import('../src/cli/commands/preview.js');
		break;
	default:
		console.log(USAGE);
		if (command && command !== '--help' && command !== '-h') {
			console.error(`\nUnknown command: ${command}`);
			process.exit(1);
		}
		break;
}
