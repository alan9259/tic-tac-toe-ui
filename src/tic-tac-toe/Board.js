import React from 'react';
import { Container, Grid } from 'semantic-ui-react'
import Square from './Square'
import _ from "lodash";

function Board(props) {
    const rows = _.times(props.game.size, (row) => (
        <Grid.Row columns={props.game.size}>
            {cols(row)}
        </Grid.Row>
    ))

    function cols(row) {
        const items = []

        for (let col = 0; col < props.game.size; col ++) {
            let id = row*props.game.size + col;

            items.push(
                <Grid.Column width={1}>
                    <Square 
                        value={props.game.board[id]}
                        onClick={() => props.onClick(id)}
                    />
                </Grid.Column>
            )
        }

        return items
    }

    return (
        <Container style={{ margin: 20 }}>
            <Grid centered> 
                {rows}
            </Grid>
        </Container>
       
    );
}

export default Board