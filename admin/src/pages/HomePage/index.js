/*
 *
 * HomePage
 *
 */

import React, { memo, useEffect, useState, useRef } from 'react';

import { Box } from '@strapi/design-system/Box';

import {
  LoadingIndicatorPage,
  ContentBox,
  useAutoReloadOverlayBlocker,
} from '@strapi/helper-plugin';

import { useIntl } from 'react-intl';
import { getTrad } from '../../utils';

import { fetchContentTypes } from '../../utils/api';

import Info from '../../components/HomePage/Main';
import Header from '../../components/HomePage/Header';

import InformationSquare from '@strapi/icons/InformationSquare';

const HomePage = () => {
  const { formatMessage } = useIntl();


  const [isLoading, setIsLoading] = useState(true);

  const contentTypes = useRef({});

  // Fetching the SEO component & Content-Types
  useEffect(async () => {
    contentTypes.current = await fetchContentTypes();
    setIsLoading(false);
  }, []);

  // Displaying the LoadingIndicatorPage while it fetches the data
  if (isLoading) {
    return <LoadingIndicatorPage />;
  }

  return (
    <>
      <Header />

      <Box paddingLeft={8} paddingRight={8}>
        <ContentBox
          title={formatMessage({
            id: 'Information',
            defaultMessage: 'Information',
          })}
          subtitle={formatMessage({
            id: getTrad('HomePage.info.information'),
            defaultMessage:
              "Enable modals to enable the AI-powered search for the content of that modal.",
          })}
          icon={<InformationSquare />}
          iconBackground="primary100"
        />
      </Box>

      <Info contentTypes={contentTypes.current} />
    </>
  );
};

export default memo(HomePage);
