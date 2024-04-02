import { FormValidator } from './class/validationform.js';
import { CutLengthManager } from './class/cutLengthManager.js';
import { BarLengthManager } from './class/barLengthManager.js';
import { FormInteractionManager } from './class/formInteractionManager.js';

const validator = new FormValidator();
const cutLengthManager = new CutLengthManager();
const barLengthManager = new BarLengthManager();

const formInteractionManager = new FormInteractionManager(validator, cutLengthManager, barLengthManager);


