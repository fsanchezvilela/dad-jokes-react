import * as React from 'react';

export interface IJokeProps {
    votes: number;
    text: string;
    upvote: () => void;
    downvote: () => void;
}
export interface IJokeState {}

export default class Joke extends React.Component<IJokeProps, IJokeState> {
    public render() {
        return (
            <div>
                <div className="Joke">
                    <div className="Joke-buttons">
                        <i className="fas fa-arrow-up" onClick={this.props.upvote}></i>
                        <span>{this.props.votes}</span>
                        <i className="fas fa-arrow-down" onClick={this.props.downvote}></i>
                    </div>
                    <div className="Joke-text">{this.props.text}</div>
                </div>
            </div>
        );
    }
}
