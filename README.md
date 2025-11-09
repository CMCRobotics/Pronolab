# Pronolab

A web UI orchestrator to assess machine learning models.

It features the following components :

* A Web UI view to perform in-situ data collection and predictions.
* A controller that orchestrates remote UI views and collects prediction results.

Both components exist as Homie devices, controlled over MQTT / Websocket.

## Homie Devices

### `terminal-{deviceId}`

This device represents the Web UI view.

| Node | Property | Type | Direction | Description |
|---|---|---|---|---|
| `statistics` | `prompt-results/log` | String | R | Log of the prompt results. |
| `ui-control` | `model-type/set` | String | W | Sets the model type. Can be `image`, `audio`, or `pose`. |
| | `switch/set` | String | W | Switches the view. Can be `model-test`. |
| | `model-test/set` | String | W | Starts a test sequence. |
| `team-id` | `set` | String | W | Sets the team ID for the terminal. |

### `team-{teamId}`

This device represents a team.

| Node | Property | Type | Direction | Description |
|---|---|---|---|---|
| `info` | `name` | String | R | The name of the team. |
| | `id` | String | R | The ID of the team. |
