import { Client } from 'mqtt';
import { BaseView } from './base-view';
import { logger } from '../logger';

interface Team {
    id: string;
    name: string;
}

export class TeamView extends BaseView {
    private teams: Team[] = [];
    private onTeamSelected: () => void;

    constructor(container: HTMLElement, mqtt: Client, onTeamSelected: () => void) {
        super(container, mqtt);
        this.onTeamSelected = onTeamSelected;
    }

    public async init() {
        this.mqtt.subscribe('homie/+/info/name');
        this.mqtt.on('message', (topic, payload) => {
            if (topic.endsWith('/info/name')) {
                const teamId = topic.split('/')[1];
                if (teamId.match(/^team-.*$/)) {
                    const teamName = payload.toString();
                    if (!this.teams.find(team => team.id === teamId)) {
                        this.teams.push({ id: teamId, name: teamName });
                        this.show();
                    }
                }
            }
        });
    }

    public show() {
        this.container.innerHTML = '';
        const title = document.createElement('h1');
        title.innerText = 'Select a Team';
        this.container.appendChild(title);
        this.teams.forEach(team => {
            const button = document.createElement('button');
            button.innerText = team.name;
            button.onclick = () => this.selectTeam(team.id);
            this.container.appendChild(button);
        });
    }

    public hide() {
        this.container.innerHTML = '';
    }

    protected async loop() {
        // Not needed for this view
    }

    protected async loadModel() {
        // Not needed for this view
    }

    private selectTeam(teamId: string) {
        localStorage.setItem('teamId', teamId);
        const deviceId = localStorage.getItem('deviceId');
        if (deviceId) {
            this.mqtt.publish(`homie/${deviceId}/team-id/set`, teamId);
        }
        this.hide();
        this.onTeamSelected();
    }
}
