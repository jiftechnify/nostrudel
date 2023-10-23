import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardProps,
  Flex,
  Heading,
  SimpleGrid,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import {
  getCommunityDescription,
  getCommunityMods,
  getCommunityRelays,
  getCommunityRules,
} from "../../../helpers/nostr/communities";
import CommunityDescription from "../../communities/components/community-description";
import UserAvatarLink from "../../../components/user-avatar-link";
import { UserLink } from "../../../components/user-link";
import { RelayIconStack } from "../../../components/relay-icon-stack";
import { NostrEvent } from "../../../types/nostr-event";
import CommunityJoinButton from "../../communities/components/community-subscribe-button";
import CommunityMenu from "./community-menu";
import useCountCommunityMembers from "../../../hooks/use-count-community-members";
import { readablizeSats } from "../../../helpers/bolt11";
import CommunityMembersModal from "./community-members-modal";

export default function HorizontalCommunityDetails({
  community,
  onEditClick,
  ...props
}: Omit<CardProps, "children"> & { community: NostrEvent; onEditClick?: () => void }) {
  const membersModal = useDisclosure();
  const communityRelays = getCommunityRelays(community);
  const mods = getCommunityMods(community);
  const description = getCommunityDescription(community);
  const rules = getCommunityRules(community);

  const more = useDisclosure();
  const countMembers = useCountCommunityMembers(community);

  return (
    <>
      <Card {...props}>
        <CardBody>
          <ButtonGroup float="right">
            <CommunityJoinButton community={community} />
            <CommunityMenu community={community} aria-label="More" onEditClick={onEditClick} />
          </ButtonGroup>
          {description && (
            <>
              <Heading size="sm" mb="1">
                Description
              </Heading>
              <CommunityDescription community={community} mb="1" />
            </>
          )}

          {more.isOpen ? (
            <SimpleGrid spacing="4" columns={2}>
              <Box>
                <Heading size="sm" mb="1">
                  Mods
                </Heading>
                <Flex direction="column" gap="2">
                  {mods.map((pubkey) => (
                    <Flex gap="2">
                      <UserAvatarLink pubkey={pubkey} size="xs" />
                      <UserLink pubkey={pubkey} />
                    </Flex>
                  ))}
                </Flex>
              </Box>
              <Box as="button" textAlign="start" cursor="pointer" onClick={membersModal.onOpen}>
                <Heading size="sm" mb="1">
                  Members
                </Heading>
                <Text>{countMembers ? readablizeSats(countMembers) : "unknown"}</Text>
              </Box>
              {rules && (
                <Box>
                  <Heading size="sm" mb="1">
                    Rules
                  </Heading>
                  <Text whiteSpace="pre-wrap">{rules}</Text>
                </Box>
              )}
              {communityRelays.length > 0 && (
                <Box>
                  <Heading size="sm" mt="4" mb="1">
                    Relays
                  </Heading>
                  <Flex direction="column" gap="2">
                    <RelayIconStack relays={communityRelays} />
                  </Flex>
                </Box>
              )}
            </SimpleGrid>
          ) : (
            <Button variant="link" onClick={more.onOpen} w="full">
              Show more
            </Button>
          )}
        </CardBody>
      </Card>
      {membersModal.isOpen && (
        <CommunityMembersModal isOpen={membersModal.isOpen} onClose={membersModal.onClose} community={community} />
      )}
    </>
  );
}
