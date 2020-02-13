import React, { Component } from 'react';
import axios from 'axios';
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
            jokes.push(res.data.joke);
        }
        this.setState({ jokes: jokes });
    }

    public render() {
        return (
            <div className="JokeList">
                <h1>Dad Jokes</h1>
                <div className="JokeList-jokes">
                    {this.state.jokes.map((i: string) => (
                        <div>{i}</div>
                    ))}
                </div>
            </div>
        );
    }
}

export default JokeList;
