// Author: Gerónimo Montes

// internal imports
import type { FaqInterface } from '~/interfaces/FaqInterface'

/** The questions brands ask the agency most often, hardcoded for this section. */
export const FAQS: FaqInterface[] = [
  {
    id: '1',
    question: 'What is UGC and how is it different from influencer marketing?',
    answer:
      'UGC is content a creator produces for a brand to publish as its own. The brand buys the video or the photos, not the creator audience, so the content usually runs on the brand channels and as paid ads. In influencer marketing the brand pays for the reach of an audience that already follows the creator.',
  },
  {
    id: '2',
    question: 'How long does an order take from request to delivery?',
    answer:
      'A single video order usually takes between one and two weeks. Roughly two days go into assigning the right creator, five to seven into production, and the rest into the brand review. Orders with several pieces or with product shipping involved take longer.',
  },
  {
    id: '3',
    question: 'What is included in the budget of an order?',
    answer:
      'Three things: the creator rate, which pays for production; usage rights, which pay for how long and where the brand can run the content; and the agency commission, which covers coordination. Every order shows the three separately so there are no surprises.',
  },
  {
    id: '4',
    question: 'How many rounds of revisions do we get?',
    answer:
      'Two rounds are included in every order. Extra rounds are billed per round, because each one means more work for the creator. Agreeing on this before production starts is what keeps a project from drifting.',
  },
  {
    id: '5',
    question: 'Who owns the content once it is delivered?',
    answer:
      'The creator owns the copyright and the brand gets a licence for the period agreed in the order. If the brand wants the content for longer, the licence is extended and the creator is paid for that extension. Buying the copyright outright is possible but is priced separately.',
  },
  {
    id: '6',
    question: 'Can we ask for a specific creator from the catalog?',
    answer:
      'Yes. If the creator is available and their rate fits the budget of the order, the coordinator assigns them directly. If they are booked, the coordinator proposes creators working in the same niche and content type.',
  },
]
