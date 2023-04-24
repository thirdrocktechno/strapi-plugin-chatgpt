import React, { useState, useEffect } from 'react';

import { Box } from '@strapi/design-system/Box';
import { Flex } from '@strapi/design-system/Flex';
import { Button } from '@strapi/design-system/Button';
import { LinkButton } from '@strapi/design-system/LinkButton';
import { Typography } from '@strapi/design-system/Typography';
import { EmptyStateLayout } from '@strapi/design-system/EmptyStateLayout';
import { Table, Thead, Tbody, Tr, Td, Th } from '@strapi/design-system/Table';
import { Switch } from '@strapi/design-system/Switch';
import { useNotification } from '@strapi/helper-plugin';
import { TextInput } from '@strapi/design-system';
import { Tooltip } from '@strapi/design-system';
import { Loader } from '@strapi/design-system';
import { FieldAction } from '@strapi/design-system';
import { EyeStriked, Eye } from '@strapi/icons';
import styled from 'styled-components';

import { useIntl } from 'react-intl';
import { getTrad } from '../../../utils';
import WidgetMain from '../../Widget/index'

import Plus from '@strapi/icons/Plus';
import Information from '@strapi/icons/Information';

import {
  DEFAULT_WIDGET_POSITION,
  DEFAULT_COLOR_OPTIONS,
  DEFAULT_HEADER_CONTENT,
  DEFAULT_SUPPORT_MESSAGE_CONTENT,
} from "../../../utils/constants";

import { Illo } from './EmptyComponentLayout/illo';

import {
  Tabs,
  Tab,
  TabGroup,
  TabPanels,
  TabPanel,
} from '@strapi/design-system/Tabs';

import _ from 'lodash';

const settingsAPI = require('../../../api/settings').default;
const strapiGPTAPI = require('../../../api/strapi-gpt').default

const PasswordInput = styled(TextInput)`
  ::-ms-reveal {
    display: none;
  }
`;

const FieldActionWrapper = styled(FieldAction)`
  svg {
    height: 1rem;
    width: 1rem;
    path {
      fill: ${({ theme }) => theme.colors.neutral600};
    }
  }
`;

