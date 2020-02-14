import React, { Component } from 'react';
import Joke from '../Joke/Joke';
import axios from 'axios';
import uuid from 'uuid/v4';
import './JokeList.css';

type asyncFn = () => Promise<boolean>;

type IProps = {
    // using 'interface'
    numJokesToGet: number;
};

type IState = {
    // using 'interface'
    jokes: any;
};
class JokeList extends Component<IProps, IState> {
    static defaultProps = {
        numJokesToGet: 10,
    };

    public constructor(props: IProps) {
        super(props);
        this.state = {
            jokes: JSON.parse(window.localStorage.getItem('jokes') || '[]'),
        };
        this.handleClick = this.handleClick.bind(this);
    }
    public componentDidMount() {
        const { jokes } = this.state;
        if (jokes.length === 0) this.getJokes();
    }

    private async getJokes() {
        //Load Jokes
        let jokes: { id: string; text: any; votes: number }[] = [];
        while (jokes.length < this.props.numJokesToGet) {
            let res = await axios.get('https://icanhazdadjoke.com/', {
                headers: { Accept: 'application/json' },
            });
            jokes.push({ id: uuid(), text: res.data.joke, votes: 0 });
        }
        this.setState(
            st => ({
                jokes: [...st.jokes, ...jokes],
            }), //updated and set local storage
            () => window.localStorage.setItem('jokes', JSON.stringify(this.state.jokes)),
        );
    }

    private handleVote(id: string | number, delta: number): void {
        this.setState(
            st => ({
                jokes: st.jokes.map((j: any) => {
                    return j.id === id ? { ...j, votes: j.votes + delta } : j;
                }),
            }),
            //updated local storage
            () => window.localStorage.setItem('jokes', JSON.stringify(this.state.jokes)),
        );
    }

    private handleClick(): void {
        this.getJokes();
    }

    public render() {
        return (
            <div className="JokeList">
                <div className="JokeList-sidebar">
                    <h1 className="JokeList-title">
                        <span>Jokes</span> Jokes
                    </h1>
                    <img
                        src="https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg"
                        alt="joke-icon"
                    />
                    <button onClick={this.handleClick} className="JokeList-getmore">
                        New Jokes
                    </button>
                </div>

                <div className="JokeList-jokes">
                    {this.state.jokes.map((j: any) => (
                        <Joke
                            upvote={(): void => {
                                return this.handleVote(j.id, 1);
                            }}
                            downvote={(): void => {
                                return this.handleVote(j.id, -1);
                            }}
                            key={j.id}
                            votes={j.votes}
                            text={j.text}
                        />
                    ))}
                </div>
            </div>
        );
    }
}

export default JokeList;
