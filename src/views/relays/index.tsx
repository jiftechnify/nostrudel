import { Outlet, Link as RouterLink, useLocation } from "react-router-dom";
import { Button, Flex, Heading } from "@chakra-ui/react";

import VerticalPageLayout from "../../components/vertical-page-layout";
import useCurrentAccount from "../../hooks/use-current-account";
import useUserRelaySets from "../../hooks/use-user-relay-sets";
import { getListName } from "../../helpers/nostr/lists";
import { getEventCoordinate } from "../../helpers/nostr/events";
import { useBreakpointValue } from "../../providers/global/breakpoint-provider";
import Database01 from "../../components/icons/database-01";
import { AtIcon, RelayIcon } from "../../components/icons";
import Mail02 from "../../components/icons/mail-02";
import { useUserDNSIdentity } from "../../hooks/use-user-dns-identity";
import useUserContactRelays from "../../hooks/use-user-contact-relays";
import UserSquare from "../../components/icons/user-square";

export default function RelaysView() {
  const account = useCurrentAccount();
  const relaySets = useUserRelaySets(account?.pubkey, undefined);
  const vertical = useBreakpointValue({ base: true, lg: false });
  const nip05 = useUserDNSIdentity(account?.pubkey);
  const kind3Relays = useUserContactRelays(account?.pubkey);

  const location = useLocation();

  const renderContent = () => {
    const nav = (
      <Flex gap="2" direction="column" minW="60" overflowY="auto" overflowX="hidden" w={vertical ? "full" : undefined}>
        <Button
          as={RouterLink}
          variant="outline"
          colorScheme={
            (location.pathname === "/relays" && !vertical) || location.pathname === "/relays/app"
              ? "primary"
              : undefined
          }
          to="/relays/app"
          leftIcon={<RelayIcon boxSize={6} />}
        >
          App Relays
        </Button>
        <Button
          as={RouterLink}
          variant="outline"
          colorScheme={location.pathname === "/relays/cache" ? "primary" : undefined}
          to="/relays/cache"
          leftIcon={<Database01 boxSize={6} />}
        >
          Cache Relay
        </Button>
        {account && (
          <Button
            variant="outline"
            as={RouterLink}
            to="/relays/mailboxes"
            leftIcon={<Mail02 boxSize={6} />}
            colorScheme={location.pathname === "/relays/mailboxes" ? "primary" : undefined}
          >
            Mailboxes
          </Button>
        )}
        {nip05 && (
          <Button
            variant="outline"
            as={RouterLink}
            to="/relays/nip05"
            leftIcon={<AtIcon boxSize={6} />}
            colorScheme={location.pathname === "/relays/nip05" ? "primary" : undefined}
          >
            NIP-05 Relays
          </Button>
        )}
        <Button
          variant="outline"
          as={RouterLink}
          to="/relays/contacts"
          leftIcon={<UserSquare boxSize={6} />}
          colorScheme={location.pathname === "/relays/contacts" ? "primary" : undefined}
        >
          Contact List Relays
        </Button>
        {/* {account && (
          <>
            <Heading size="sm" mt="2">
              Relay Sets
            </Heading>
            {relaySets.map((set) => (
              <Button
                as={RouterLink}
                variant="outline"
                colorScheme={location.pathname.endsWith(getEventCoordinate(set)) ? "primary" : undefined}
                to={`/relays/${getEventCoordinate(set)}`}
              >
                {getListName(set)}
              </Button>
            ))}
          </>
        )} */}
      </Flex>
    );
    if (vertical) {
      if (location.pathname !== "/relays") return <Outlet />;
      else return nav;
    } else
      return (
        <Flex gap="2" maxH="100vh" overflow="hidden">
          {nav}
          <Outlet />
        </Flex>
      );
  };

  return <VerticalPageLayout>{renderContent()}</VerticalPageLayout>;
}
