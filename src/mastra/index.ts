
import { Mastra } from '@mastra/core/mastra';
import { LibSQLStore } from '@mastra/libsql';
import { weatherAgent } from './agents/weather-agent';
import { weatherTool } from './tools/weather-tool';
import { MastraEditor } from "@mastra/editor";

export const mastra = new Mastra({
  agents: { weatherAgent },
  storage: new LibSQLStore({
    id: 'mastra-storage',
    url: 'file:./mastra.db',
  }),
  editor: new MastraEditor({ source: 'code' }),
  tools: { 'weather-tool': weatherTool },
});