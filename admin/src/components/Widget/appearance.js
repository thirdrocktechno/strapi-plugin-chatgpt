import React from "react";
import { useNotification } from '@strapi/helper-plugin';
import { useTranslation } from "react-i18next";

import Preview from "./Components/Preview";
import CustomSelect from "./Components/Dropdown";
import { WIDGET_POSITIONS, WIDGET_DISABLE_POSITIONS, WIDGET_POSITION_OPTIONS } from "../../utils/constants";

import ExecutivePlaceHolderSmall from '../../public/images/executive-placeholder-small.svg';
import ChatIcon from '../../public/images/chat-icon.svg';

export default function WidgetAppearance({
    setColors,
    colors,
    supportMessageContent,
    headerContent,
    executiveImage,
    companyLogo,
    widgetPosition,
    setWidgetPosition,
}) {
    const toggleNotification = useNotification();
    const { t } = useTranslation();

    function UpdateColor(e) {
        setColors({ ...colors, [e.target.id]: e.target.value });
    }

    return (
        <div>
            <div className="flex">
                <div className="w-1/2 border-r border-custom-LightGrey3">
                    <div className="pt-[34px] px-[34px]">
                        <div className="pb-[22px] flex items-start justify-start">
                            <div className="pr-20">
                                <p className="text-custom-Dark8 text-base pb-0.5 font-medium">{t("widget-appearance.widget-position-label")}</p>
                                <p className="text-custom-Dark3 text-sm">{t("widget-appearance.set-the-chat-widget-position-label")}</p>
                            </div>
                            <div className="w-48">
                                <CustomSelect selectedOption={widgetPosition} options={WIDGET_POSITION_OPTIONS} setSelectedOption={setWidgetPosition} />
                            </div>
                        </div>
                        <div className="pb-[34px]">
                            <div className="shadow-custom-shadow8 rounded-[10px] bg-white w-28 p-[5px] flex flex-wrap">
                                {WIDGET_POSITIONS.map((option, index) => {
                                    return (
                                        <div key={index}>
                                            {(WIDGET_DISABLE_POSITIONS.includes(index) && (
                                                <div className={"border custom-border-grey rounded-md w-6 h-6 m-[5px] bg-gray-100 pointer-events-none"}></div>
                                            )) || (
                                                    <div
                                                        onClick={() => setWidgetPosition(option)}
                                                        className={`border ${widgetPosition.value === option.value
                                                                ? `border-custom-Blue2 rounded-md bg-custom-Blue2`
                                                                : `custom-border-grey rounded-md bg-white`
                                                            } w-6 h-6 m-[5px] cursor-pointer`}
                                                    ></div>
                                                )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="pb-5">
                            <p className="text-custom-Dark8 text-base font-medium pb-6">{t("widget-appearance.widget-color-label")}</p>
                            <div className="flex justify-start items-start">
                                <div className="pr-24">
                                    <div className="pb-6">
                                        <div className="flex justify-start items-center">
                                            <div className="mr-4">
                                                <input
                                                    className="custom-rounded-color-picker border-2"
                                                    type="color"
                                                    id="headerBackground"
                                                    onChange={UpdateColor}
                                                    value={colors?.headerBackground}
                                                />
                                            </div>
                                            <div>
                                                <p className="text-custom-Dark8 text-base leading-none pb-1">{t("widget-appearance.header-bg-label")}</p>
                                                <span className="inline-block text-custom-LightGrey10 text-xs">{colors?.headerBackground}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pb-6">
                                        <div className="flex justify-start items-center">
                                            <div className="mr-4">
                                                <input
                                                    className="custom-rounded-color-picker border-2"
                                                    type="color"
                                                    id="visitorMessageBackground"
                                                    onChange={UpdateColor}
                                                    value={colors?.visitorMessageBackground}
                                                />
                                            </div>
                                            <div>
                                                <p className="text-custom-Dark8 text-base leading-none pb-1">{t("widget-appearance.user-message-label")}</p>
                                                <span className="inline-block text-custom-LightGrey10 text-xs">{colors?.visitorMessageBackground}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pb-6">
                                        <div className="flex justify-start items-center">
                                            <div className="mr-4">
                                                <input
                                                    className="custom-rounded-color-picker border-2"
                                                    type="color"
                                                    id="agentMessageBackground"
                                                    onChange={UpdateColor}
                                                    value={colors?.agentMessageBackground}
                                                />
                                            </div>
                                            <div>
                                                <p className="text-custom-Dark8 text-base leading-none pb-1">{t("widget-appearance.ai-message-label")}</p>
                                                <span className="inline-block text-custom-LightGrey10 text-xs">{colors?.agentMessageBackground}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="pb-6">
                                        <div className="flex justify-start items-center">
                                            <div className="mr-4">
                                                <input
                                                    className="custom-rounded-color-picker border-2"
                                                    type="color"
                                                    id="headerText"
                                                    onChange={UpdateColor}
                                                    value={colors?.headerText}
                                                />
                                            </div>
                                            <div>
                                                <p className="text-custom-Dark8 text-base leading-none pb-1">{t("widget-appearance.header-text-label")}</p>
                                                <span className="inline-block text-custom-LightGrey10 text-xs">{colors?.headerText}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pb-6">
                                        <div className="flex justify-start items-center">
                                            <div className="mr-4">
                                                <input
                                                    className="custom-rounded-color-picker border-2"
                                                    type="color"
                                                    id="visitorText"
                                                    onChange={UpdateColor}
                                                    value={colors?.visitorText}
                                                />
                                            </div>
                                            <div>
                                                <p className="text-custom-Dark8 text-base leading-none pb-1">{t("widget-appearance.user-text-label")}</p>
                                                <span className="inline-block text-custom-LightGrey10 text-xs">{colors?.visitorText}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pb-6">
                                        <div className="flex justify-start items-center">
                                            <div className="mr-4">
                                                <input
                                                    className="custom-rounded-color-picker border-2"
                                                    type="color"
                                                    id="agentText"
                                                    onChange={UpdateColor}
                                                    value={colors?.agentText}
                                                />
                                            </div>
                                            <div>
                                                <p className="text-custom-Dark8 text-base leading-none pb-1">{t("widget-appearance.ai-text-label")}</p>
                                                <span className="inline-block text-custom-LightGrey10 text-xs">{colors?.agentText}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-1/2">
                    <Preview
                        executiveImage={executiveImage ? executiveImage : ExecutivePlaceHolderSmall}
                        companyLogo={companyLogo ? companyLogo : ChatIcon}
                        supportMessageContent={supportMessageContent}
                        headerContent={headerContent}
                        colors={colors}
                        widgetPosition={widgetPosition}
                    />
                </div>
            </div>
        </div>
    );
}
