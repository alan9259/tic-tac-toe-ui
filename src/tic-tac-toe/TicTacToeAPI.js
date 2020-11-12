
import { usePostAPI } from '../common/APIUtil'

export function useNewGame(newGame) {
  const url = 'http://localhost:55227/api/tictactoe/newgame';

  const [state, setBody] = usePostAPI(url, newGame);

  // useEffect(() => {
  //   setBody(newGame);
  // }, [newGame]);
  
  return [state, setBody];
}

export function useNextMove(newMove) {

  const url = 'http://localhost:55227/api/tictactoe/move';
  
  const [state, setBody] = usePostAPI(url, newMove);

  // useEffect(() => {
  //   if (didMountRef.current) {
  //     setBody(newMove);
  //   }
  //   else {
  //     didMountRef.current = true;
  //   }
  // }, [newMove]);

  return [state, setBody];
}