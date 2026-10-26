// Author: Gerónimo Montes

// internal imports
import type { ArticleInterface } from '~/interfaces/ArticleInterface'

/**
 * The three blog articles, hardcoded: this section has no backend, and the
 * list is also what nuxt.config.ts reads to know which routes to prerender.
 */
export const ARTICLES: ArticleInterface[] = [
  {
    id: '1',
    title: 'How to price a UGC order without guessing',
    summary:
      'A rate card is only the starting point. Usage rights, revisions and exclusivity are what turn a creator rate into the budget of an order.',
    author: 'Gerónimo Montes',
    date: '2026-10-06',
    readingMinutes: 6,
    paragraphs: [
      'Most agencies start by asking a creator for a flat rate per video and stop there. That number only covers production: the hours spent shooting, editing and delivering a file. It says nothing about what the brand is allowed to do with that file afterwards, which is where most of the disagreements end up.',
      'Split the budget of an order into three visible parts. The first is the creator rate, which belongs to the creator and should never be negotiated down to win a client. The second is usage rights: a percentage on top of the rate for every extra month the brand wants to run the content as a paid ad. The third is the agency commission, which pays for the coordination work the brand does not see.',
      'Usage rights are the part teams forget. A video that lives on the brand organic feed is worth far less than the same video running as a paid ad for six months. Charging the same for both means the agency is giving away the most valuable thing it produces.',
      'Revisions deserve a number, not a promise. Two rounds included, anything beyond that billed per round, written in the order before production starts. Without that line, a single indecisive client can turn a profitable order into an unprofitable one while nobody notices.',
      'Exclusivity is the last multiplier. If a brand asks a creator not to work with competitors for three months, that is income the creator is giving up, and the brand should pay for it. Treat it as a separate line so the brand can decide whether it is worth the cost.',
      'When the budget of an order is broken into these parts, a coordinator can explain every peso of it to a brand and every peso of it to a creator. That transparency is what keeps both sides working with the agency again.',
    ],
  },
  {
    id: '2',
    title: 'Matching creators to briefs: niche beats follower count',
    summary:
      'The creator with the biggest audience is rarely the right one for an order. What matters is whether their everyday content already looks like the brief.',
    author: 'Gerónimo Montes',
    date: '2026-10-13',
    readingMinutes: 5,
    paragraphs: [
      'When a brand sends a brief, the instinct is to open the catalog and sort by audience size. It is the wrong first move. UGC is not influencer marketing: the brand is buying content to run as its own, so the creator audience is almost irrelevant. What the brand is really buying is a voice and a visual style.',
      'Read the brief for the format before anything else. A skincare routine shot in a bathroom mirror, a gameplay clip with an overlay, an unboxing on a kitchen counter: each of these is a different craft, and a creator who is excellent at one can be mediocre at another.',
      'Then look at the niche. A creator who already talks about gastronomy every week has the vocabulary, the lighting setup and the props for a food brief. Someone brilliant in fitness will spend the first half of the shoot figuring out things the food creator already knows.',
      'Keep availability honest in the catalog. A creator marked as available who is actually booked for three weeks will quietly delay every order assigned to them. It is better to show a short list of genuinely available creators than a long list that cannot be trusted.',
      'Finally, keep the rate in view while matching. The best fit for a brief is not the best fit for the order if their rate consumes the entire budget and leaves nothing for usage rights. Matching is a decision about fit, availability and budget at the same time, not about a single number.',
    ],
  },
  {
    id: '3',
    title: 'Keeping an order on schedule from requested to approved',
    summary:
      'Most late deliveries are not production problems. They are handoff problems between the five states an order moves through.',
    author: 'Gerónimo Montes',
    date: '2026-10-20',
    readingMinutes: 7,
    paragraphs: [
      'An order in Creatorly moves through five states: requested, assigned, in production, delivered and approved. Each transition is a handoff between two people, and almost every delay happens at a handoff rather than during the work itself.',
      'The jump from requested to assigned is the one agencies underestimate. An order sitting in requested is not waiting on a creator, it is waiting on a coordinator to make a decision. Give that step a deadline of its own, measured in hours, not days.',
      'Assigned to in production fails when the brief is incomplete. A creator who has to ask three questions before starting loses a day per question if the brand answers slowly. Before assigning, check that the brief answers the obvious ones: what to show, what to say, which format, and what the brand absolutely does not want.',
      'In production to delivered is the only step where the delay is genuinely about the work. Protect it. Do not use this window to renegotiate the brief, because every change here resets the clock and the creator absorbs the cost.',
      'Delivered to approved is where orders go to die. The content is finished, the creator has done the job, and the order sits waiting for a brand to watch a sixty second video. Set an explicit review window when the order is created, and treat silence past that window as approval if the contract allows it.',
      'Track how long orders spend in each state rather than only whether they are late. An agency that knows its slowest handoff can fix one process and get back days across every order it runs. An agency that only tracks final delivery dates learns the same lesson one angry client at a time.',
    ],
  },
]
