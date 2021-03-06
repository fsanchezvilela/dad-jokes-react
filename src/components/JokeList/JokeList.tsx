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
    loading: boolean;
};
class JokeList extends Component<IProps, IState> {
    static defaultProps = {
        numJokesToGet: 10,
    };

    public constructor(props: IProps) {
        super(props);
        this.state = {
            jokes: JSON.parse(window.localStorage.getItem('jokes') || '[]'),
            loading: false,
        };
        this.seenJokes = new Set(
            this.state.jokes.map((j: any) => {
                return j.text;
            }),
        );
        this.handleClick = this.handleClick.bind(this);
    }
    //fix duplicate joke bug
    private seenJokes = new Set();

    public componentDidMount() {
        const { jokes } = this.state;
        if (jokes.length === 0) {
            this.setState({ loading: true });
            this.getJokes();
        }
    }

    private async getJokes(): Promise<void> {
        try {
            //Load Jokes
            let jokes: { id: string; text: any; votes: number }[] = [];
            while (jokes.length < this.props.numJokesToGet) {
                let res = await axios.get('https://icanhazdadjoke.com/', {
                    headers: { Accept: 'application/json' },
                });
                let newJoke = res.data.joke;
                if (!this.seenJokes.has(newJoke)) {
                    jokes.push({ id: uuid(), text: newJoke, votes: 0 });
                } else {
                    console.log('Found a duplicate!');
                    console.log(newJoke);
                }
            }
            this.setState(
                st => ({
                    loading: false,
                    jokes: [...st.jokes, ...jokes],
                }), //updated and set local storage
                () => window.localStorage.setItem('jokes', JSON.stringify(this.state.jokes)),
            );
        } catch (e) {
            alert(e);
            this.setState({ loading: false });
        }
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
        this.setState({ loading: true }, this.getJokes);
    }

    public render(): JSX.Element {
        let sortJokes = this.state.jokes.sort((a: any, b: any) => b.votes - a.votes);
        if (this.state.loading) {
            return (
                <div className="JokeList-spinner">
                    <i className="far fa-8x fa-laugh fa-spin"></i>
                    <h1 className="JokeList-title">Loading...</h1>
                </div>
            );
        }
        return (
            <div className="JokeList">
                <div className="JokeList-sidebar">
                    <h1 className="JokeList-title">
                        <span>Dad</span> Jokes
                    </h1>
                    <img
                        src="https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg"
                        alt="joke-icon"
                    />
                    <button onClick={this.handleClick} className="JokeList-getmore">
                        Fetch Jokes
                    </button>
                </div>

                <div className="JokeList-jokes">
                    {sortJokes.map((j: any) => (
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
