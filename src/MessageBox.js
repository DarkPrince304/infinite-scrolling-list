import React from 'react';
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import './MessageBox.css';

class MessageBox extends React.Component {
    render() {
        const { authorName, authorImg, content, timeStamp } = this.props;
        return (
            <div style={{ pointerEvents: 'none' }}>
                <Paper className="message-box__card" elevation={3}>
                    <Grid
                        container
                        wrap="nowrap"
                        direction="column"
                        alignItems="center"
                        spacing={2}
                    >
                        <Grid item xs={12} container justify="center" alignItems="center" spacing={3}>
                            <Avatar alt={authorName} src={authorImg} />
                            <Grid item xs container direction="column">
                                <Typography className="message-box__author-text">{authorName}</Typography>
                                <Typography className="message-box__time" style={{ fontSize: 12 }}>{new Date(timeStamp).toLocaleString()}</Typography>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Typography>{content}</Typography>
                        </Grid>
                    </Grid>
                </Paper>
            </div>
        )
    }
}

export default MessageBox;