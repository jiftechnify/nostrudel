import { useRef } from "react";
import { Card, Flex, LinkBox, SimpleGrid } from "@chakra-ui/react";
import { kinds } from "nostr-tools";

import { getEventUID } from "../../../helpers/nostr/events";
import { useAppTitle } from "../../../hooks/use-app-title";
import useTimelineLoader from "../../../hooks/use-timeline-loader";
import PeopleListSelection from "../../../components/people-list-selection/people-list-selection";
import { usePeopleListContext } from "../../../providers/local/people-list-provider";
import IntersectionObserverProvider, {
  useRegisterIntersectionEntity,
} from "../../../providers/local/intersection-observer";
import useSubject from "../../../hooks/use-subject";
import { useTimelineCurserIntersectionCallback } from "../../../hooks/use-timeline-cursor-intersection-callback";
import TimelineActionAndStatus from "../../../components/timeline-page/timeline-action-and-status";
import UserAvatarLink from "../../../components/user-avatar-link";
import { UserDnsIdentityIcon } from "../../../components/user-dns-identity-icon";
import HoverLinkOverlay from "../../../components/hover-link-overlay";
import UserLink from "../../../components/user-link";
import { getRelaysFromList } from "../../../helpers/nostr/lists";
import { getRelayVariations } from "../../../helpers/relay";
import { NostrEvent } from "../../../types/nostr-event";

function UserCard({ list, pubkey }: { list: NostrEvent; pubkey: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  useRegisterIntersectionEntity(ref, getEventUID(list));

  return (
    <Card as={LinkBox} p="2" variant="outline" flexDirection="row" display="flex" gap="2" overflow="hidden" ref={ref}>
      <UserAvatarLink pubkey={pubkey} />
      <Flex direction="column" overflow="hidden">
        <HoverLinkOverlay as={UserLink} pubkey={pubkey} fontWeight="bold" isTruncated />
        <UserDnsIdentityIcon pubkey={pubkey} />
      </Flex>
    </Card>
  );
}

export default function RelayUsersTab({ relay }: { relay: string }) {
  useAppTitle(`${relay} - Users`);
  const { filter } = usePeopleListContext();
  const timeline = useTimelineLoader(
    `${relay}-users`,
    [relay],
    filter && { ...filter, kinds: [kinds.RelayList], "#r": getRelayVariations(relay) },
    {
      eventFilter: (e) => getRelaysFromList(e).includes(relay),
    },
  );

  const lists = useSubject(timeline.timeline);
  const callback = useTimelineCurserIntersectionCallback(timeline);

  return (
    <Flex direction="column" gap="2">
      <Flex gap="2" wrap="wrap">
        <PeopleListSelection />
      </Flex>
      <IntersectionObserverProvider callback={callback}>
        <SimpleGrid columns={[1, 1, 2, 3, 4]} spacing="2">
          {lists.map((list) => (
            <UserCard key={getEventUID(list)} pubkey={list.pubkey} list={list} />
          ))}
        </SimpleGrid>
      </IntersectionObserverProvider>
      <TimelineActionAndStatus timeline={timeline} />
    </Flex>
  );
}
