
import Controller from "sap/ui/core/mvc/Controller";
import JSONModel from "sap/ui/model/json/JSONModel";
import Event from "sap/ui/base/Event";
import ToolPage from "sap/tnt/ToolPage";
import SideNavigation from "sap/tnt/SideNavigation";
import NavContainer from "sap/m/NavContainer";
import HBox from "sap/m/HBox";
import Switch from "sap/m/Switch";
import Text from "sap/m/Text";
import TextArea from "sap/m/TextArea";
import Button from "sap/m/Button";
import VBox from "sap/m/VBox";
import Page from "sap/m/Page";
/**
 * @namespace com.chat.myapp
 */
export default class ShellBarWithSplitApp extends Controller {
    private oModel: JSONModel;

    onInit(): void {
        this.oModel = new JSONModel();
        this.oModel.loadData(sap.ui.require.toUrl("sap/f/sample/ShellBarWithSplitApp/model/model.json"));
        this.getView().setModel(this.oModel);

		this.oModel.attachRequestCompleted(() => {
			const sideNav = this.byId("sideNav") as SideNavigation;
			sideNav.setSelectedKey("root1");
		});
    }

    onInputChange(event: Event): void {
        const inputField = event.getSource() as TextArea;
        const text = inputField.getValue().trim();
        const sendButton = this.byId("sendBtn") as Button;
        
        // Enable send button only when there's text in the input
        sendButton.setEnabled(text.length > 0);
    }

    onStartNewChat(event: Event): void {
        // Get the current browser location
        const currentLocation = window.location.href;
    
        // Reload the page
        window.location.href = currentLocation;
    }

