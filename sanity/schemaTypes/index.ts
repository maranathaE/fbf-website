import { briefSubmission, client, service, teamMember, timelineEntry } from './documents';
import { project } from './project';
import { briefSettings, siteSettings } from './settings';

export const schemaTypes = [project, client, teamMember, service, timelineEntry, siteSettings, briefSettings, briefSubmission];

/** Documents that exist exactly once, with fixed IDs. */
export const singletons = {
  siteSettings: 'siteSettings',
  briefSettings: 'secrets.briefSettings',
} as const;
