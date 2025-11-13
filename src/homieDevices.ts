import { HomieDevice, HomieNode, HomieProperty } from '@cmcrobotics/homie-lit';

// --- Pronolab Terminal Device ---
// Represents the Web UI view.
const terminalDevice = new HomieDevice('terminal-001', 'Pronolab Terminal'); // Using a generic ID, can be dynamic

// Node for statistics
const statisticsNode = new HomieNode('statistics', 'Statistics', 'stats');
const promptLogProperty = new HomieProperty('prompt-results/log', 'Prompt Log', 'string', false); // R: Log of the prompt results.
statisticsNode.addProperty(promptLogProperty);
terminalDevice.addNode(statisticsNode);

// Node for UI control
const uiControlNode = new HomieNode('ui-control', 'UI Control', 'control');
const modelTypeSetProperty = new HomieProperty('model-type/set', 'Model Type', 'string', true); // W: Sets the model type. Can be 'image', 'audio', or 'pose'.
const switchSetProperty = new HomieProperty('switch/set', 'Switch', 'string', true); // W: Switches the view. Can be 'model-test'.
const modelTestSetProperty = new HomieProperty('model-test/set', 'Model Test', 'string', true); // W: Starts a test sequence.
uiControlNode.addProperty(modelTypeSetProperty);
uiControlNode.addProperty(switchSetProperty);
uiControlNode.addProperty(modelTestSetProperty);
terminalDevice.addNode(uiControlNode);

// Node for team ID
const teamIdNode = new HomieNode('team-id', 'Team ID', 'config');
const teamIdSetProperty = new HomieProperty('set', 'Team ID', 'string', true); // W: Sets the team ID for the terminal.
teamIdNode.addProperty(teamIdSetProperty);
terminalDevice.addNode(teamIdNode);

// --- Pronolab Team Device ---
// Represents a team.
const teamDevice = new HomieDevice('team-abc', 'Pronolab Team'); // Using a generic ID, can be dynamic

// Node for team info
const infoNode = new HomieNode('info', 'Info', 'info');
const teamNameProperty = new HomieProperty('name', 'Name', 'string', false); // R: The name of the team.
const teamIdInfoProperty = new HomieProperty('id', 'ID', 'string', false); // R: The ID of the team.
infoNode.addProperty(teamNameProperty);
infoNode.addProperty(teamIdInfoProperty);
teamDevice.addNode(infoNode);

// Export the devices for use in other parts of the application
export {
  terminalDevice,
  statisticsNode,
  promptLogProperty,
  uiControlNode,
  modelTypeSetProperty,
  switchSetProperty,
  modelTestSetProperty,
  teamIdNode,
  teamIdSetProperty,
  teamDevice,
  infoNode,
  teamNameProperty,
  teamIdInfoProperty
};
