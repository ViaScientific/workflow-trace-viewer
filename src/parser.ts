import fs from 'fs';
import path from 'path';

export interface Task {
  name: string;
  duration: string;
  memory: string;
  cpu: string;
}

export interface TaskGroup {
  baseName: string;
  tasks: Task[];
}

export function parseTraceFile(filePath: string): TaskGroup[] {
  const content = fs.readFileSync(path.resolve(filePath), 'utf-8');
  const lines = content.trim().split(/\r?\n/);

  const header = lines.shift()?.split('\t');
  if (!header) throw new Error('Empty or malformed trace file');

  const groupsMap: Record<string, Task[]> = {};

  for (const line of lines) {
    const cols = line.split('\t');
    const name = cols[0].trim();
    const duration = cols[10]?.trim() || '';
    const memory = cols[18]?.trim() || '';
    const cpu = cols[17]?.trim().replace('%', '') || '0';

    const task: Task = { name, duration, memory, cpu };

    const baseMatch = name.match(/^(.*?)(?: \(\d+\))?$/);
    const baseName = baseMatch ? baseMatch[1] : name;

    if (!groupsMap[baseName]) groupsMap[baseName] = [];
    groupsMap[baseName].push(task);
  }

  const groups: TaskGroup[] = Object.entries(groupsMap).map(([baseName, tasks]: [string, Task[]]) => ({
    baseName,
    tasks,
  }));

  return groups;
}

