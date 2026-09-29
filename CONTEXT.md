# Creatorly

Ubiquitous language of the internal dashboard for a UGC creator agency. This document is only the domain glossary; implementation decisions live in `docs/adr/`.

## The business

**Agency**:
The organization that owns Creatorly; intermediary between the brands that need content and the creators who produce it.
_Avoid_: the company, we.

**UGC**:
User Generated Content: the type of content creators produce for brands.
_Avoid_: advertising, content marketing.

**Creator**:
The UGC talent in the agency's catalog; who produces the content for the orders assigned to them.
_Avoid_: influencer, talent, profile.

**Brand**:
The agency's client; who requests the content on whose behalf each order is created.
_Avoid_: client, company, account.

**Order**:
The system's unit of work: a brand's content request, assigned to a creator and managed by a coordinator, with a budget and a status.
_Avoid_: request, job, project.

## Roles

**User**:
Internal system user, with credentials to log in.
_Avoid_: account, profile.

**Administrator**:
The role with full access: manages creators, brands, and users, and is the only one who can enter restricted pages.
_Avoid_: superuser.

**Coordinator**:
The standard role: manages the orders in their charge and checks reports.
_Avoid_: standard user, operator.

## Lifecycle

**Order status**:
One and only one of these five stages: `requested`, `assigned`, `in_production`, `delivered`, `approved`.
_Avoid_: state, phase, step.

**Seed data**:
The initial fake data that populates the system on first launch, before any real data exists.
_Avoid_: mock, fixture, test data.

**Session**:
The state of an authenticated User while using the system.
_Avoid_: login (that's the act of signing in, not the state).
