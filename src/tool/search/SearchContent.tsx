import * as React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import * as Autosuggest from 'react-autosuggest';
import { IBaseToolProps } from '../BaseTool';
import { ISearchProvider, ISearchResult } from '@gisosteam/aol/search';
import { useTranslate, useOlMap } from '../hook';
import { BiHome, BiBuildingHouse, BiTargetLock } from 'react-icons/bi';
import { RiRoadMapLine } from 'react-icons/ri';

const GlobalAutosuggestStyle = createGlobalStyle`
.ol-control .react-autosuggest__container {
  position: relative;
  width: 400px;
  margin-left: -220px;
}

.ol-control .react-autosuggest__input {
  width: 400px;
  height: 20px;
  padding: 10px 20px;
  font-family: Helvetica, sans-serif;
  font-weight: 300;
  font-size: 16px;
  border: 1px solid #aaa;
  border-radius: 4px;
}

.ol-control .react-autosuggest__input--focused {
  outline: none;
}

.ol-control .react-autosuggest__input--open {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.ol-control .react-autosuggest__suggestions-container {
  display: none;
}

.ol-control .react-autosuggest__suggestions-container--open {
  display: block;
  position: absolute;
  top: 51px;
  width: 440px;
  border: 1px solid #aaa;
  background-color: #fff;
  font-family: Helvetica, sans-serif;
  font-weight: 300;
  font-size: 16px;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  z-index: 2;
}

.ol-control .react-autosuggest__suggestions-list {
  margin: 0;
  padding: 0;
  list-style-type: none;
}

.ol-control .react-autosuggest__suggestion {
  cursor: pointer;
  padding: 10px 20px;
}

.ol-control .react-autosuggest__suggestion--highlighted {
  background-color: #ddd;
}
`;

const Container = styled.div`
  top: 15px;
  left: 50%;
`;

export interface ISearchContentProps extends IBaseToolProps {
  searchProvider: ISearchProvider;
}

export function SearchContent(props: ISearchContentProps) {
  const translate = useTranslate();
  const olMap = useOlMap();
  const [searchResults, setSearchResults] = React.useState<ISearchResult[]>([]);
  const [searchValue, setSearchValue] = React.useState<string>('');

  return (
    <>
      <GlobalAutosuggestStyle />
      <Container className={`ol-control ${props.className}`}>
        <Autosuggest
          highlightFirstSuggestion
          inputProps={{
            placeholder: translate('search.placeholder', 'Search...'),
            value: searchValue,
            onChange: (event, { newValue }) => {
              setSearchValue(newValue);
            }
          }}
          suggestions={searchResults}
          onSuggestionsFetchRequested={({ value }) => {
            props.searchProvider.search(value, olMap.getView().getProjection()).then(
              (results) => {
                setSearchResults(results);
              }
            );
          }}
          onSuggestionsClearRequested={() => {
            setSearchResults([]);
          }}
          getSuggestionValue={(suggestion) => suggestion.name}
          renderSuggestion={suggestion =>
            <div className={`${props.className}-item`} key={suggestion.id ? suggestion.id : suggestion.name}>
              <span>
                {suggestion.type === 'housenumber' && <BiHome />}
                {suggestion.type === 'street' && <RiRoadMapLine />}
                {suggestion.type === 'locality' && <BiBuildingHouse />}
                {suggestion.type === 'municipality' && <BiBuildingHouse />}
                {suggestion.type === 'address' && <RiRoadMapLine />}
                {suggestion.type === 'object' && <BiTargetLock />}
                {suggestion.type === 'entity' && <BiTargetLock />}
              </span>
              <span style={{ display: 'inline', marginLeft: '6px' }}>
                {suggestion.name}
              </span>
            </div>
          }
          onSuggestionSelected={(event, { suggestion }) => {
            if (suggestion.feature != null) {
              const extent = suggestion.feature.getGeometry().getExtent();
              console.log(`Fit on '${suggestion.name}' [${extent}]`);
              olMap.getView().fit(extent, { maxZoom: 18 });
            }
          }}
        />
      </Container>
    </>
  );
}
