import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Paper,
  List,
  ListItem,
  AppBar,
  Toolbar,
  IconButton,
  Modal,
  ListItemText
} from "@material-ui/core";
import {withStyles, makeStyles} from "@material-ui/core/styles";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import SendIcon from "@material-ui/icons/Send";
import vectorData from "./vectorDataCV.json";
import {askQuestion} from "./api";
import {AVAILABLE_MODELS, MODEL_PROVIDERS} from "./config/constants";
// import StyleContext from "../../contexts/StyleContext";
import "./Chat.css";

const MessageList = withStyles(theme => ({
  root: {
    flex: 1,
    overflow: "auto",
    padding: "20px"
  }
}))(List);

const useMessageBubbleStyles = makeStyles({
  root: props => ({
    maxWidth: "80%",
    padding: "12px 16px",
    borderRadius: 15,
    marginBottom: 10,
    backgroundColor: `${props.isUser ? "#1976d2" : "#F3F3F3"} !important`,
    color: `${props.isUser ? "#ffffff" : "#000000"} !important`,
    alignSelf: props.isUser ? "flex-end" : "flex-start",
    marginLeft: props.isUser ? "20%" : 0,
    marginRight: props.isUser ? 0 : "20%"
  })
});

const MessageBubble = props => {
  const classes = useMessageBubbleStyles(props);
  return <Paper className={classes.root} {...props} />;
};

const TimeStamp = withStyles(theme => ({
  root: {
    fontSize: "0.75rem",
    color: "#666",
    marginTop: "4px",
    textAlign: "right"
  }
}))(Typography);

const InputContainer = withStyles(theme => ({
  root: {
    display: "flex",
    padding: "20px",
    gap: "10px",
    borderTop: `1px solid ${theme.palette.divider}`,
    backgroundColor: "white"
  }
}))(Box);

const ModelModalContent = withStyles(theme => ({
  root: {
    width: "90%",
    maxWidth: 400,
    maxHeight: "80vh",
    overflow: "auto",
    padding: theme.spacing(3),
    borderRadius: 15,
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)"
  }
}))(Paper);

export default function Chat() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      id: "1",
      text: "Hello! I'm your AI assistant. I can answer questions about Erdogan's CV. How can I help you?",
      isUser: false,
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModelPicker, setShowModelPicker] = useState(false);
  const [selectedModel, setSelectedModel] = useState(
    AVAILABLE_MODELS[MODEL_PROVIDERS.OPENROUTER][0]
  );
  const [loadingModels] = useState(false);
  // const {isDark} = useContext(StyleContext);

  const handleSend = async () => {
    if (!inputText.trim() || loading) return;

    const question = inputText.trim();
    setInputText("");
    setLoading(true);

    const userMessage = {
      id: Date.now().toString(),
      text: question,
      isUser: true,
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await askQuestion(
        vectorData.vectorData,
        question,
        selectedModel.id
      );

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        text: response.answer || response.text,
        isUser: false,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, there was an error processing your question. Please try again.",
        isUser: false,
        isError: true,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = event => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <Box sx={{
      display: "flex", 
      flexDirection: "column",
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate("/")}
            style={{marginRight: 16}}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" style={{flexGrow: 1}}>
            Chat with Erdogan's CV
          </Typography>
          <Button
            variant="contained"
            style={{
              textTransform: "none",
              backgroundColor: "white",
              color: "#1976d2",
              borderRadius: "20px",
              padding: "6px 16px",
              boxShadow: "none"
            }}
            onClick={() => setShowModelPicker(true)}
            disabled={loadingModels}
          >
            {loadingModels ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              selectedModel.name
            )}
          </Button>
        </Toolbar>
      </AppBar>

      <MessageList>
        {messages.map(message => (
          <ListItem
            key={message.id}
            style={{
              display: "flex",
              justifyContent: message.isUser ? "flex-end" : "flex-start",
              flexDirection: "column",
              alignItems: message.isUser ? "flex-end" : "flex-start",
              padding: 0 // Add this to remove default padding
            }}
          >
            <MessageBubble isUser={Boolean(message.isUser)} elevation={1}>
              <Typography>{message.text}</Typography>
            </MessageBubble>
            <TimeStamp variant="caption">{message.timestamp}</TimeStamp>
          </ListItem>
        ))}
      </MessageList>

      {/* Predefined Questions Section */}
      <Box sx={{ 
        padding: "10px 20px", 
        display: "flex", 
        flexWrap: "nowrap", 
        gap: "10px",
        borderTop: "1px solid rgba(0, 0, 0, 0.12)",
        backgroundColor: "#f5f5f5",
        overflowX: "auto",
        whiteSpace: "nowrap",
        msOverflowStyle: "none", /* IE and Edge */
        scrollbarWidth: "none", /* Firefox */
        "&::-webkit-scrollbar": {
          display: "none" /* Chrome, Safari, Opera */
        }
      }}>
        {[
          "Summarize Erdogan's education",
          "Does Erdogan know AI?",
          "What are Erdogan's technical skills?",
          "What projects has Erdogan worked on?",
          "Tell me about Erdogan's work experience"
        ].map((question, index) => (
          <Button
            key={index}
            variant="outlined"
            size="small"
            onClick={() => {
              setInputText(question);
              // Optional: automatically send the question
              // setTimeout(() => handleSend(), 100);
            }}
            style={{
              borderRadius: "18px",
              textTransform: "none",
              backgroundColor: "white",
              fontSize: "0.85rem",
              padding: "4px 12px",
              color: "#1976d2",
              borderColor: "#1976d2",
              whiteSpace: "nowrap",
              flexShrink: 0
            }}
          >
            {question}
          </Button>
        ))}
      </Box>

      <InputContainer>
        <TextField
          fullWidth
          multiline
          maxRows={4}
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask a question..."
          disabled={loading}
          variant="outlined"
          style={{backgroundColor: "white"}}
          InputProps={{
            sx: {
              "&.Mui-focused": {
                fieldset: {
                  borderColor: "rgba(0, 0, 0, 0.23) !important",
                  borderWidth: "1px !important"
                }
              }
            }
          }}
        />
        <Button
          variant="contained"
          color={!inputText.trim() || loading ? "default" : "primary"}
          onClick={handleSend}
          disabled={loading || !inputText.trim()}
          style={{minWidth: "auto", padding: "0 24px"}}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            <SendIcon />
          )}
        </Button>
      </InputContainer>

      <Modal
        open={showModelPicker}
        onClose={() => setShowModelPicker(false)}
        aria-labelledby="model-picker-modal"
      >
        <ModelModalContent>
          <Typography variant="h6" gutterBottom>
            Select Model
          </Typography>
          <List>
            {AVAILABLE_MODELS[MODEL_PROVIDERS.OPENROUTER].map(model => (
              <ListItem
                button
                key={model.id}
                onClick={() => {
                  setSelectedModel(model);
                  setShowModelPicker(false);
                }}
                selected={model.id === selectedModel?.id}
              >
                <ListItemText primary={model.name} secondary={model.provider} />
              </ListItem>
            ))}
          </List>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => setShowModelPicker(false)}
            style={{marginTop: 16}}
          >
            Close
          </Button>
        </ModelModalContent>
      </Modal>
    </Box>
  );
}