const Main = ({ contentTypes }) => {

  // Main Configurations
  const [defaultSettings, setDefaultSettings] = useState(null);
  const [OPENAI_API_KEY, setOpenAIAPIKey] = useState(null);
  const [PINECONE_API_KEY, setPineconeAPIKey] = useState(null);
  const [PINECONE_INDEX, setPineconeIndex] = useState(null);
  const [ABLY_API_KEY, setAblyAPIKey] = useState(null);
  const [ABLY_SUBSCRIBE_API_KEY, setAblySubscribeAPIKey] = useState(null);
  const [showLoader, setShowLoader] = useState(false);
  const [PINECONE_ENVIRONMENT, setPineconeEnvironment] = useState(null);
  const toggleNotification = useNotification();
  const [showOpenAPIKey, setShowOpenAPIKey] = useState(false)
  const [showPineconeAPIKey, setShowPineconeKey] = useState(false)
  const [showAblyAPIKey, setShowAblyKey] = useState(false)
  const [showAblySubscribeAPIKey, setShowAblySubscribeKey] = useState(false)
  // Main Configuration ENDS
  
  // Widget Configurations
  const [executiveImage, setExecutiveImage] = useState(null);
  const [companyLogo, setCompanyLogo] = useState(null);
  const [headerContent, setHeaderContent] = useState(DEFAULT_HEADER_CONTENT);
  const [supportMessageContent, setSupportMessageContent] = useState(
      DEFAULT_SUPPORT_MESSAGE_CONTENT
  );
  const [colors, setColors] = useState(DEFAULT_COLOR_OPTIONS);
  const [widgetPosition, setWidgetPosition] = useState(DEFAULT_WIDGET_POSITION);
  const [frontendHost, setFrontendHost] = useState(null);
  const [backendHost, setBackendHost] = useState(null);
  const setWidgetConfig = (widgetConfig) => {
    if(_.isEmpty(widgetConfig)) {
      return;
    }
    setExecutiveImage(widgetConfig.executiveImage);
    setCompanyLogo(widgetConfig.companyLogo);
    setHeaderContent(widgetConfig.headerContent || DEFAULT_HEADER_CONTENT);
    setSupportMessageContent(widgetConfig.supportMessageContent || DEFAULT_SUPPORT_MESSAGE_CONTENT);
    setColors(widgetConfig.colors || DEFAULT_COLOR_OPTIONS);
    setWidgetPosition(widgetConfig.widgetPosition || DEFAULT_WIDGET_POSITION);
    setFrontendHost(widgetConfig.frontendHost || null);
    setBackendHost(widgetConfig.backendHost || null);
  }
  // Widget configuration ENDS

  const getIndex = (arr, item) => _.findIndex(arr, item)

  useEffect(() => {
    // Fetch all the settings and update to state
    const fetchDefaultSettings = async () => {
      const tmpSettings = await settingsAPI.get();
      setOpenAIAPIKey(tmpSettings.config['OPENAI_API_KEY']);
      setPineconeAPIKey(tmpSettings.config['PINECONE_API_KEY']);
      setPineconeIndex(tmpSettings.config['PINECONE_INDEX'])
      setPineconeEnvironment(tmpSettings.config['PINECONE_ENVIRONMENT'])
      setAblyAPIKey(tmpSettings.config['ABLY_API_KEY']);
      setAblySubscribeAPIKey(tmpSettings.config['ABLY_SUBSCRIBE_API_KEY'])
      setWidgetConfig(tmpSettings.widgetConfig);
      contentTypes.collectionTypes.forEach((col) => {
        if (!_.find(tmpSettings.collections, { uid: col.uid })) {
          tmpSettings.collections.push({
            uid: col.uid,
            collectionName: col.uid.split('.').pop(),
            isEnabled: false
          })
        }
      })
      tmpSettings.collections.forEach((setting) => {
        if (!_.find(contentTypes.collectionTypes, { uid: setting.uid })) {
          tmpSettings.collections.splice(getIndex(tmpSettings.collections, { uid: setting.uid }), 1)
        }
      })
      setDefaultSettings(tmpSettings);
    };
    fetchDefaultSettings();
  }, []);

  const { formatMessage } = useIntl();

  const enableChatGPT = (item) => {
    setDefaultSettings(prevSettings => {
      const newSettings = { ...prevSettings };
      const index = getIndex(newSettings.collections, { uid: item?.uid });
      const matchingContentType = newSettings.collections[index];
      matchingContentType.isEnabled = !matchingContentType.isEnabled;
      newSettings.collections[index] = matchingContentType
      return newSettings;
    });
  }

  // Update settings
  const handleSavingSettingsModal = () => {
    setShowLoader(true);
    const newSettings = {
      ...defaultSettings,
      config: {
        OPENAI_API_KEY,
        PINECONE_API_KEY,
        PINECONE_INDEX,
        PINECONE_ENVIRONMENT,
        ABLY_API_KEY,
        ABLY_SUBSCRIBE_API_KEY
      },
      widgetConfig: {
        executiveImage,
        companyLogo,
        headerContent,
        supportMessageContent,
        colors,
        widgetPosition,
        frontendHost,
        backendHost
      }
    };
    settingsAPI.set(newSettings).then(async () => {
      setDefaultSettings(newSettings);
      toggleNotification({
        type: 'success',
        message: 'StrapiGPT plugin configuration updated successfully.',
      });
      setShowLoader(false);
    });
  };

  const updateDataFromStrapiToVectorDB = () => {
    setShowLoader(true);
    strapiGPTAPI.refreshData().then(() => {
      setShowLoader(false);
      toggleNotification({
        type: 'success',
        message: 'Data from strapi to vector db updated successfully.',
      })
    })
  }

  return (
    <>
      {showLoader ?
        <Flex padding={8} justifyContent="center" alignItems="center">
          <Loader>Please wait...</Loader>
        </Flex> :
        <Box padding={8}>
          <TabGroup label="label" id="tabs" variant="simple">
            <Tabs>
              <Tab>
                <Typography>
                  {formatMessage({
                    id: getTrad('ChatGPTPage.tab.collection-type-title'),
                    defaultMessage: 'Collection Types',
                  })}
                </Typography>
              </Tab>
              <Tab>
                <Typography variant="omega">
                  {formatMessage({
                    id: getTrad('ChatGPTPage.tab.single-type-title'),
                    defaultMessage: 'Settings',
                  })}
                </Typography>
              </Tab>
              <Tab>
                <Typography variant="omega">
                  {formatMessage({
                    id: getTrad('ChatGPTPage.tab.single-type-title'),
                    defaultMessage: 'Widget',
                  })}
                </Typography>
              </Tab>
            </Tabs>
            <TabPanels>
              <TabPanel>
                {/* TABLE */}
                <Table
                  colCount={2}
                  rowCount={defaultSettings && !_.isEmpty(defaultSettings.collections) && defaultSettings.collections.length}
                >
                  <Thead>
                    <Tr>
                      <Th>
                        <Typography variant="sigma">
                          {formatMessage({
                            id: getTrad('ChatGPTPage.tab-panel.column-name'),
                            defaultMessage: 'Name',
                          })}
                        </Typography>
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {defaultSettings &&
                      !_.isEmpty(defaultSettings) ? (
                      defaultSettings.collections.map((item) => {
                        const match = _.find(contentTypes.collectionTypes, { uid: item.uid })
                        const index = getIndex(defaultSettings.collections, { uid: item.uid })
                        if (match) {
                          return (
                            <Tr key={match.uid}>
                              <Td>
                                <Typography textColor="neutral800">
                                  {match.globalId}
                                </Typography>
                              </Td>
                              <Td>
                                <Flex justifyContent="right" alignItems="right">
                                  <Switch
                                    label="Switch"
                                    selected={item.isEnabled}
                                    onChange={() => enableChatGPT(defaultSettings.collections[index])}
                                  />
                                </Flex>
                              </Td>
                            </Tr>
                          )
                        }
                      })
                    ) : (
                      <Box padding={8} background="neutral0">
                        <EmptyStateLayout
                          icon={<Illo />}
                          content={formatMessage({
                            id: getTrad('ChatGPTPage.info.no-collection-types'),
                            defaultMessage:
                              "You don't have any collection-types yet...",
                          })}
                          action={
                            <LinkButton
                              to="/plugins/content-type-builder"
                              variant="secondary"
                              startIcon={<Plus />}
                            >
                              {formatMessage({
                                id: getTrad(
                                  'ChatGPTPage.info.create-collection-type'
                                ),
                                defaultMessage:
                                  'Create your first collection-type',
                              })}
                            </LinkButton>
                          }
                        />
                      </Box>
                    )}
                  </Tbody>
                </Table>
              </TabPanel>
              <TabPanel>
                <Box padding={4}>
                  <PasswordInput
                    placeholder="Enter OpenAI API Key here"
                    type={showOpenAPIKey ? 'text' : 'password'}
                    label="OpenAI API Key" name="open_ai_api_key" hint="Used to get text embeddings using 'text-embedding-ada-002' and for searching with 'gpt-3.5-turbo'."
                    onChange={e => setOpenAIAPIKey(e.target.value)}
                    value={OPENAI_API_KEY}
                    endAction={
                      <FieldActionWrapper
                        onClick={(e) => {
                          e.preventDefault();
                          setShowOpenAPIKey((prev) => !prev);
                        }}
                        label={formatMessage(
                          showOpenAPIKey
                            ? {
                                id: 'ChatGPTPage.info.settings.show-open-api-key',
                                defaultMessage: 'Show OpenAI API Key',
                              }
                            : {
                                id: 'ChatGPTPage.info.settings.hide-open-api-key',
                                defaultMessage: 'Hide OpenAI API Key',
                              }
                        )}
                      >
                        {showOpenAPIKey ? <Eye /> : <EyeStriked />}
                      </FieldActionWrapper>
                    }
                    labelAction={
                      <Tooltip description="This plugin will require OpenAI API key to work.">
                        <button aria-label="Information about the api key" style={{
                          border: 'none',
                          padding: 0,
                          background: 'transparent'
                        }}>
                          <Information aria-hidden />
                        </button>
                      </Tooltip>
                    }
                  />
                </Box>
                <Box padding={4}>
                  <TextInput
                    placeholder="Enter Pinecone API Key here"
                    type={showPineconeAPIKey ? 'text' : 'password'}
                    label="Pinecone API Key" name="pinecone_api_key" hint="Used to store the data of enabled content types and find the similarities using consine metrics."
                    onChange={e => setPineconeAPIKey(e.target.value)}
                    value={PINECONE_API_KEY}
                    endAction={
                      <FieldActionWrapper
                        onClick={(e) => {
                          e.preventDefault();
                          setShowPineconeKey((prev) => !prev);
                        }}
                        label={formatMessage(
                          showPineconeAPIKey
                            ? {
                                id: 'ChatGPTPage.info.settings.show-pinecone-key',
                                defaultMessage: 'Show Pinecone API Key',
                              }
                            : {
                                id: 'ChatGPTPage.info.settings.hide-pinecone-key',
                                defaultMessage: 'Hide Pinecone API Key',
                              }
                        )}
                      >
                        {showPineconeAPIKey ? <Eye /> : <EyeStriked />}
                      </FieldActionWrapper>
                    }
                    labelAction={
                      <Tooltip description="This plugin will require Pinecone API key to work.">
                        <button aria-label="Information about the api key" style={{
                          border: 'none',
                          padding: 0,
                          background: 'transparent'
                        }}>
                          <Information aria-hidden />
                        </button>
                      </Tooltip>
                    }
                  />
                </Box>
                <Box padding={4}>
                  <TextInput
                    placeholder="Enter Pinecone Index name here"
                    label="Pinecone Index Name" name="pinecone_index_name" hint="Enter your pinecone index name in which data will be inserted."
                    onChange={e => setPineconeIndex(e.target.value)}
                    value={PINECONE_INDEX}
                    labelAction={
                      <Tooltip description="This plugin will require Pinecone index key to work.">
                        <button aria-label="Information about the api key" style={{
                          border: 'none',
                          padding: 0,
                          background: 'transparent'
                        }}>
                          <Information aria-hidden />
                        </button>
                      </Tooltip>
                    }
                  />
                </Box>
                <Box padding={4}>
                  <TextInput
                    placeholder="Enter Pinecone Environment here"
                    label="Pinecone Environment" name="pinecone_environment" hint="Enter the environment of your pinecone index for e.g. 'us-west4-gcp'."
                    onChange={e => setPineconeEnvironment(e.target.value)}
                    value={PINECONE_ENVIRONMENT}
                    labelAction={
                      <Tooltip description="This plugin will require Pinecone environment to work.">
                        <button aria-label="Information about the api key" style={{
                          border: 'none',
                          padding: 0,
                          background: 'transparent'
                        }}>
                          <Information aria-hidden />
                        </button>
                      </Tooltip>
                    }
                  />
                </Box>
                <Box padding={4}>
                  <TextInput
                    placeholder="Enter Ably API Key here"
                    type={showAblyAPIKey ? 'text' : 'password'}
                    label="Ably API Key for publish message purpose" name="pinecone_api_key" hint="Used for sending the retrived tokens from ChatGPT to the ChatBox."
                    onChange={e => setAblyAPIKey(e.target.value)}
                    value={ABLY_API_KEY}
                    endAction={
                      <FieldActionWrapper
                        onClick={(e) => {
                          e.preventDefault();
                          setShowAblyKey((prev) => !prev);
                        }}
                        label={formatMessage(
                          showAblyAPIKey
                            ? {
                                id: 'ChatGPTPage.info.settings.show-ably-key',
                                defaultMessage: 'Show Ably API Key',
                              }
                            : {
                                id: 'ChatGPTPage.info.settings.hide-ably-key',
                                defaultMessage: 'Hide Ably API Key',
                              }
                        )}
                      >
                        {showAblyAPIKey ? <Eye /> : <EyeStriked />}
                      </FieldActionWrapper>
                    }
                    labelAction={
                      <Tooltip description="This plugin will require Ably API key to work.">
                        <button aria-label="Information about the api key" style={{
                          border: 'none',
                          padding: 0,
                          background: 'transparent'
                        }}>
                          <Information aria-hidden />
                        </button>
                      </Tooltip>
                    }
                  />
                </Box>
                <Box padding={4}>
                  <TextInput
                    placeholder="Enter Ably API Key here for subscribe purpose"
                    type={showAblySubscribeAPIKey ? 'text' : 'password'}
                    label="Ably API Key for subscribe message purpose" name="ably_subscribe_api_key" hint="Enter Ably API Key here which has only the Subscribe permission. This will be used in ChatBox to subscribe to the tokens sent from ChatGPT."
                    onChange={e => setAblySubscribeAPIKey(e.target.value)}
                    value={ABLY_SUBSCRIBE_API_KEY}
                    endAction={
                      <FieldActionWrapper
                        onClick={(e) => {
                          e.preventDefault();
                          setShowAblySubscribeKey((prev) => !prev);
                        }}
                        label={formatMessage(
                          showAblySubscribeAPIKey
                            ? {
                                id: 'ChatGPTPage.info.settings.show-ably-key',
                                defaultMessage: 'Show Ably API Key',
                              }
                            : {
                                id: 'ChatGPTPage.info.settings.hide-ably-key',
                                defaultMessage: 'Hide Ably API Key',
                              }
                        )}
                      >
                        {showAblySubscribeAPIKey ? <Eye /> : <EyeStriked />}
                      </FieldActionWrapper>
                    }
                    labelAction={
                      <Tooltip description="This plugin will require Ably API key to work.">
                        <button aria-label="Information about the api key" style={{
                          border: 'none',
                          padding: 0,
                          background: 'transparent'
                        }}>
                          <Information aria-hidden />
                        </button>
                      </Tooltip>
                    }
                  />
                </Box>
              </TabPanel>
              <TabPanel>
                <WidgetMain 
                  executiveImage={executiveImage} 
                  setExecutiveImage={setExecutiveImage} 
                  companyLogo={companyLogo} 
                  setCompanyLogo={setCompanyLogo} 
                  headerContent={headerContent} 
                  setHeaderContent={setHeaderContent}
                  supportMessageContent={supportMessageContent}
                  setSupportMessageContent={setSupportMessageContent}
                  colors={colors}
                  setColors={setColors}
                  widgetPosition={widgetPosition}
                  setWidgetPosition={setWidgetPosition}
                  frontendHost={frontendHost}
                  setFrontendHost={setFrontendHost}
                  backendHost={backendHost}
                  setBackendHost={setBackendHost}
                />
              </TabPanel>
            </TabPanels>
          </TabGroup>
          <Flex padding={5} justifyContent="right" alignItems="right">
            <Button
              style={{ marginRight: 5}}
              onClick={() => updateDataFromStrapiToVectorDB()}
            >
              {formatMessage({
                id: getTrad('ChatGPTPage.info.settings.refresh.button'),
                defaultMessage: 'Refresh Data',
              })}
            </Button>
            <Button
              onClick={() => handleSavingSettingsModal()}
            >
              {formatMessage({
                id: getTrad('ChatGPTPage.info.settings.save.button'),
                defaultMessage: 'Update',
              })}
            </Button>
          </Flex>
        </Box>
      }
    </>
  );
};

export default Main;
