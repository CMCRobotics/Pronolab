import logger from 'loglevel';
import { Session } from './core/session';
import { ImageView } from './view/image-view';
import { AudioView } from './view/audio-view';
import { PoseView } from './view/pose-view';
import { ViewManager } from './view/view-manager';


export { logger, Session, ImageView, AudioView, PoseView, ViewManager };

const Pronolab = {
  logger,
  Session,
  ImageView,
  AudioView,
  PoseView,
  ViewManager
};

export default Pronolab;
