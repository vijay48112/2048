import * as React from "react";
import { observer } from "mobx-react";
import { Avatar, Card, Flex, Text, Checkbox, FlexItem, Button } from '@fluentui/react-northstar';
import "./game.scss";
import {UxUtils} from "../../utils/UxUtils"
import Game from "./2048/Game";
import { Constants } from "../../utils/Constants";

@observer
export default class InstructionView extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            startGame: false,
        };
        this.onButtonClick = this.onButtonClick.bind(this);
    }
    onButtonClick() {
        this.setState({
            startGame: true
        })
    }
    
    render() {
        return (
            this.state.startGame ?
                <Game /> :
                <Flex className="body-container instruction" column gap="gap.medium">
                    {this.renderInstruction()}
                    {this.renderFooterSection()}
                </Flex>
        )
    }

    renderInstruction(isMobileView?: boolean): JSX.Element {
        return (
            <div>
                <Card aria-roledescription="card avatar" fluid style={{backgroundColor:'rgb(250, 249, 248)'}}>
                    <Card.Header fitted>
                        <Flex gap="gap.small">
                            <Flex column>
                                <Avatar image={Constants.GAME_LOGO_PATH} label="2048" name="Evie yundt" size="larger" />
                            </Flex>
                            <Flex column>
                                <Text content={this.props.HowToPlay} weight="bold" size="large" />
                                <Text content={this.props.InstructionContent} styles={{ paddingTop: "4px" }} />
                            </Flex>
                        </Flex>
                    </Card.Header>
                </Card>
                <Checkbox className="checklist-checkbox" label={this.props.DontShowTheGameInstruction} styles={{ padding: "16px" }} 
                onChange = {
                    () => {
                        UxUtils.setLocaStorge()
                    }
                }/>
            </div>
        );
    }
    renderFooterSection(isMobileView?: boolean): JSX.Element {
        let className = isMobileView ? "" : "footer-layout";
        return (
            <Flex className={className} gap={"gap.smaller"}>
                <FlexItem push>
                    <Button
                        primary
                        content="Next"
                        onClick={() => {
                           this.onButtonClick();
                        }}>
                    </Button>
                </FlexItem>
            </Flex>
        );
    }
}