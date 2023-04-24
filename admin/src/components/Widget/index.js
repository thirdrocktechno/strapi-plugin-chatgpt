import React, { useState, useEffect, useReducer } from 'react';

import { Box } from '@strapi/design-system/Box';
import { Typography } from '@strapi/design-system/Typography';
import { getTrad } from '../../utils';
import { useIntl } from 'react-intl';
import Content from './content';
import Appearance from './appearance';
import ScriptModal from './Modal/ScriptModal';

import {
    Tabs,
    Tab,
    TabGroup,
    TabPanels,
    TabPanel,
} from '@strapi/design-system/Tabs';

function copyToClipboard(e) {
    const script = document.querySelector("#script-content");
    script.select();
    script.setSelectionRange(0, 99999);
    document.execCommand("copy");
}

import ChatIcon from '../../public/images/chat-icon.svg';

const WidgetMain = ({
    executiveImage,
    setExecutiveImage,
    companyLogo,
    setCompanyLogo,
    headerContent,
    setHeaderContent,
    supportMessageContent,
    setSupportMessageContent,
    colors,
    setColors,
    widgetPosition,
    setWidgetPosition,
    setFrontendHost,
    frontendHost,
    setBackendHost,
    backendHost
}) => {

    const { formatMessage } = useIntl();

    return (
        <TabGroup label="label" id="tabs" variant="simple">
            <Tabs>
                <Tab>
                    <Typography variant="pi">
                        {formatMessage({
                            id: getTrad('ChatGPTPage.tab.single-type-title'),
                            defaultMessage: 'Content',
                        })}
                    </Typography>
                </Tab>
                <Tab>
                    <Typography variant="pi">
                        {formatMessage({
                            id: getTrad('ChatGPTPage.tab.single-type-title'),
                            defaultMessage: 'Appearance',
                        })}
                    </Typography>
                </Tab>
                <Tab>
                    <Typography variant="pi">
                        {formatMessage({
                            id: getTrad('ChatGPTPage.tab.single-type-title'),
                            defaultMessage: 'Script',
                        })}
                    </Typography>
                </Tab>
            </Tabs>
            <TabPanels>
                <TabPanel>
                    <Box padding={4}>
                        <Content
                            executiveImage={executiveImage}
                            setExecutiveImage={setExecutiveImage}
                            companyLogo={companyLogo || ChatIcon}
                            setCompanyLogo={setCompanyLogo}
                            headerContent={headerContent}
                            setHeaderContent={setHeaderContent}
                            supportMessageContent={supportMessageContent}
                            setSupportMessageContent={setSupportMessageContent}
                            colors={colors}
                            setColors={setColors}
                            widgetPosition={widgetPosition}
                        />
                    </Box>
                </TabPanel>
                <TabPanel>
                    <Box padding={4}>
                        <Appearance
                            setColors={setColors}
                            colors={colors}
                            supportMessageContent={supportMessageContent}
                            headerContent={headerContent}
                            companyLogo={companyLogo}
                            executiveImage={executiveImage}
                            widgetPosition={widgetPosition}
                            setWidgetPosition={setWidgetPosition}
                        />
                    </Box>
                </TabPanel>
                <TabPanel>
                    <Box padding={4}>
                        <ScriptModal
                            copyToClipboard={copyToClipboard}
                            frontendHost={frontendHost}
                            setFrontendHost={setFrontendHost}
                            backendHost={backendHost}
                            setBackendHost={setBackendHost}
                        />
                    </Box>
                </TabPanel>
            </TabPanels>
        </TabGroup>
    );
};

export default WidgetMain;
