import * as React from 'react';
import './Joke.css';
export interface IJokeProps {
    votes: number;
    text: string;
    upvote: () => void;
    downvote: () => void;
}
export interface IJokeState {}

export default class Joke extends React.Component<IJokeProps, IJokeState> {
    private getColor(): string {
        const { votes } = this.props;
        if (votes >= 15) {
            return '#4caf50';
        } else if (votes >= 12) {
            return '#8bc34a';
        } else if (votes >= 9) {
            return '#cddc39';
        } else if (votes >= 6) {
            return '#ffeb3b';
        } else if (votes >= 3) {
            return '#ffc107';
        } else if (votes >= 0) {
            return '#ff9800';
        } else {
            return '#f44336';
        }
    }

    private getEmoji(): string {
        const { votes } = this.props;
        if (votes >= 15) {
            return 'em em-rolling_on_the_floor_laughing';
        } else if (votes >= 12) {
            return 'em em-laughing';
        } else if (votes >= 9) {
            return 'em em-smiley';
        } else if (votes >= 6) {
            return 'em em-slightly_smiling_face';
        } else if (votes >= 3) {
            return 'em em-neutral_face';
        } else if (votes >= 0) {
            return 'em em-confused';
        } else {
            return 'em em-angry';
        }
    }

    public render(): JSX.Element {
        return (
            <div>
                <div className="Joke">
                    <div className="Joke-buttons">
                        <i className="fas fa-arrow-up" onClick={this.props.upvote}></i>
                        <span className="Joke-votes" style={{ borderColor: this.getColor() }}>
                            {this.props.votes}
                        </span>
                        <i className="fas fa-arrow-down" onClick={this.props.downvote}></i>
                    </div>
                    <div className="Joke-text">{this.props.text}</div>
                    <div className="Joke-smiley">
                        <i className={this.getEmoji()} />
                    </div>
                </div>
            </div>
        );
    }
}
