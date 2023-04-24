import React from 'react';

import { Box } from '@strapi/design-system/Box';
import { Button } from '@strapi/design-system/Button';
import { BaseHeaderLayout } from '@strapi/design-system/Layout';

import { useIntl } from 'react-intl';
import { getTrad } from '../../../utils';

const Header = () => {
  const { formatMessage } = useIntl();
  return (
    <Box background="neutral100">
      <BaseHeaderLayout
        title={formatMessage({
          id: getTrad('ChatGPTPage.header.title'),
          defaultMessage: 'StrapiGPT',
        })}
        subtitle={formatMessage({
          id: getTrad('ChatGPTPage.header.subtitle'),
          defaultMessage: 'Enable AI-powered search with your own content.',
        })}
        as="h2"
      />
    </Box>
  );
};

export default Header;