    onInitializeChat(event: Event): void {
        const downloadButton = this.byId("downloadBtn") as Button;
        const startNewChatButton = this.byId("newChatButton") as Button;

        // Hide the greeting and suggestion elements
        const greetingBox = this.byId("greetingBox") as VBox;
        const suggestionToggle = this.byId("suggestionToggle") as HBox;
        const suggestionButtons = this.byId("suggestionButtons") as HBox;
        const textArea = this.getView().byId("userInputTextArea") as TextArea; // Make sure to give your TextArea an ID
        const userText = textArea.getValue();
        // Get the page with ID "root1"
        const chatPage = this.byId("root1") as Page;
        // Get reference to the userInteractionBox (which contains the input)
        const userInteractionBox = this.byId("userInteractionBox") as VBox;

        // Create a new container for the chat messages or get the existing one
        let chatContainer = this.byId("chatContainer") as VBox;

        if (!chatContainer) {
            // First time initialization - create the container
            chatContainer = new VBox(this.createId("chatContainer"), {
                width: "100%"
            });

            // Insert the chat container before the userInteractionBox
            const pageContent = chatPage.getContent();
            const interactionBoxIndex = pageContent.indexOf(userInteractionBox);
            console.log(interactionBoxIndex);
            
            if (interactionBoxIndex !== -1) {
                // Insert the chat container right before the userInteractionBox
                chatPage.insertContent(chatContainer, interactionBoxIndex);
            } else {
                // Fallback: add to the beginning of the content
                chatPage.insertContent(chatContainer, 0);
            }
        
            
            // Destroy the greeting and suggestion elements as they're no longer needed
            if (greetingBox) {
                greetingBox.destroy();
            }
            
            if (suggestionToggle) {
                suggestionToggle.destroy();
            }
            
            if (suggestionButtons) {
                suggestionButtons.destroy();
            }
        }
        // Create user message bubble
        const userMessage = new HBox({
            justifyContent: "End",
            width: "100%",
            items: [
                new VBox({
                    items: [
                        new Text({
                            text: userText
                        }).addStyleClass("userMessageText")
                    ]
                }).addStyleClass("userMessageBubble")
            ]
        }).addStyleClass("userMessageContainer");

        // Add the user message to the chat container
        chatContainer.addItem(userMessage);

        // Create and add suggestion buttons (only add if they don't already exist)
        let suggestionButtonsContainer = this.byId(this.createId("suggestionButtonsContainer")) as HBox;
        
        if (!suggestionButtonsContainer) {
            suggestionButtonsContainer = new HBox(this.createId("suggestionButtonsContainer"), {
                justifyContent: "Center",
                width: "100%",
                items: [
                    new Button({
                        text: "Make it sound friendly",
                        type: "Default",
                        press: function(this: ShellBarWithSplitApp) {
                            const textArea = this.getView().byId("userInputTextArea") as TextArea;
                            textArea.setValue("Make it sound friendly");
                            const sendBtn = this.byId("sendBtn") as Button;
                            sendBtn.setEnabled(true);
                        }.bind(this)
                    }).addStyleClass("sapUiTinyMargin"),
                    
                    new Button({
                        text: "How do I justify budget request?",
                        type: "Default",
                        press: function(this: ShellBarWithSplitApp) {
                            const textArea = this.getView().byId("userInputTextArea") as TextArea;
                            textArea.setValue("How do I justify budget request?");
                            const sendBtn = this.byId("sendBtn") as Button;
                            sendBtn.setEnabled(true);
                        }.bind(this)
                    }).addStyleClass("sapUiTinyMargin"),
                    
                    new Button({
                        text: "How to make it persuasive?",
                        type: "Default",
                        press: function(this: ShellBarWithSplitApp) {
                            const textArea = this.getView().byId("userInputTextArea") as TextArea;
                            textArea.setValue("How to make it persuasive?");
                            const sendBtn = this.byId("sendBtn") as Button;
                            sendBtn.setEnabled(true);
                        }.bind(this)
                    }).addStyleClass("sapUiTinyMargin")
                ]
            }).addStyleClass("sapUiSmallMarginTop sapUiSmallMarginBottom");
        
        // Add the suggestion buttons before the userInteractionBox
        const pageContent = chatPage.getContent();
        const interactionBoxIndex = pageContent.indexOf(userInteractionBox);
        
        if (interactionBoxIndex !== -1) {
            chatPage.insertContent(suggestionButtonsContainer, interactionBoxIndex);
        }
    }
    
        
        // Clear the input field
        textArea.setValue("");
        
        // Disable the send button since the input is now empty
        const sendButton = this.byId("sendBtn") as Button;
        sendButton.setEnabled(false);
        downloadButton.setEnabled(true);
        startNewChatButton.setEnabled(true);

    }

    onTogglePopoverSaveVisibility(event: Event): void {
        const switchState = event.getSource() as Switch;
        const isVisible = switchState.getState();
        const hintText = this.byId("hintText") as Text;
        const suggestionButtons = this.byId("suggestionButtons") as HBox;
        
        // When switch is ON (true), show suggestion buttons and hide hint text
        if (isVisible) {
            suggestionButtons.setVisible(true);
            hintText.setVisible(false);
        } 
        // When switch is OFF (false), hide suggestion buttons and show hint text
        else {
            suggestionButtons.setVisible(false);
            hintText.setVisible(true);
        }
    }

	onItemSelect(event: Event): void {
		const sideNav = event.getSource() as SideNavigation;
		const selectedKey = sideNav.getSelectedKey();
		const pageContainer = this.byId("pageContainer") as NavContainer;
		pageContainer.to(this.getView().createId(selectedKey));
	}
    onClicked(): void {
        console.log("clicked");
    }
    onMenuButtonPress(): void {
        const toolPage = this.byId("toolPage") as ToolPage;
        toolPage.setSideExpanded(!toolPage.getSideExpanded());
    }

    onSystemPress(): void {
        window.open("https://pages.github.tools.sap/Artificial-Intelligence-CoE/cpit-genai-platform-models-cookbook/", "_blank");
    }

    onEducationPress(): void {
        window.open("https://wiki.one.int.sap/wiki/display/IECOE/GAI02+Public+documentation", "_blank");
    }
}
