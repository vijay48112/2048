// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as React from "react";
import { observer } from "mobx-react";
import getStore from "./../../store/UpdationStore";
import "./game.scss";
import { Localizer } from "../../utils/Localizer";
import { ErrorView } from "../ErrorView";
import { ProgressState } from "./../../utils/SharedEnum";
import { ActionSdkHelper } from "../../helper/ActionSdkHelper";
import InstructionView from "./InstructionView";
import { UxUtils } from "../../utils/UxUtils";
import { Flex, Loader } from "@fluentui/react-northstar";
import Game from "./2048/Game"
import CongratulationView from "./CongrtulationView";
/**
 * 
 * @observer decorator on the component this is what tells MobX to rerender the component whenever the data it relies on changes.
 */
@observer
export default class GamePage extends React.Component<any, any> {
    render() {
        let hostContext: actionSDK.ActionSdkContext = getStore().context;
        if (hostContext) {
            ActionSdkHelper.hideLoadingIndicator();
        } else {
            if (getStore().progressState == ProgressState.NotStarted || getStore().progressState == ProgressState.InProgress) {
                return <Loader />;
            }
        }

        if (getStore().isActionDeleted) {
            ActionSdkHelper.hideLoadingIndicator();
            return (
                <ErrorView
                    title={Localizer.getString("GameDeletedError")}
                    subtitle={Localizer.getString("ChecklistDeletedErrorDescription")}
                    buttonTitle={Localizer.getString("Close")}
                    image={"./images/actionDeletedError.png"}
                />
            );
        }

        if (getStore().progressState == ProgressState.Failed) {
            ActionSdkHelper.hideLoadingIndicator();
            return (
                <ErrorView
                    title={Localizer.getString("GameError")}
                    buttonTitle={Localizer.getString("Close")}
                />
            );
        }

        if (getStore().progressState == ProgressState.Completed) {
            ActionSdkHelper.hideLoadingIndicator();
        }

        if (getStore().shouldPlayerPlay) {
            if (UxUtils.shouldShowInstructionPage()) {
                return this.getInstructionPage();
            }
            else {
                return this.getGamePage();
            }
        }
        else {
            return this.getCongratulationPage();
        }
    }
    /**
     * Method to return the view based on the game settings
    **/
   
    private getGamePage(): JSX.Element {
        return <Game />
    }
    private getInstructionPage(): JSX.Element {
        return (<InstructionView
            DontShowTheGameInstruction={Localizer.getString("DontShowTheGameInstruction")}
            InstructionContent={this.getInstructionContent()}
            HowToPlay={Localizer.getString("HowToPlay")}
            Play = {Localizer.getString("PlayButton")}
        />);
    }

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

    getInstructionContent(): string {
        if (UxUtils.renderingForMobile()) {
            return Localizer.getString("HowToPlayForMobile");
        }
        else {
            return Localizer.getString("HowToPlayForDesktop");
        }
    }
    
    delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
