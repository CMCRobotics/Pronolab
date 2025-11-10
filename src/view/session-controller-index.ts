import { Session } from '../core/session';
import { SessionControllerView } from './session-controller-view';
import { logger } from '../logger';

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('session-controller-container');
    if (container) {
        const session = new Session();
        session.onConnect.subscribe(() => {
            logger.info('Session connected');
            const view = new SessionControllerView(container, session);
            view.init();
        });
    } else {
        logger.error('Container for session controller not found');
    }
});
