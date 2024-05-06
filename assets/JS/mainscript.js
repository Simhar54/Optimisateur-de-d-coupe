import { FormValidator } from './class/validationform.js';
import { CutLengthManager } from './class/cutLengthManager.js';
import { BarLengthManager } from './class/barLengthManager.js';
import { OptimizationResultsDisplay } from './class/displayOptimizationResults.js';
import { FormInteractionManager } from './class/formInteractionManager.js';

const validator = new FormValidator();
const cutLengthManager = new CutLengthManager();
const barLengthManager = new BarLengthManager();
const optimizationResultsDisplay = new OptimizationResultsDisplay('optimizationDetails', 'resultOptimize');

const formInteractionManager = new FormInteractionManager(validator, cutLengthManager, barLengthManager, optimizationResultsDisplay);
