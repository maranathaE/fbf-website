import type { StructureResolver } from 'sanity/structure';
import { singletons } from './schemaTypes';

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Frame by Frame')
    .items([
      S.documentTypeListItem('project').title('Projects'),
      S.documentTypeListItem('client').title('Clients'),
      S.documentTypeListItem('teamMember').title('Team'),
      S.documentTypeListItem('service').title('Services'),
      S.documentTypeListItem('timelineEntry').title('Timeline'),
      S.divider(),
      S.listItem()
        .title('Site settings')
        .id('siteSettings')
        .child(S.document().schemaType('siteSettings').documentId(singletons.siteSettings)),
      S.listItem()
        .title('Brief inbox')
        .id('briefSettings')
        .child(S.document().schemaType('briefSettings').documentId(singletons.briefSettings)),
      S.listItem()
        .title('Briefs received')
        .id('briefSubmission')
        .child(
          S.documentList()
            .title('Briefs received')
            .filter('_type == "briefSubmission"')
            .defaultOrdering([{ field: 'receivedAt', direction: 'desc' }]),
        ),
    ]);
