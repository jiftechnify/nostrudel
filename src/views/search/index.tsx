import { useCallback, useEffect, useState } from "react";
import { Button, ButtonGroup, Flex, IconButton, Input, Link } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import { SEARCH_RELAYS } from "../../const";
import { safeDecode } from "../../helpers/nip19";
import { getMatchHashtag } from "../../helpers/regexp";
import { CommunityIcon, CopyToClipboardIcon, NotesIcon } from "../../components/icons";
import VerticalPageLayout from "../../components/vertical-page-layout";
import User01 from "../../components/icons/user-01";
import Feather from "../../components/icons/feather";
import ProfileSearchResults from "./profile-results";
import NoteSearchResults from "./note-results";
import ArticleSearchResults from "./article-results";
import CommunitySearchResults from "./community-results";
import PeopleListProvider from "../../providers/local/people-list-provider";
import PeopleListSelection from "../../components/people-list-selection/people-list-selection";
import useRouteSearchValue from "../../hooks/use-route-search-value";
import { useBreakpointValue } from "../../providers/global/breakpoint-provider";
import QRCodeScannerButton from "../../components/qr-code-scanner-button";
import { AdditionalRelayProvider } from "../../providers/local/additional-relay-context";

export function SearchPage() {
  const navigate = useNavigate();

  const autoFocusSearch = useBreakpointValue({ base: false, lg: true });

  const typeParam = useRouteSearchValue("type", "users");
  const queryParam = useRouteSearchValue("q", "");

  const [searchInput, setSearchInput] = useState(queryParam.value);

  // update the input value when search changes
  useEffect(() => {
    setSearchInput(queryParam.value);
  }, [queryParam.value]);

  const handleSearchText = (text: string) => {
    const cleanText = text.trim();

    if (cleanText.startsWith("nostr:") || cleanText.startsWith("web+nostr:") || safeDecode(text)) {
      navigate({ pathname: "/l/" + encodeURIComponent(text) }, { replace: true });
      return;
    }

    const hashTagMatch = getMatchHashtag().exec(cleanText);
    if (hashTagMatch) {
      navigate({ pathname: "/t/" + hashTagMatch[2].toLocaleLowerCase() }, { replace: true });
      return;
    }

    queryParam.setValue(cleanText);
  };

  const readClipboard = useCallback(async () => {
    handleSearchText(await navigator.clipboard.readText());
  }, []);

  // set the search when the form is submitted
  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    handleSearchText(searchInput);
  };

  let SearchResults = ProfileSearchResults;
  switch (typeParam.value) {
    case "users":
      SearchResults = ProfileSearchResults;
      break;
    case "notes":
      SearchResults = NoteSearchResults;
      break;
    case "articles":
      SearchResults = ArticleSearchResults;
      break;
    case "communities":
      SearchResults = CommunitySearchResults;
      break;
  }

  return (
    <VerticalPageLayout>
      <form onSubmit={handleSubmit}>
        <Flex gap="2" wrap="wrap">
          <Flex gap="2" grow={1}>
            <QRCodeScannerButton onData={handleSearchText} />
            {!!navigator.clipboard?.readText && (
              <IconButton onClick={readClipboard} icon={<CopyToClipboardIcon />} aria-label="Read clipboard" />
            )}
            <Input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              autoFocus={autoFocusSearch}
            />
            <Button type="submit">Search</Button>
          </Flex>
        </Flex>
      </form>

      <Flex gap="2">
        <PeopleListSelection size="sm" />
        <ButtonGroup size="sm" isAttached variant="outline" flexWrap="wrap">
          <Button
            leftIcon={<User01 />}
            colorScheme={typeParam.value === "users" ? "primary" : undefined}
            onClick={() => typeParam.setValue("users")}
          >
            Users
          </Button>
          <Button
            leftIcon={<NotesIcon />}
            colorScheme={typeParam.value === "notes" ? "primary" : undefined}
            onClick={() => typeParam.setValue("notes")}
          >
            Notes
          </Button>
          <Button
            leftIcon={<Feather />}
            colorScheme={typeParam.value === "articles" ? "primary" : undefined}
            onClick={() => typeParam.setValue("articles")}
          >
            Articles
          </Button>
          <Button
            leftIcon={<CommunityIcon />}
            colorScheme={typeParam.value === "communities" ? "primary" : undefined}
            onClick={() => typeParam.setValue("communities")}
          >
            Communities
          </Button>
        </ButtonGroup>
      </Flex>

      <Flex direction="column" gap="4">
        {queryParam.value ? (
          <SearchResults search={queryParam.value} />
        ) : (
          <Link isExternal href="https://nostr.band" color="blue.500" mx="auto">
            Advanced Search
          </Link>
        )}
      </Flex>
    </VerticalPageLayout>
  );
}

export default function SearchView() {
  return (
    <AdditionalRelayProvider relays={SEARCH_RELAYS}>
      <PeopleListProvider initList="global">
        <SearchPage />
      </PeopleListProvider>
    </AdditionalRelayProvider>
  );
}
