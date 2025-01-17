import { useRef } from "react";
import { Button, ButtonGroup, Card, CardBody, CardFooter, CardHeader, CardProps, Flex, Tag } from "@chakra-ui/react";

import { getEventUID } from "../../../helpers/nostr/events";
import { useRegisterIntersectionEntity } from "../../../providers/local/intersection-observer";
import { NostrEvent } from "../../../types/nostr-event";
import { getHashtags } from "../../../helpers/nostr/stemstr";
import { CompactNoteContent } from "../../../components/compact-note-content";
import Timestamp from "../../../components/timestamp";
import UserLink from "../../../components/user-link";
import UserAvatarLink from "../../../components/user-avatar-link";
import { ReplyIcon } from "../../../components/icons";
import QuoteRepostButton from "../../../components/note/components/quote-repost-button";
import NoteZapButton from "../../../components/note/note-zap-button";
import TrackStemstrButton from "./track-stemstr-button";
import TrackDownloadButton from "./track-download-button";
import TrackPlayer from "./track-player";
import { UserDnsIdentityIcon } from "../../../components/user-dns-identity-icon";
import TrackMenu from "./track-menu";

export default function TrackCard({ track, ...props }: { track: NostrEvent } & Omit<CardProps, "children">) {
  const hashtags = getHashtags(track);

  const ref = useRef<HTMLDivElement | null>(null);
  useRegisterIntersectionEntity(ref, getEventUID(track));

  return (
    <Card variant="outline" ref={ref} {...props}>
      <CardHeader display="flex" alignItems="center" p="2" pb="0" gap="2">
        <UserAvatarLink pubkey={track.pubkey} size="sm" />
        <UserLink pubkey={track.pubkey} isTruncated fontWeight="bold" fontSize="lg" />
        <UserDnsIdentityIcon pubkey={track.pubkey} onlyIcon />
        <Timestamp ml="auto" timestamp={track.created_at} />
      </CardHeader>
      <CardBody p="2" display="flex" gap="2" flexDirection="column">
        <TrackPlayer track={track} />
        <CompactNoteContent event={track} />
        {hashtags.length > 0 && (
          <Flex wrap="wrap" gap="2">
            {hashtags.map((hashtag) => (
              <Tag key={hashtag}>#{hashtag}</Tag>
            ))}
          </Flex>
        )}
      </CardBody>
      <CardFooter px="2" pt="0" pb="2" flexWrap="wrap" gap="2">
        <ButtonGroup size="sm" variant="ghost">
          <Button leftIcon={<ReplyIcon />} isDisabled>
            Comment
          </Button>
          <QuoteRepostButton event={track} />
          <NoteZapButton event={track} />
        </ButtonGroup>
        <ButtonGroup size="sm" ml="auto">
          <TrackDownloadButton track={track} />
          <TrackStemstrButton track={track} />
          <TrackMenu track={track} aria-label="Options" />
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
}
