import React from 'react';
import MessageBox from './MessageBox';
import { CircularProgress } from '@material-ui/core';
import './App.css';

const API_URL = "http://message-list.appspot.com";

class MessageList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            items: {},
            topItemKey: 0,
            bottomItemKey: 19,
            nextToken: '',
            prevMiddleOffsetTop: 0,
            scrolledDown: false,
            count: 0
        }
        this.scrolledDown = false;
        this.prevFirstTopOffsets = [];
        this.observer = null;
        this.listRef = React.createRef();
        this.firstItem = React.createRef();
        this.lastItem = React.createRef();
        this.middleItem = React.createRef();
        this.clientX = 0;
        this.topIntersectionHandler = this.topIntersectionHandler.bind(this);
        this.bottomIntersectionHandler = this.bottomIntersectionHandler.bind(this);
        this.fetchMessages = this.fetchMessages.bind(this);
        this.intersectionObserverCallback = this.intersectionObserverCallback.bind(this);
        this.onTouchMoveHandler = this.onTouchMoveHandler.bind(this);
        this.onTouchStartHandler = this.onTouchStartHandler.bind(this);
    }

    fetchMessages(newTopItemKey, newBottomItemKey, prevMiddleOffsetTop) {
        const { nextToken } = this.state;
        fetch(`${API_URL}/messages?limit=10&pageToken=${nextToken}`)
            .then(res => res.json())
            .then(result => {
                if (this.scrolledDown) {
                    this.prevFirstTopOffsets[this.state.topItemKey / 10] = this.firstItem.current.offsetTop;
                }
                this.setState(prevState => ({
                    items: [...prevState.items, ...result.messages],
                    nextToken: result.pageToken,
                    topItemKey: newTopItemKey,
                    bottomItemKey: newBottomItemKey,
                    prevMiddleOffsetTop,
                    count: prevState.count + 10
                }));
            })
    }

    topIntersectionHandler() {
        this.scrolledDown = false;
        if (this.state.topItemKey === 0) {
            return;
        } else {
            this.setState(prevState => ({
                topItemKey: prevState.topItemKey - 10,
                bottomItemKey: prevState.bottomItemKey - 10,
                count: prevState.count - 10
            }))
        }
    }

    bottomIntersectionHandler() {
        this.scrolledDown = true;
        if (this.state.items.length > this.state.count) {
            this.prevFirstTopOffsets[this.state.topItemKey / 10] = this.firstItem.current.offsetTop;
            this.setState(prevState => ({
                topItemKey: this.state.bottomItemKey - 9,
                bottomItemKey: this.state.bottomItemKey + 10,
                prevMiddleOffsetTop: this.middleItem.current.offsetTop,
                count: prevState.count + 10
            }));
        } else {
            this.fetchMessages(
                this.state.bottomItemKey - 9,
                this.state.bottomItemKey + 10,
                this.middleItem.current.offsetTop
            );
        }
    }

    intersectionObserverCallback(entries, observer) {
        entries.forEach(entry => {
            if (entry.target.id === 'message-item-0' && entry.isIntersecting) {
                this.topIntersectionHandler(entry);
            } else if (entry.target.id === `message-item-18` && entry.isIntersecting) {
                this.bottomIntersectionHandler(entry);
            }
        });
    }

    componentDidMount() {
        fetch(`${API_URL}/messages?limit=20`)
            .then(res => res.json())
            .then(result => {
                this.observer = new IntersectionObserver(this.intersectionObserverCallback);
                this.setState({
                    isLoading: false,
                    items: result.messages,
                    nextToken: result.pageToken,
                    count: 20
                });
            })
    }

    componentDidUpdate() {
        this.observer.observe(this.firstItem.current);
        this.observer.observe(this.lastItem.current);
        if (this.scrolledDown) {
            const newPaddingTop = this.state.prevMiddleOffsetTop - 8;
            this.listRef.current.style.paddingTop = `${newPaddingTop}px`;
            this.scrolledDown = false;
        } else if (!this.scrolledDown) {
            const newPaddingTop = this.prevFirstTopOffsets[this.state.topItemKey / 10] - 8;
            this.listRef.current.style.paddingTop = `${newPaddingTop}px`;
        }
    }

    onTouchStartHandler(event) {
        this.clientX = event.targetTouches[0].clientX;
    }

    onTouchMoveHandler(event) {
        const draggable = event.target;
        var touch = event.targetTouches[0];
        if (Math.abs(touch.pageX) - Math.abs(this.clientX) > 100) {
            draggable.style.left = window.visualViewport.width + "px";
            draggable.style.transitionProperty = "left";
            draggable.style.transitionDuration = "500ms";
            setTimeout(() => {
                draggable.remove()
            }, 500);
        }
    }

    render() {
        if (this.state.isLoading) {
            return <CircularProgress className="loader-style"/>
        }
        const items = this.state.items.slice(this.state.topItemKey, this.state.bottomItemKey + 1);
        return (
            <div
                className="message-list"
                ref={this.listRef}
            >
                {
                    items.map((item, index) => {
                        let ref = null;
                        if (index === 0) {
                            ref = this.firstItem;
                        } else if (index === items.length / 2) {
                            ref = this.middleItem;
                        } else if (index === items.length - 2) {
                            ref = this.lastItem;
                        }
                        return (
                            <div
                                key={index}
                                ref={ref}
                                id={`message-item-${index}`}
                                style={{ position: 'relative', left: 0 }}
                                onTouchStart={this.onTouchStartHandler}
                                onTouchMove={this.onTouchMoveHandler}
                            >
                                <MessageBox
                                    authorName={item.author.name}
                                    authorImg={`${API_URL}/${item.author.photoUrl}`}
                                    timeStamp={item.updated}
                                    content={item.content}
                                />
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}

export default MessageList;