const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const WebSocket = require('ws');
const fs = require('fs-extra');
const { selectBuildpack } = require('./discovery-service/selector');
const { generateSpec } = require('./llm-reasoner/utils');
const { scaffoldApp } = require('./code-generator/scaffold');
const { deploySandbox } = require('./sandbox/deploy');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(bodyParser.json());
const PORT = process.env.PORT || 5000;

const wss = new WebSocket.Server({ noServer: true });
const clients = new Set();
wss.on('connection', ws => {
  clients.add(ws);
  ws.on('close', () => clients.delete(ws));
});

function broadcast(message) {
  const data = JSON.stringify(message);
  clients.forEach(ws => ws.send(data));
}

app.post('/api/apps/create', async (req, res) => {
  const { description } = req.body;
  const diaryId = uuidv4();
  const diaryPath = `./dev-diary/${diaryId}.json`;
  const devDiary = { entry_id: diaryId, user_description: description, steps: [] };

  broadcast({ stage: 'thinking', message: 'Analyzing description...' });
  const selectorResult = selectBuildpack(description);
  devDiary.steps.push({ stage: 'selector', output: selectorResult });

  broadcast({ stage: 'designing', message: 'Generating app specification...' });
  const spec = await generateSpec(description, selectorResult.selected);
  // broadcast optional features with delay
  spec.optional_features.forEach((feature, index) => {
    setTimeout(() => {
      broadcast({ stage: 'designing', message: `Adding optional feature: ${feature}` });
    }, 1000 * (index + 1));
  });
  devDiary.steps.push({ stage: 'llm_reasoner', output: { spec, decision_trace: spec.decision_trace } });

  broadcast({ stage: 'coding', message: 'Scaffolding code...' });
  const scaffoldResult = scaffoldApp(spec);
  devDiary.steps.push({ stage: 'code_generation', output: scaffoldResult });

  broadcast({ stage: 'deploying', message: 'Deploying sandbox...' });
  const deployResult = deploySandbox(spec.app_name);
  devDiary.steps.push({ stage: 'sandbox_deploy', output: deployResult });

  await fs.ensureDir('./dev-diary');
  await fs.writeJson(diaryPath, devDiary, { spaces: 2 });

  res.json({ spec, devDiary, sandbox: deployResult });
});

const server = app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, ws => wss.emit('connection', ws, request));
});