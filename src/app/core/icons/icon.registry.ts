import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import {
  faBagShopping,
  faCartPlus,
  faCartShopping,
  faGlobe,
  faHouse,
  faMagnifyingGlass,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';

const APP_ICONS = [
  faHouse,
  faMagnifyingGlass,
  faCartShopping,
  faCartPlus,
  faTrash,
  faBagShopping,
  faGlobe,
] as const;

/** Registers the Font Awesome icons used across the app. */
export function registerAppIcons(iconLibrary: FaIconLibrary): void {
  iconLibrary.addIcons(...APP_ICONS);
}
