import fs from 'fs';
import path from 'path';
import PortfolioWindow from '../components/PortfolioWindow';
import { FileNode } from '../components/FileExplorer';

export const dynamic = 'force-dynamic';

function getExplorerData(): FileNode[] {
  try {
    const dataDir = path.join(process.cwd(), '..', 'data');

    // 1. Parse projects.md
    const projectsPath = path.join(dataDir, 'projects.md');
    const projectsRaw = fs.readFileSync(projectsPath, 'utf-8');
    // Split sections on lines containing --- or \--- with optional carriage returns and spaces
    const projectSections = projectsRaw.split(/\r?\n\\?---\s*\r?\n/);
    
    const projectNodes: FileNode[] = [];
    for (const sec of projectSections) {
      const trimmed = sec.trim();
      if (!trimmed) continue;
      
      // Parse header line starting with # or \#
      const headerMatch = trimmed.match(/(?:^|\r?\n)\\?#\s*(.+)/);
      if (!headerMatch) continue;
      
      const title = headerMatch[1].trim();
      
      // Skip the master header section
      if (title.toLowerCase().includes('project portfolios')) {
        continue;
      }
      
      // Generate clean filename
      const fileName = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/(^_+|_+$)/g, '') + '.md';

      projectNodes.push({
        name: fileName,
        path: `projects/${fileName}`,
        type: 'file',
        language: 'markdown',
        content: trimmed
      });
    }

    // 2. Parse certifications.json
    const certsPath = path.join(dataDir, 'certifications.json');
    const certsRaw = fs.readFileSync(certsPath, 'utf-8');
    const certsArray = JSON.parse(certsRaw);
    
    const certNodes: FileNode[] = certsArray.map((cert: any) => {
      const fileName = cert.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/(^_+|_+$)/g, '') + '.json';
      
      return {
        name: fileName,
        path: `certifications/${fileName}`,
        type: 'file',
        language: 'json',
        content: JSON.stringify(cert, null, 2)
      };
    });

    // 3. Load tech_stack.json
    const techStackPath = path.join(dataDir, 'tech_stack.json');
    const techStackRaw = fs.readFileSync(techStackPath, 'utf-8');
    const techStackParsed = JSON.parse(techStackRaw);

    const techStackNodes: FileNode[] = [
      {
        name: 'languages_and_frameworks.json',
        path: 'tech_stack/languages_and_frameworks.json',
        type: 'file',
        language: 'json',
        content: JSON.stringify(techStackParsed, null, 2)
      }
    ];

    // 4. Load portfolio_blueprint.json
    const blueprintPath = path.join(dataDir, 'portfolio_blueprint.json');
    const blueprintRaw = fs.readFileSync(blueprintPath, 'utf-8');

    const blueprintNode: FileNode = {
      name: 'portfolio_blueprint.json',
      path: 'portfolio_blueprint.json',
      type: 'file',
      language: 'json',
      content: blueprintRaw
    };

    const welcomeNode: FileNode = {
      name: 'Welcome.md',
      path: 'welcome.md',
      type: 'file',
      language: 'markdown',
      content: `# Shahrukh Faisal\n\nAI Student @ Air University | Full-Stack Developer & Autonomous Agents Specialist\n\n## About Me\nI am an AI engineer focused on bridging full-stack systems with autonomous agentic architectures. Currently pursuing an Artificial Intelligence degree at Air University, Islamabad, I specialize in engineering localized RAG implementations, multi-agent orchestrations, and high-throughput asynchronous backend systems.\n\n## Engineering Highlights\n- **Core Focus**: Autonomous Agents & Workflows\n- **Systems**: Full-Stack Microservices\n- **Tooling Mastery**: LangChain, FastAPI, Next.js, n8n\n- **Local AI Setup**: Zero-Cloud Privacy Ingestion`
    };

    // Combine into unified file tree
    return [
      welcomeNode,
      {
        name: 'projects',
        path: 'projects',
        type: 'folder',
        children: projectNodes
      },
      {
        name: 'certifications',
        path: 'certifications',
        type: 'folder',
        children: certNodes
      },
      {
        name: 'tech_stack',
        path: 'tech_stack',
        type: 'folder',
        children: techStackNodes
      },
      blueprintNode
    ];
  } catch (err) {
    console.error("Error reading file tree data files:", err);
    return [];
  }
}

export default function Page() {
  const explorerData = getExplorerData();
  return <PortfolioWindow initialExplorerData={explorerData} />;
}
