// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as React from "react";
import { observer } from "mobx-react";
import getStore from "../../store/ResponseStore";
import "./game.scss";
import { Localizer } from "../../utils/Localizer";
import { ErrorView } from "../ErrorView";
import { ProgressState } from "./../../utils/SharedEnum";
import { ActionSdkHelper } from "../../helper/ActionSdkHelper";
import InstructionView from "./InstructionView";
import { UxUtils } from "../../utils/UxUtils";
import { Flex } from "@fluentui/react-northstar";
import GAME from "./2048/Game";
import CongratulationView from "./CongrtulationView";

/**
 * <GamePage> component for game app
 * @observer decorator on the component this is what tells MobX to rerender the component whenever the data it relies on changes.
 */
@observer
export default class GamePage extends React.Component<any, any> {
    render() {

        let progressStatus = getStore().progressState;

        if (progressStatus.actionInstance == ProgressState.InProgress ||
            progressStatus.currentContext == ProgressState.InProgress ||
            progressStatus.currentUserDataInstance == ProgressState.InProgress ||
            progressStatus.localizationInstance == ProgressState.InProgress ||
            progressStatus.settingInstance == ProgressState.InProgress) {
            return <div />;
        } else if (progressStatus.actionInstance == ProgressState.Failed ||
            progressStatus.currentContext == ProgressState.Failed ||
            progressStatus.currentUserDataInstance == ProgressState.Failed ||
            progressStatus.localizationInstance == ProgressState.Failed ||
            progressStatus.settingInstance == ProgressState.Failed) {
            ActionSdkHelper.hideLoadingIndicator();
            return (
                <ErrorView
                    title={Localizer.getString("GameError")}
                    buttonTitle={Localizer.getString("Close")}
                />
            );
        } else {
            ActionSdkHelper.hideLoadingIndicator();
            if (getStore().shouldPlayerPlay) {
                if (UxUtils.shouldShowInstructionPage()) {
                    return this.getInstructionPage();
                } else {
                    return this.getGamePage();
                }
            } else {
                return this.getCongratulationPage();
            }
        }
    }

    // get instruction content based on the device 
    getInstructionContent(): string {
        if (UxUtils.renderingForMobile()) {
            return Localizer.getString("HowToPlayForMobile");
        } else {
            return Localizer.getString("HowToPlayForDesktop");
        }
    }

    /**
     * Method to return game app component
    **/
    private getGamePage(): JSX.Element {
        return <GAME  tabIndex = {0}/>;
    }

    // Method to render game instruction 
    private getInstructionPage(): JSX.Element {
        return (<InstructionView
            DontShowTheGameInstruction={Localizer.getString("DontShowTheGameInstruction")}
            InstructionContent={this.getInstructionContent()}
            HowToPlay={Localizer.getString("HowToPlay")}
            Play = {Localizer.getString("PlayButton")}
        />);
    }

    // Method to render congratualtion view
    private getCongratulationPage(): JSX.Element {
        return (
            <Flex
                column
                className="body-container"
                id="bodyContainer"
            >
                <CongratulationView gameScore={getStore().playerPrevScore} shouldShowAlert="true" />
            </Flex>
        );
    }
}
