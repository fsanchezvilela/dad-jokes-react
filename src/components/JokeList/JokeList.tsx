import React, { Component } from 'react';
import Joke from '../Joke/Joke';
import axios from 'axios';
import uuid from 'uuid/v4';
import './JokeList.css';

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
            jokes: [],
        };
    }
    public async componentDidMount() {
        //Load Jokes
        let jokes = [];
        while (jokes.length < this.props.numJokesToGet) {
            let res = await axios.get('https://icanhazdadjoke.com/', {
                headers: { Accept: 'application/json' },
            });
            jokes.push({ id: uuid(), text: res.data.joke, votes: 0 });
        }
        this.setState({ jokes: jokes });
    }
    private handleVote(id: string | number, delta: number): void {
        this.setState(st => ({
            jokes: st.jokes.map((j: any) => {
                return j.id === id ? { ...j, votes: j.votes + delta } : j;
            }),
        }));
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
                    <button className="JokeList-getmore">New Jokes</button>
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
